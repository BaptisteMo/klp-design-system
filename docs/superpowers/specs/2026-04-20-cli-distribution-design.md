# KLP UI — CLI distribution design

Date: 2026-04-20
Status: approved
Owner: Baptiste

## Context

The `@klp/ui` repo currently distributes as shadcn-style per-component copy-paste. For the actual use case (personal code-based Figma replacement for demos and experiments across brands Klub / Atlas / Showup / Wireframe), this is too granular. We need:

1. A single command that scaffolds a fresh React project with the full DS preinstalled, a chosen brand hardcoded, and a minimal Claude agent setup.
2. A second command that pulls updates from the DS repo into an existing consumer project, with per-file override/keep selection.

Distribution is not public. Consumers = the author's own machine. Clean, minimal consumer project is the overriding goal.

## Goals

- Clean consumer project: only components, minimal Claude setup, runtime deps, nothing else.
- Components live at `src/components/ui/<name>/` (shadcn flat layout) in the consumer.
- Brand chosen at init, applied via a `<BrandProvider>` in the app layout, hardcoded at scaffold time.
- Updates are batched and interactive: user picks per-file override/keep/conflict-resolve.
- Zero publishing infra. CLI runs via `npx github:BaptisteMo/klp-design-system <cmd>`.
- DS-authoring workflow (playground, `/klp-build-component`, figma refs, scripts) remains unchanged.

## Non-goals

- Public npm publication.
- A marketing/docs site for the DS.
- Production-app scaffolding (no auth, routing, state mgmt, etc.).
- Multi-brand runtime switching in consumer projects.
- Per-component install/uninstall CLI (manifest schema leaves room for it; not shipped now).

## Architecture

Single-repo. DS repo gains `cli/` subdir + `registry/manifest.json`. Existing structure untouched.

```
klp-design-system/
├── cli/                         NEW: user-facing CLI
│   ├── index.mjs                bin entrypoint (router)
│   ├── init.mjs                 init command
│   ├── update.mjs               update command
│   ├── manifest.mjs             fetch + parse registry/manifest.json
│   ├── fetch.mjs                raw.githubusercontent.com downloader
│   ├── diff.mjs                 hash + lockfile diff
│   ├── rewrite.mjs              import path rewriter
│   ├── prompts.mjs              prompts wrapper
│   └── scaffold/                static template files
│       ├── package.json.tmpl
│       ├── vite.config.ts.tmpl
│       ├── tsconfig.json.tmpl
│       ├── index.html.tmpl
│       ├── App.tsx.tmpl
│       ├── main.tsx.tmpl
│       ├── index.css.tmpl
│       └── gitignore.tmpl
├── registry/
│   ├── manifest.json            NEW: distribution index
│   └── <existing>.json          per-component, unchanged
├── src/                         unchanged
├── scripts/
│   ├── build-manifest.ts        NEW: regenerate manifest.json
│   ├── validate-manifest.mjs    NEW: integrity check
│   ├── test-cli.mjs             NEW: CLI smoke test
│   └── <existing>               unchanged
├── .claude/                     source of truth for agents to ship
└── package.json                 add bin + build:manifest script
```

Consumer output after `init`:

```
my-project/
├── src/
│   ├── components/ui/<name>/    copied from DS src/components/<name>/
│   ├── components/brand-provider.tsx
│   ├── lib/cn.ts
│   ├── styles/tokens/{primitives,aliases,theme}.css
│   ├── styles/tokens.css
│   ├── App.tsx                  BrandProvider wired, hardcoded brand
│   ├── main.tsx
│   └── index.css
├── .claude/                     TBD content (structure to be provided by user)
├── klp.lock.json                file → hash + manifest version
├── package.json                 runtime deps only
├── vite.config.ts
├── tsconfig.json
├── index.html
└── .gitignore
```

## Distribution scope

**Ship to consumer:**

- `src/components/**` → rewritten to `src/components/ui/<name>/`
- `src/components/brand-provider.tsx` (new DS component)
- `src/lib/cn.ts`
- `src/styles/tokens/{primitives,aliases,theme}.css`
- `src/styles/tokens.css`
- `.claude/` — subset TBD (structure to be provided by user later)
- Scaffold templates → `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `.gitignore`

**Stay in DS repo only:**

- `scripts/**` (sync-tokens, validate-tokens, batch, build-registry, build-manifest)
- `.klp/` (figma refs, tokens.json source of truth)
- `docs/`, `playground/`, `klp-components.json`, `registry/<individual>.json`
- Root `CLAUDE.md` (DS-authoring rules — different from consumer `.claude/CLAUDE.md` if any)
- Figma-extractor, component-adapter, token-validator, documentalist agents

## Manifest schema

`registry/manifest.json` is the single source of truth for distribution. Generated by `scripts/build-manifest.ts`, committed to the repo.

```json
{
  "version": "0.1.0",
  "generatedAt": "2026-04-20T00:00:00Z",
  "ref": "main",
  "brands": ["wireframe", "klub", "atlas", "showup"],
  "groups": {
    "tokens": {
      "required": true,
      "files": [
        { "src": "src/styles/tokens.css", "dst": "src/styles/tokens.css", "hash": "sha256:..." },
        { "src": "src/styles/tokens/primitives.css", "dst": "src/styles/tokens/primitives.css", "hash": "..." },
        { "src": "src/styles/tokens/aliases.css", "dst": "src/styles/tokens/aliases.css", "hash": "..." },
        { "src": "src/styles/tokens/theme.css", "dst": "src/styles/tokens/theme.css", "hash": "..." }
      ]
    },
    "lib": {
      "required": true,
      "files": [
        { "src": "src/lib/cn.ts", "dst": "src/lib/cn.ts", "hash": "..." }
      ]
    },
    "components": {
      "required": true,
      "items": {
        "brand-provider": {
          "files": [
            { "src": "src/components/brand-provider/BrandProvider.tsx", "dst": "src/components/brand-provider.tsx", "hash": "..." }
          ],
          "deps": { "npm": [], "components": [] }
        },
        "button": {
          "files": [
            { "src": "src/components/button/Button.tsx", "dst": "src/components/ui/button/Button.tsx", "hash": "..." },
            { "src": "src/components/button/index.ts", "dst": "src/components/ui/button/index.ts", "hash": "..." }
          ],
          "deps": {
            "npm": ["@radix-ui/react-slot", "class-variance-authority", "lucide-react"],
            "components": []
          }
        },
        "data-table": {
          "files": [ "..." ],
          "deps": {
            "npm": ["@tanstack/react-table"],
            "components": ["button", "pagination"]
          }
        }
      }
    },
    "claude": {
      "required": true,
      "files": [ "TBD — structure to be provided by user" ]
    },
    "scaffold": {
      "required": true,
      "files": [
        { "src": "cli/scaffold/package.json.tmpl", "dst": "package.json", "hash": "...", "template": true },
        { "src": "cli/scaffold/vite.config.ts.tmpl", "dst": "vite.config.ts", "hash": "...", "template": true },
        { "src": "cli/scaffold/tsconfig.json.tmpl", "dst": "tsconfig.json", "hash": "...", "template": true },
        { "src": "cli/scaffold/index.html.tmpl", "dst": "index.html", "hash": "...", "template": true },
        { "src": "cli/scaffold/main.tsx.tmpl", "dst": "src/main.tsx", "hash": "...", "template": true },
        { "src": "cli/scaffold/App.tsx.tmpl", "dst": "src/App.tsx", "hash": "...", "template": true },
        { "src": "cli/scaffold/index.css.tmpl", "dst": "src/index.css", "hash": "...", "template": true },
        { "src": "cli/scaffold/gitignore.tmpl", "dst": ".gitignore", "hash": "...", "template": true }
      ]
    }
  }
}
```

Notes:

- `src` = path in DS repo; `dst` = path in consumer project.
- `hash` = sha256 of file content; feeds lockfile diff.
- `template: true` → content is interpolated (`{{projectName}}`, `{{brand}}`, `{{npmDeps}}`) before write.
- Scaffold templates (`groups.scaffold.files`) live inside the CLI execution directory (`cli/scaffold/*.tmpl`); since `npx github:` has already downloaded the full repo tarball into a temp dir, the CLI reads them from its local filesystem rather than via GitHub raw. They are listed in the manifest for hash tracking + lockfile symmetry, not for remote fetching. Update command does not re-apply scaffold files by default (one-time init artifacts).
- `deps.npm` aggregates across installed components to compute the consumer's `package.json`.
- `deps.components` resolves transitively (installing `data-table` pulls `button` + `pagination`).
- The `groups.components.items` structure leaves room for future per-component install without changing schema.

## BrandProvider component

New DS component. Hand-authored or via `/klp-build-component`-lite path. Lives at `src/components/brand-provider/BrandProvider.tsx` in the DS repo; shipped to `src/components/brand-provider.tsx` in consumer.

```tsx
import { useEffect, type ReactNode } from 'react'

export type Brand = 'wireframe' | 'klub' | 'atlas' | 'showup'

export function BrandProvider({
  brand,
  children,
}: {
  brand: Brand
  children: ReactNode
}) {
  useEffect(() => {
    document.documentElement.dataset.brand = brand
  }, [brand])
  return <>{children}</>
}
```

Used in the consumer `App.tsx` template:

```tsx
import { BrandProvider } from '@/components/brand-provider'

export default function App() {
  return (
    <BrandProvider brand="{{brand}}">
      <main className="min-h-screen bg-klp-bg-default text-klp-fg-default p-6">
        <h1 className="font-klp-display text-klp-fg-default">klp-ui ready</h1>
      </main>
    </BrandProvider>
  )
}
```

## Init command

Invocation: `npx github:BaptisteMo/klp-design-system init [project-name]`

Flags: `--brand=<name>`, `--pm=<pnpm|npm|yarn|bun>`, `--no-install`, `--no-git`, `--ref=<branch|tag|sha>`, `--verbose`

**Flow:**

1. Parse args. Optional `project-name`. Flags skip corresponding prompt.
2. Prompt for missing values: project name (default `klp-app`), brand (list: wireframe / klub / atlas / showup, default `wireframe`).
3. Target dir check. If exists & non-empty → confirm overwrite or abort.
4. Fetch `registry/manifest.json` from `raw.githubusercontent.com/BaptisteMo/klp-design-system/<ref>/registry/manifest.json`. Cache at `~/.klp/cache/manifest-<sha>.json` with 5-min TTL.
5. Scaffold base — write template files from `cli/scaffold/*.tmpl` with interpolation:
   - `{{projectName}}` → prompt answer
   - `{{brand}}` → selected brand
   - `{{npmDeps}}` → union of all component `deps.npm`
6. Copy DS files — for each group (`tokens`, `lib`, `components`, `claude`):
   - Fetch raw file from GitHub
   - Apply import path rewrite (`cli/rewrite.mjs`): `@/components/<name>/` → `@/components/ui/<name>/`
   - Write to `dst` path, record hash in lockfile buffer
7. Write `klp.lock.json`:

   ```json
   {
     "manifestVersion": "0.1.0",
     "ref": "main",
     "brand": "klub",
     "installedAt": "2026-04-20T00:00:00Z",
     "files": {
       "src/components/ui/button/Button.tsx": { "hash": "sha256:...", "source": "button" }
     }
   }
   ```

8. Install deps — run `<pm> install` in target dir (pm detected from parent lockfile; fresh dir defaults to pnpm).
9. Git init — `git init && git add . && git commit -m "chore: init klp-ui project (brand: <brand>)"`.
10. Print next steps: `cd <project>`, `pnpm dev`.

## Update command

Invocation: `npx github:BaptisteMo/klp-design-system update [--ref=<branch|tag|sha>] [--dry-run] [--verbose]`

**Flow:**

1. Require `klp.lock.json`. If missing → error "run `init` first".
2. Fetch remote manifest at `--ref` (default `main`).
3. Compute diff per file:
   - Not in lockfile → **NEW**
   - Lockfile hash ≠ remote hash:
     - Local hash == lockfile hash → **CHANGED-UPSTREAM** (safe override)
     - Local hash ≠ lockfile hash AND ≠ remote → **CONFLICT** (both changed)
     - Local hash == remote hash → **ALREADY-APPLIED** (silent; refresh lock)
   - Remote hash == lockfile hash:
     - Local hash ≠ lockfile hash → **LOCAL-ONLY-CHANGE** (skip, keep lock)
     - Else → **UNCHANGED** (skip)
   - File in lockfile but not in remote → **REMOVED-UPSTREAM** (offer delete)
4. Print summary:

   ```
   Changes detected:
     NEW              5 files
     CHANGED          3 files (safe override)
     CONFLICT         2 files (both changed)
     REMOVED          1 file
   ```

5. Interactive picker — grouped multiselect:
   - NEW: pre-checked
   - CHANGED: pre-checked
   - CONFLICT: unchecked; `d <file>` shows unified diff
   - REMOVED: unchecked
   - Per-file toggle + group-level toggle; `a` all, `n` none, `enter` apply
6. Apply selections — fetch + write selected; delete selected removed; update lockfile (new hashes, new `manifestVersion`, new `ref`).
7. Deps reconcile — compute new npm deps union. If diff vs current `package.json` → prompt install/remove; run pm accordingly.
8. Print summary report. Suggest `git diff`.

**Edge cases:**

- Brand-specific tokens: brand is a consumer choice, not a file edit — lockfile keeps `brand` untouched.
- Component rename upstream = REMOVED + NEW; user sees both; manual migration.
- Manifest schema version bump → warn; require `--force` to proceed.

**`--dry-run`:** Compute diff, print picker preview, do not fetch or write.

## CLI packaging

`npx github:<user>/<repo>` clones the full repo tarball to a temp dir then runs `bin`. To keep the tarball small:

- `package.json` adds `"files"` field restricting to `["cli", "src", "registry", ".claude", "package.json", "README.md"]`.
- Optional: `.npmignore` excludes `docs/`, `playground/`, `.klp/figma-refs/`, test artifacts.

Runtime CLI deps (added to DS `package.json`):

- One of: `prompts` (lightweight) or `@inquirer/prompts` (richer UX) — pick `prompts`
- `picocolors` (tiny color output)
- Node built-ins only for the rest (`node:fs`, `node:path`, `node:crypto`, `node:child_process`, `node:https`)

Bin declaration:

```json
"bin": { "klp-ui": "./cli/index.mjs" }
```

## DS-repo changes required

**New:**

- `cli/index.mjs` — bin router: `init` / `update` / `--help` / `--version`
- `cli/init.mjs`, `cli/update.mjs`, `cli/manifest.mjs`, `cli/fetch.mjs`, `cli/diff.mjs`, `cli/rewrite.mjs`, `cli/prompts.mjs`
- `cli/scaffold/*.tmpl` (9 template files)
- `scripts/build-manifest.ts` — regenerates `registry/manifest.json`
- `scripts/validate-manifest.mjs` — asserts `src` paths exist, hashes match, component deps resolve
- `scripts/test-cli.mjs` — CLI smoke test
- `registry/manifest.json` — committed artifact
- `src/components/brand-provider/BrandProvider.tsx` + `index.ts`

**Modified:**

- `package.json` — add `bin`, `files`, scripts `build:manifest`, `validate:manifest`, `test:cli`; add CLI deps (`prompts`, `picocolors`)
- `CLAUDE.md` — new section "CLI distribution workflow" describing `pnpm run build:manifest` and when to regenerate

**Unchanged:**

- Existing components.
- `/klp-build-component` pipeline, figma-extractor, component-adapter, token-validator, documentalist.
- Playground.

## Testing

Plain-node assertion scripts. No test framework dep.

**`scripts/test-cli.mjs`** — smoke test:

- Create temp dir `/tmp/klp-test-<uuid>/`
- Run `node cli/index.mjs init --brand=klub --no-install --no-git --project-name=test`
- Assert file tree matches manifest `dst` paths
- Assert `klp.lock.json` is valid JSON + has all expected entries
- Assert `App.tsx` contains `brand="klub"`
- Run `pnpm install && pnpm typecheck` in temp dir → exit 0
- Cleanup

**Update smoke test** (same script, second scenario):

- Init in temp dir
- Modify one local file (e.g. append comment)
- Regenerate a fake manifest with one changed hash and one new file
- Run update with scripted stdin answers
- Assert picker categorized correctly (NEW / CHANGED / LOCAL-ONLY-CHANGE / CONFLICT)

**`scripts/validate-manifest.mjs`** — integrity check, runnable as pre-commit / CI:

- Every `groups.*.files[].src` path exists on disk
- Every `hash` matches current content
- Every `deps.components[]` resolves to a known component key
- Schema matches `version`

## Error handling

| Error | Handling |
|---|---|
| Network failure fetching manifest | Retry 3× w/ backoff; fall back to `~/.klp/cache/` if present; else fatal |
| GitHub rate limit (60/hr unauth) | Print hint: set `GITHUB_TOKEN` env var |
| Target dir non-empty on init | Confirm overwrite / abort |
| Invalid brand arg | List valid brands, exit 1 |
| Corrupt/missing lockfile on update | Error: "run `init` or restore from git" |
| Manifest schema version mismatch | Warn + require `--force` to proceed |
| File write failure mid-run | Rollback: restore all written files to pre-run state (buffer before commit) |
| Hash mismatch after fetch | Abort with integrity error |
| Import rewrite regex misses path | Log warning, proceed; rewrite rules documented in `cli/rewrite.mjs` |
| Dep install failure | Leave files in place, print recovery hint (`<pm> install`) |

## CLI UX

- `--verbose` — log every fetch/write
- `--dry-run` (update only) — show diff, don't apply
- Colored output: green=new, yellow=changed, red=conflict, gray=skip
- Progress indicators on fetch: `[3/42] src/components/...`
- Exit codes: 0 = success, 1 = user abort, 2 = integrity/network error, 3 = bad args

## Open items

- **Claude structure to ship** — user will provide the exact `.claude/` subset (agents, commands, skills) to include in the `claude` manifest group. Placeholder in schema until provided.
- **`BrandProvider` authoring path** — decide whether to author it via the full `/klp-build-component` pipeline (would require a Figma node) or hand-author as a utility exempt from the pipeline. Recommendation: hand-author, add to `klp-components.json` manually, exempt from `validate-tokens` since it has no visual layers.

## Out of scope (future work)

- Per-component granular install/uninstall CLI (`klp-ui add button`, `klp-ui remove button`). Schema leaves room; not shipped.
- Version pinning per component.
- Public npm publication.
- Multi-brand runtime switching in consumer.
- Consumer-side docs generation.
