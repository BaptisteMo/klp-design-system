# Agentic Design Workflow — design

Date: 2026-04-20
Status: approved
Owner: Baptiste

## Context

Consumers of the klp-ui CLI are sandboxes for code-based design exploration (Figma-replacement workflow). A brain-agent (external, owning project context) drops design requests into the consumer repo. A human manually triggers a pipeline that turns each request into interactive React mockup pages composed from DS components, with ad-hoc component creation when the DS doesn't cover a need. Current consumer init does not ship DS documentation, so agents have no inventory map. This spec adds doc shipping + an agentic design pipeline.

## Goals

- Ship DS documentation subset to consumer projects so local agents can read the component inventory, token aliases, and active-brand guidance.
- Accept YAML design requests from external brain agents in a structured folder workflow (`pending` → `to-be-review` → `to-be-validate` → `processed`).
- Produce interactive React mockup pages in the consumer, one file per screen, browsable via the existing hash-routing pattern.
- Cover non-DS needs with ad-hoc components, inline for one-offs or reusable under `src/components/custom/` for patterns used ≥ 2 times.
- Log gaps automatically so DS evolution is informed by real demand.
- Keep the existing DS authoring workflow (`/klp-build-component`, documentalist, figma-extractor) untouched.

## Non-goals

- Whiteboard-style free-form canvas: out of scope; output is a React web app with loosely-linked routes.
- Flow-linked clickable prototypes: mockup routes are switchable in a single index page, not chained.
- Validation of ad-hoc components against the token system: v0 relies on prompt discipline; lite validator is a future addition.
- Auto-promotion of reused ad-hoc components into the DS: manual promotion only.
- Export to Figma, PNG screenshots, or other design tools.
- Runtime brand switching in the consumer app: brand stays hardcoded per the CLI distribution spec.

## Architecture overview

Two parts, co-located in the DS repo, running in the consumer project post-`init`.

**Part A — Docs shipping (infra).** The DS `docs/` tree (subset) ships via `registry/manifest.json`. Consumer agents read these files to understand the DS.

**Part B — Design pipeline (workflow).** Triggered by `/klp-design <id> [extras…]` inside the consumer. Four subagents dispatched sequentially:

1. `request-analyzer` — parses YAML, reads docs, produces a screen plan + component mapping + gap list.
2. `ad-hoc-builder` (conditional) — builds reusable custom components or stages inline snippets for one-offs.
3. `mockup-composer` — writes one React file per screen, plus a `_meta.json` per request.
4. `design-finalizer` — appends to `docs/ds-gaps.md` and `docs/design-log.md`, regenerates `src/mockups/_index.tsx` only if missing, moves the YAML from `pending/` to `to-be-review/`, cleans staging.

Supporting slash commands: `/klp-design-review <id>`, `/klp-design-validate <id>`, `/klp-design-reset <id>` (state moves + log entries; no subagents).

**Data flow per request:**

```
requests/pending/<id>.yaml
         │  /klp-design <id> [extras]
         ▼
  request-analyzer  →  .klp/staging/<id>/plan.json
         │
         ▼ (if plan.ad_hoc[])
  ad-hoc-builder   →  src/components/custom/<name>/  +  .klp/staging/<id>/inline/
         │
         ▼
  mockup-composer  →  src/mockups/<id>/<screen>.tsx  +  _meta.json
         │
         ▼
  design-finalizer →  docs/ds-gaps.md, docs/design-log.md, src/mockups/_index.tsx (if missing)
                      mv requests/pending/<id>.yaml → requests/to-be-review/<id>.yaml
                      rm -rf .klp/staging/<id>
```

**Model split:** `request-analyzer`, `ad-hoc-builder`, `mockup-composer` use Sonnet (judgment). `design-finalizer` uses Haiku (mechanical).

## YAML request schema

File: `requests/pending/<id>.yaml`. Dropped by brain agent.

```yaml
# required
id: onboarding-flow
title: User onboarding
goal: |
  First-time user setup: collect profile, pick interests, success state.
screens:
  - name: welcome
    purpose: Greeting + value prop + start CTA
    key_elements:
      - hero with brand message
      - primary CTA button
      - skip link
    states: [default]
  - name: profile
    purpose: Collect name, avatar, role
    key_elements:
      - avatar upload
      - text inputs (name, role)
      - progress indicator (step 1 of 3)
    states: [default, loading, error]

# optional
project: klub-app
persona: |
  Event organizer new to Klub.
constraints:
  - no email capture here
  - must feel fast
  - mobile-first
references: []
```

**Required:** `id`, `title`, `goal`, `screens[].{name, purpose, key_elements}`.
**Optional:** `project`, `persona`, `constraints`, `screens[].states`, `references`.

**Parser rules:**

- Missing required field → abort pre-analyzer, clear error, YAML stays in `pending/`.
- Unknown top-level field → warn, keep (brain agents may add metadata).
- Duplicate `id` already in a downstream folder → refuse unless `--force`; suggests `/klp-design-reset <id>`.

**`states` semantics:** if omitted, default only. When multiple, composer renders stacked labeled `<section>` blocks in the same screen file with `data-state="…"`.

**Slash-command extras:** `/klp-design <id> [extras…]` passes the trailing string to `request-analyzer` as an ephemeral input. Never mutates the YAML; appended to `docs/design-log.md` with timestamp.

## Docs shipping

New manifest group `docs` added to `registry/manifest.json`. Built by `scripts/build-manifest.ts`.

**Shipped:**

- `docs/agent-brief.md` (new; see below)
- `docs/index.md`
- `docs/overview.md`
- `docs/components/_index_<name>.md` (all components, including `brand-provider`)
- `docs/tokens/_index_tokens.md`, `docs/tokens/{colors,radius,spacing,typography}.md`
- `docs/brands/_index_brands.md`
- `docs/brands/<active-brand>.md` (only the one chosen at init)

**Not shipped:** `docs/log.md`, `docs/gaps.md` (DS-internal), other brand docs.

**Brand doc selection at init:** manifest uses a new `brandFiles[]` field listing all brand docs w/ a `brand` attribute. `cli/init.mjs` picks the entry matching the chosen brand and ships only that one. `update` respects lockfile `brand` unless `--brand=<new>` is passed, in which case it swaps the brand doc.

### `docs/agent-brief.md`

Single-file condensed map. Generated by new `scripts/build-agent-brief.ts` from `klp-components.json`, token CSS, and the active-brand doc. Committed to the DS repo. Ships via manifest (one rendering per brand? no — per init choice, agent-brief is generated per brand and the DS repo commits the `wireframe` baseline; brand-specific agent-brief is produced on the consumer side post-init — see open items).

For v0, simplify: ship a single brand-agnostic `agent-brief.md` that lists all components + token aliases + composition rules, with a short brand-placeholder section pointing the reader to `docs/brands/<active>.md` for brand-specific notes.

Skeleton:

```markdown
---
title: klp-ui — agent brief
type: agent-context
generated-at: <timestamp>
schema-version: 0.1.0
---

# klp-ui agent brief

Condensed reference for design agents. Read this first before any design task;
drill into `docs/components/_index_<name>.md` for specifics.

## Inventory (N components)

### inputs
- **button** — 5 types × 4 sizes × 4 states. Use for all primary actions.
- **checkbox** — toggle; 5 states.
- **input** — text field w/ label + icons; 3 sizes × 6 states.
- ...

### feedback
- **floating-alert** — transient banner; 4 states × 3 sizes.
- ...

### ... (one bucket per category)

## Token aliases (use these; never raw --klp-color-*)

- **bg:** bg-klp-bg-default, bg-klp-bg-subtle, bg-klp-bg-brand, ...
- **fg:** text-klp-fg-default, text-klp-fg-muted, text-klp-fg-on-emphasis, ...
- **border:** border-klp-border-default, border-klp-border-brand, ...
- **radius:** rounded-klp-s, rounded-klp-m, rounded-klp-l
- **spacing:** gap-klp-size-s, gap-klp-size-m, ...
- **font:** font-klp-body, font-klp-display, font-klp-mono

## Brand

Brand is set in `src/App.tsx` via `<BrandProvider brand="…">`.
For brand-specific rules consult `docs/brands/<active-brand>.md`.

## Composition rules (hard)

- Always `cn()` — never string concat.
- Import DS components via `@/components/ui/<name>` (exception: `@/components/brand-provider`).
- No inline SVG — use `lucide-react`.
- No hex colors, no `--klp-color-*` primitive refs.
- Do not import `@radix-ui/*` directly in mockups — DS already wraps them.

## DS gap log

See `docs/ds-gaps.md` (initially empty in consumer; pipeline appends).
```

### Agent context flow

1. Read `docs/agent-brief.md` (short).
2. Read `docs/index.md` (component catalog with categories + relations).
3. For each picked component, read `docs/components/_index_<name>.md` (detailed anatomy, variants, tokens, dependencies).
4. Consult `docs/tokens/*.md` and `docs/brands/<active>.md` when needed.

## Pipeline stages

### Stage 1 — `request-analyzer`

**Input:** path to `requests/pending/<id>.yaml`, ephemeral extras string.

**Reads:** YAML, `docs/agent-brief.md`, `docs/index.md`, `docs/ds-gaps.md`.

**Produces:** `.klp/staging/<id>/plan.json`

```json
{
  "id": "onboarding-flow",
  "title": "User onboarding",
  "brand": "klub",
  "extras": "…inline extras from slash invocation…",
  "screens": [
    {
      "name": "welcome",
      "purpose": "…",
      "states": ["default"],
      "ds_components": [
        { "name": "button", "usage": "primary CTA", "variants": { "type": "primary", "size": "lg" } }
      ],
      "ad_hoc": [
        { "name": "hero-block", "reuse": "inline", "purpose": "brand hero + headline + subheadline" }
      ],
      "layout_hint": "full-width centered, vertical flow, max-w-xl"
    }
  ],
  "gaps": [
    { "kind": "missing-component", "need": "avatar-upload", "screen": "profile", "severity": "important" }
  ]
}
```

**Responsibilities:**

- Parse + validate YAML.
- Pick DS components per screen (drilling into `_index_<name>.md` as needed).
- For elements DS doesn't cover, emit `ad_hoc` entries: `reuse: "inline"` for one-offs, `reuse: "custom"` when the same need appears on ≥ 2 screens.
- Log `gaps[]` for entries that plausibly belong in the DS.
- Never writes consumer source; only `plan.json`.

**Fail mode:** schema error → exits + keeps YAML in `pending/`.

### Stage 2 — `ad-hoc-builder` (conditional)

Skipped entirely when `plan.ad_hoc` is empty across all screens.

**Input:** `.klp/staging/<id>/plan.json`.

**Reads:** `docs/agent-brief.md` (composition rules + token aliases), each ad-hoc entry's screen context.

**Produces:**

- `reuse: "custom"` → `src/components/custom/<name>/{<Component>.tsx, index.ts}`. Same shape as DS components (cva when warranted, `cn()`, token aliases only). No variants axis required by default.
- `reuse: "inline"` → `.klp/staging/<id>/inline/<screen>/<name>.tsx` — ephemeral snippet consumed by `mockup-composer`, not shipped.

**Constraints (prompt-enforced; not validated in v0):** no raw hex, no inline SVG, `cn()` required, DS token aliases only.

### Stage 3 — `mockup-composer`

**Input:** `.klp/staging/<id>/plan.json` + inline staging files.

**Reads:** `docs/components/_index_<name>.md` for every DS component used.

**Produces:**

- `src/mockups/<id>/<screen>.tsx` — one file per screen, `export default`. Imports from `@/components/ui/*`, `@/components/custom/*`, `@/components/brand-provider` as needed.
- `src/mockups/<id>/_meta.json` — echoes id, title, project, goal, generatedAt, sourceRequest, brand, and the screen list with routes.

**States rendering:** when a screen declares multiple states, composer renders them as stacked labeled `<section data-state="…">` blocks in the same file (no substate routing).

**Screen file shape:**

```tsx
// src/mockups/onboarding-flow/welcome.tsx
import { Button } from '@/components/ui/button'

export default function WelcomeMockup() {
  return (
    <div className="min-h-screen bg-klp-bg-default text-klp-fg-default p-klp-size-xl">
      <section data-state="default">
        {/* …hero + CTA… */}
      </section>
    </div>
  )
}
```

### Stage 4 — `design-finalizer` (gap-logger + index-refresher)

**Input:** `.klp/staging/<id>/plan.json`, current `src/mockups/*/\_meta.json` set.

**Writes:**

- `docs/ds-gaps.md` — appends a dated entry per request with the gap list.
- `docs/design-log.md` — appends a one-liner with timestamp, id, new-state, and extras.
- `src/mockups/_index.tsx` — regenerated **only if missing** (rest of the time the file uses `import.meta.glob` to enumerate meta files at build time, so it need not be touched per run).

**Moves:** `requests/pending/<id>.yaml` → `requests/to-be-review/<id>.yaml` (git mv; falls back to plain rename with a warning if not a git repo).

**Cleanup:** removes `.klp/staging/<id>/`.

### Supporting slash commands

Thin orchestration, no subagents:

- `/klp-design-review <id>` — moves `to-be-review/<id>.yaml` → `to-be-validate/<id>.yaml`, logs.
- `/klp-design-validate <id>` — moves `to-be-validate/<id>.yaml` → `processed/<id>.yaml`, logs.
- `/klp-design-reset <id>` — moves from any folder → `pending/`, deletes `src/mockups/<id>/`, logs.

## Consumer file structure

After init + first successful `/klp-design` run:

```
my-project/
├── .claude/
│   ├── CLAUDE.md                       # designer notes, doc of the pipeline
│   ├── agents/
│   │   ├── request-analyzer.md
│   │   ├── ad-hoc-builder.md
│   │   ├── mockup-composer.md
│   │   └── design-finalizer.md
│   ├── commands/
│   │   ├── klp-design.md
│   │   ├── klp-design-review.md
│   │   ├── klp-design-validate.md
│   │   └── klp-design-reset.md
│   └── skills/                         # empty, user fills
├── .klp/
│   └── staging/                        # gitignored pipeline artefacts
├── docs/
│   ├── agent-brief.md                  # shipped
│   ├── index.md                        # shipped
│   ├── overview.md                     # shipped
│   ├── components/_index_*.md          # shipped (all)
│   ├── tokens/*.md                     # shipped
│   ├── brands/_index_brands.md         # shipped
│   ├── brands/<active>.md              # shipped (single)
│   ├── ds-gaps.md                      # pipeline-maintained
│   └── design-log.md                   # pipeline-maintained
├── requests/
│   ├── pending/
│   ├── to-be-review/
│   ├── to-be-validate/
│   └── processed/                      # all four have .gitkeep
├── src/
│   ├── components/
│   │   ├── ui/<name>/                  # DS components
│   │   ├── custom/<name>/              # ad-hoc reusables
│   │   └── brand-provider.tsx
│   ├── mockups/
│   │   ├── _index.tsx                  # auto-enumerated via import.meta.glob
│   │   └── <id>/
│   │       ├── _meta.json
│   │       └── <screen>.tsx
│   ├── lib/cn.ts
│   ├── styles/tokens/{primitives,aliases,theme}.css
│   ├── styles/tokens.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .gitignore                          # includes `.klp/staging`
├── klp.lock.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## Routing

Reuse the DS playground's hash-routing pattern. Updated `App.tsx.tmpl`:

```tsx
import { useEffect, useState, useSyncExternalStore, type ComponentType } from 'react'
import { BrandProvider } from '@/components/brand-provider'
import MockupsIndex from '@/mockups/_index'

const modules = import.meta.glob('/src/mockups/*/*.tsx')

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}
function getHash() {
  return window.location.hash.replace(/^#\/?/, '')
}

export default function App() {
  const hash = useSyncExternalStore(subscribe, getHash, () => '')
  const [Route, setRoute] = useState<ComponentType | null>(null)

  useEffect(() => {
    if (!hash || hash === '/' || !hash.startsWith('mockups/')) {
      setRoute(null)
      return
    }
    const key = `/src/${hash}.tsx`
    const loader = modules[key]
    if (loader) loader().then((m: any) => setRoute(() => m.default))
    else setRoute(null)
  }, [hash])

  return (
    <BrandProvider brand="{{brand}}">
      <main className="min-h-screen bg-klp-bg-default text-klp-fg-default p-6">
        {Route ? <Route /> : <MockupsIndex />}
      </main>
    </BrandProvider>
  )
}
```

Seed `src/mockups/_index.tsx` (shipped by init; not regenerated after first boot unless missing):

```tsx
const metas = import.meta.glob('/src/mockups/*/_meta.json', { eager: true }) as Record<string, { default: any }>

export default function MockupsIndex() {
  const entries = Object.entries(metas).map(([path, mod]) => ({ path, meta: mod.default }))
  if (entries.length === 0) {
    return (
      <div className="text-klp-fg-muted">
        No mockups yet. Drop a YAML in <code>requests/pending/</code> and run <code>/klp-design &lt;id&gt;</code>.
      </div>
    )
  }
  return (
    <ul className="space-y-6">
      {entries.map(({ meta }) => (
        <li key={meta.id}>
          <h2 className="font-klp-display">{meta.title}</h2>
          {meta.project && <p className="text-klp-fg-muted">{meta.project}</p>}
          <ul className="mt-2 space-y-1">
            {meta.screens.map((s: any) => (
              <li key={s.name}>
                <a className="underline" href={`#/mockups/${meta.id}/${s.name}`}>{s.name}</a>
                {s.states?.length > 1 && <span className="text-klp-fg-muted"> — states: {s.states.join(', ')}</span>}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
```

## Integration with existing CLI

### Manifest changes

**New `docs` group** in `registry/manifest.json`:

```json
"docs": {
  "required": true,
  "files": [
    { "src": "docs/agent-brief.md", "dst": "docs/agent-brief.md", "hash": "…" },
    { "src": "docs/index.md", "dst": "docs/index.md", "hash": "…" },
    { "src": "docs/overview.md", "dst": "docs/overview.md", "hash": "…" },
    … (components/_index_*.md, tokens/*.md, brands/_index_brands.md)
  ],
  "brandFiles": [
    { "src": "docs/brands/klub.md", "dst": "docs/brands/klub.md", "hash": "…", "brand": "klub" },
    { "src": "docs/brands/atlas.md", "dst": "docs/brands/atlas.md", "hash": "…", "brand": "atlas" },
    { "src": "docs/brands/showup.md", "dst": "docs/brands/showup.md", "hash": "…", "brand": "showup" },
    { "src": "docs/brands/wireframe.md", "dst": "docs/brands/wireframe.md", "hash": "…", "brand": "wireframe" }
  ]
}
```

**Scaffold group extensions** — new templates under `cli/scaffold/claude/`:

- `agents/request-analyzer.md.tmpl`
- `agents/ad-hoc-builder.md.tmpl`
- `agents/mockup-composer.md.tmpl`
- `agents/design-finalizer.md.tmpl`
- `commands/klp-design.md.tmpl`
- `commands/klp-design-review.md.tmpl`
- `commands/klp-design-validate.md.tmpl`
- `commands/klp-design-reset.md.tmpl`

Plus:

- `requests/{pending,to-be-review,to-be-validate,processed}/.gitkeep` (4 files)
- `src/mockups/_index.tsx.tmpl` (seed)

**Scaffold template updates:**

- `App.tsx.tmpl` replaced with the routing-aware version above.
- `gitignore.tmpl` appends `.klp/staging`.
- `CLAUDE.md.tmpl` extended with the pipeline usage section.

### `cli/init.mjs` changes

- Handle `brandFiles[]`: iterate, pick the entry where `brand === chosenBrand`, fetch + write + lock. Skip the rest.
- Seed `src/mockups/_index.tsx` only if not already present (applies on every run; effectively one-time).
- No behavioural change to the other groups.

### `cli/update.mjs` changes

- `--brand=<new>`: if different from lockfile, swap the brand doc (remove old, fetch new).
- `docs/ds-gaps.md`, `docs/design-log.md`, `src/mockups/_index.tsx`: not in manifest, pipeline-owned, never touched by update.
- Existing skip-scaffold-on-update logic already covers the extended scaffold group.

### DS dev workflow additions

- New `scripts/build-agent-brief.ts` — regenerates `docs/agent-brief.md` from `klp-components.json` + aliases.css + brands metadata. Invoked via `pnpm run build:agent-brief`. Committed to the DS repo.
- New umbrella script `pnpm run build:all` = `sync:tokens && build:agent-brief && build:manifest && validate:manifest`.
- CI / pre-commit continues to rely on `validate:manifest`.

## Error handling

| Case | Behaviour |
|---|---|
| Missing required YAML field | `request-analyzer` aborts, prints the field, YAML stays in `pending/` |
| Duplicate `id` in a downstream folder | Pipeline refuses; suggests `/klp-design-reset <id>` or `--force` |
| Referenced DS component not shipped | `mockup-composer` aborts with hint to `klp-ui update` or to mark as ad-hoc |
| Ad-hoc output contains forbidden patterns (hex, inline SVG) | Out of scope for v0; documented limitation |
| Git not initialised | Plain rename instead of `git mv`; warn; pipeline continues |
| `src/mockups/_index.tsx` user-modified | Never overwritten; finalizer only writes it when missing |
| Two requests share a screen name | Allowed — different `<id>` folders |
| Network fetch of DS files during `init` | Already covered by fetch retry + cache fallback (CLI distribution spec) |

## Open items

- **Per-brand `agent-brief.md`:** v0 ships a single brand-agnostic brief. A future iteration may ship per-brand briefs indexed by `brand` in the manifest so the agent never needs to consult `docs/brands/<active>.md` for common cases.
- **Ad-hoc validator:** a lightweight `validate-custom.mjs` script for `src/components/custom/` to catch hex colors, primitive-token refs, and inline SVG. Out of scope for v0; rely on prompt discipline.
- **Auto-promotion of ad-hoc to DS:** when the same `custom/<name>/` appears repeatedly across projects, promote it to the DS. Manual for now; future work.

## Out of scope

- Flow-linked prototypes / route chaining between mockups.
- Export to Figma / PNG / video.
- Multi-language mockup text.
- Side-by-side comparison of versions.
- Runtime brand switching in the consumer.
- Full integration tests of the pipeline end-to-end (covered by manual verification in the next plan).
