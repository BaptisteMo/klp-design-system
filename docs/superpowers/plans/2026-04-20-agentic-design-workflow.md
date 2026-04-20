# Agentic Design Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship DS docs subset + `agent-brief.md` to consumer projects and introduce a 4-stage subagent pipeline (request-analyzer → ad-hoc-builder → mockup-composer → design-finalizer) that turns YAML design requests into switchable React mockup routes.

**Architecture:** New manifest group `docs` + extended `scaffold` (agent templates, slash commands, request folders, updated `App.tsx`). Generator script `scripts/build-agent-brief.ts` produces a condensed DS-brief from `klp-components.json` + token CSS. Consumer pipeline runs entirely via Claude Code subagents; orchestrated by a new `/klp-design` slash command. No changes to DS authoring (figma-extractor, component-adapter, documentalist).

**Tech Stack:** Node ≥22 (ESM), `tsx` for TS scripts, Vite 6 `import.meta.glob` for consumer routing, Claude Code subagents for pipeline stages, YAML for request schema (parsed with a minimal hand-rolled parser inside agents — no YAML lib ships to consumer).

**Spec:** `docs/superpowers/specs/2026-04-20-agentic-design-workflow-design.md`.

---

## File Structure

**Create (DS repo):**
- `scripts/build-agent-brief.ts` — generates `docs/agent-brief.md`
- `docs/agent-brief.md` — committed artifact
- `cli/scaffold/claude/agents/request-analyzer.md.tmpl`
- `cli/scaffold/claude/agents/ad-hoc-builder.md.tmpl`
- `cli/scaffold/claude/agents/mockup-composer.md.tmpl`
- `cli/scaffold/claude/agents/design-finalizer.md.tmpl`
- `cli/scaffold/claude/commands/klp-design.md.tmpl`
- `cli/scaffold/claude/commands/klp-design-review.md.tmpl`
- `cli/scaffold/claude/commands/klp-design-validate.md.tmpl`
- `cli/scaffold/claude/commands/klp-design-reset.md.tmpl`
- `cli/scaffold/mockups/_index.tsx.tmpl` — seed mockups index
- `cli/scaffold/requests/pending/.gitkeep`
- `cli/scaffold/requests/to-be-review/.gitkeep`
- `cli/scaffold/requests/to-be-validate/.gitkeep`
- `cli/scaffold/requests/processed/.gitkeep`

**Modify (DS repo):**
- `cli/scaffold/App.tsx.tmpl` — add routing w/ `import.meta.glob`
- `cli/scaffold/gitignore.tmpl` — add `.klp/staging`
- `cli/scaffold/claude/CLAUDE.md.tmpl` — append pipeline-usage section
- `scripts/build-manifest.ts` — add `docs` group + `brandFiles[]` + dst mapping for new scaffold templates
- `cli/init.mjs` — handle `brandFiles[]` selection + seed mockups index + create request folders
- `cli/update.mjs` — handle `--brand=<new>` swap (brand doc only); preserve pipeline-maintained files
- `cli/manifest.mjs` — `validateManifest` tolerates optional `brandFiles[]` on groups
- `scripts/validate-manifest.mjs` — validate `brandFiles[]` entries
- `package.json` — add `build:agent-brief` + `build:all` scripts
- `CLAUDE.md` (root DS) — append "Agentic design workflow" section

**Unchanged:**
- DS authoring pipeline (`/klp-build-component`, figma-extractor, component-adapter, documentalist, klp-token-validator).
- Playground, existing components, tokens CSS, registry per-component JSONs.

---

## Task 1: Add `build:agent-brief` script

**Files:**
- Create: `scripts/build-agent-brief.ts`
- Modify: `package.json`

- [ ] **Step 1: Write scripts/build-agent-brief.ts**

```ts
// scripts/build-agent-brief.ts
// Regenerates docs/agent-brief.md from klp-components.json + token CSS.
// Brand-agnostic v0: lists inventory, token aliases, composition rules.

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

type ComponentEntry = {
  name: string
  displayName?: string
  description?: string
  category?: string
  variantCount?: number
  anatomy?: string[]
  status?: string
  exemptFromFigmaPipeline?: boolean
}

function loadComponents(): ComponentEntry[] {
  const raw = readFileSync(join(ROOT, 'klp-components.json'), 'utf8')
  const parsed = JSON.parse(raw)
  if (Array.isArray(parsed)) return parsed
  if (parsed.components && Array.isArray(parsed.components)) return parsed.components
  throw new Error('klp-components.json: unexpected schema (expected array or { components: [] })')
}

function extractAliases(): Record<string, string[]> {
  const text = readFileSync(join(ROOT, 'src/styles/tokens/aliases.css'), 'utf8')
  const root = text.match(/:root,?\s*\[data-brand="wireframe"\]\s*\{([\s\S]*?)\}/)?.[1] ?? ''
  const buckets: Record<string, Set<string>> = {
    bg: new Set(), fg: new Set(), border: new Set(),
    radius: new Set(), size: new Set(), font: new Set(),
  }
  for (const line of root.split('\n')) {
    const m = line.trim().match(/^--klp-(bg|fg|border|radius|size|font)-([a-z0-9-]+):/)
    if (!m) continue
    const [, group, rest] = m
    buckets[group].add(rest)
  }
  return Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, [...v].sort()]))
}

function groupByCategory(components: ComponentEntry[]): Record<string, ComponentEntry[]> {
  const out: Record<string, ComponentEntry[]> = {}
  for (const c of components) {
    const cat = c.category ?? 'uncategorized'
    if (!out[cat]) out[cat] = []
    out[cat].push(c)
  }
  for (const list of Object.values(out)) list.sort((a, b) => a.name.localeCompare(b.name))
  return out
}

function tailwindPrefix(group: string): string {
  return { bg: 'bg-klp-bg-', fg: 'text-klp-fg-', border: 'border-klp-border-', radius: 'rounded-klp-', size: 'gap-klp-size-', font: 'font-klp-' }[group] ?? `klp-${group}-`
}

function main() {
  const components = loadComponents().filter((c) => c.status !== 'deleted' && c.status !== 'removed')
  const byCat = groupByCategory(components)
  const aliases = extractAliases()

  const lines: string[] = []
  lines.push('---')
  lines.push('title: klp-ui — agent brief')
  lines.push('type: agent-context')
  lines.push(`generated-at: ${new Date().toISOString()}`)
  lines.push('schema-version: 0.1.0')
  lines.push('---')
  lines.push('')
  lines.push('# klp-ui agent brief')
  lines.push('')
  lines.push('Condensed reference for design agents. Read this first before any design task; drill into `docs/components/_index_<name>.md` for specifics.')
  lines.push('')
  lines.push(`## Inventory (${components.length} components)`)
  lines.push('')

  for (const cat of Object.keys(byCat).sort()) {
    lines.push(`### ${cat}`)
    for (const c of byCat[cat]) {
      const vc = c.variantCount ? ` (${c.variantCount} variants)` : ''
      const desc = c.description ? ` — ${c.description.split('\n')[0]}` : ''
      lines.push(`- **${c.name}**${vc}${desc}`)
    }
    lines.push('')
  }

  lines.push('## Token aliases (use these; never raw `--klp-color-*`)')
  lines.push('')
  for (const [group, names] of Object.entries(aliases)) {
    if (names.length === 0) continue
    const prefix = tailwindPrefix(group)
    const sample = names.slice(0, 8).map((n) => `\`${prefix}${n}\``).join(', ')
    const more = names.length > 8 ? `, … (${names.length - 8} more)` : ''
    lines.push(`- **${group}:** ${sample}${more}`)
  }
  lines.push('')

  lines.push('## Brand')
  lines.push('')
  lines.push('Brand is set in `src/App.tsx` via `<BrandProvider brand="…">`. For brand-specific guidance consult `docs/brands/<active-brand>.md`.')
  lines.push('')

  lines.push('## Composition rules (hard)')
  lines.push('')
  lines.push('- Always `cn()` — never string concat.')
  lines.push('- Import DS components via `@/components/ui/<name>` (exception: `@/components/brand-provider`).')
  lines.push('- No inline SVG — use `lucide-react`.')
  lines.push('- No hex colors, no `--klp-color-*` primitive refs.')
  lines.push('- Do not import `@radix-ui/*` directly in mockups — DS already wraps them.')
  lines.push('')

  lines.push('## DS gap log')
  lines.push('')
  lines.push('See `docs/ds-gaps.md` (initially empty in consumer; pipeline appends).')
  lines.push('')

  writeFileSync(join(ROOT, 'docs/agent-brief.md'), lines.join('\n'))
  console.log(`Wrote docs/agent-brief.md — ${components.length} components, ${Object.values(aliases).flat().length} token aliases`)
}

main()
```

- [ ] **Step 2: Add pnpm script**

Open `package.json`. Under `"scripts"`, add:
```json
"build:agent-brief": "tsx scripts/build-agent-brief.ts",
"build:all": "pnpm run sync:tokens && pnpm run build:agent-brief && pnpm run build:manifest && pnpm run validate:manifest"
```

Keep other scripts intact.

- [ ] **Step 3: Run it**

Run: `pnpm run build:agent-brief`
Expected: writes `docs/agent-brief.md`, prints a component count + alias count.

- [ ] **Step 4: Sanity-check the output**

Run: `head -30 docs/agent-brief.md`
Expected: front-matter + `# klp-ui agent brief` + `## Inventory (N components)` with component list beginning.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-agent-brief.ts docs/agent-brief.md package.json
git commit -m "feat(docs): agent-brief generator + committed docs/agent-brief.md"
```

---

## Task 2: Scaffold — `App.tsx.tmpl` routing update

**Files:**
- Modify: `cli/scaffold/App.tsx.tmpl`

- [ ] **Step 1: Replace `App.tsx.tmpl` entirely**

Current content is the minimal-hero stub. Replace with:

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
        <header className="mb-6 flex items-center justify-between border-b border-klp-border-default pb-4">
          <a href="#/" className="font-klp-mono text-sm text-klp-fg-muted hover:text-klp-fg-default">
            {{projectName}} · mockups
          </a>
          <span className="font-klp-mono text-xs text-klp-fg-muted">brand: {{brand}}</span>
        </header>
        {Route ? <Route /> : <MockupsIndex />}
      </main>
    </BrandProvider>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add cli/scaffold/App.tsx.tmpl
git commit -m "feat(scaffold): App.tsx hash-routed mockups w/ import.meta.glob"
```

---

## Task 3: Scaffold — seed mockups index

**Files:**
- Create: `cli/scaffold/mockups/_index.tsx.tmpl`

- [ ] **Step 1: Write the seed index template**

```tsx
// src/mockups/_index.tsx
// Auto-enumerated mockups list. Iterates every _meta.json at build time.
// Do not hand-edit unless you know what you're doing — the pipeline only
// regenerates this file if it is missing.

const metas = import.meta.glob('/src/mockups/*/_meta.json', { eager: true }) as Record<
  string,
  { default: MockupMeta }
>

interface ScreenMeta {
  name: string
  route: string
  states?: string[]
}
interface MockupMeta {
  id: string
  title: string
  project?: string
  goal?: string
  generatedAt?: string
  brand?: string
  screens: ScreenMeta[]
}

export default function MockupsIndex() {
  const entries = Object.values(metas).map((m) => m.default)
  if (entries.length === 0) {
    return (
      <div className="max-w-2xl text-klp-fg-muted">
        <p>
          No mockups yet. Drop a YAML in <code>requests/pending/</code> then run{' '}
          <code>/klp-design &lt;id&gt;</code>.
        </p>
      </div>
    )
  }
  return (
    <ul className="space-y-8">
      {entries.map((meta) => (
        <li key={meta.id}>
          <h2 className="font-klp-display text-klp-fg-default">{meta.title}</h2>
          {meta.project && <p className="text-klp-fg-muted text-sm">{meta.project}</p>}
          {meta.goal && <p className="mt-1 text-klp-fg-muted">{meta.goal}</p>}
          <ul className="mt-3 space-y-1">
            {meta.screens.map((s) => (
              <li key={s.name}>
                <a className="underline text-klp-fg-default" href={`#/mockups/${meta.id}/${s.name}`}>
                  {s.name}
                </a>
                {s.states && s.states.length > 1 && (
                  <span className="text-klp-fg-muted"> — states: {s.states.join(', ')}</span>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add cli/scaffold/mockups/_index.tsx.tmpl
git commit -m "feat(scaffold): seed src/mockups/_index.tsx template"
```

---

## Task 4: Scaffold — request folder .gitkeeps + gitignore

**Files:**
- Create: `cli/scaffold/requests/pending/.gitkeep`
- Create: `cli/scaffold/requests/to-be-review/.gitkeep`
- Create: `cli/scaffold/requests/to-be-validate/.gitkeep`
- Create: `cli/scaffold/requests/processed/.gitkeep`
- Modify: `cli/scaffold/gitignore.tmpl`

- [ ] **Step 1: Create 4 empty .gitkeep files**

Run:
```bash
mkdir -p cli/scaffold/requests/pending cli/scaffold/requests/to-be-review cli/scaffold/requests/to-be-validate cli/scaffold/requests/processed
: > cli/scaffold/requests/pending/.gitkeep
: > cli/scaffold/requests/to-be-review/.gitkeep
: > cli/scaffold/requests/to-be-validate/.gitkeep
: > cli/scaffold/requests/processed/.gitkeep
```

- [ ] **Step 2: Append `.klp/staging` to gitignore.tmpl**

Read `cli/scaffold/gitignore.tmpl`. Append a new line at the bottom:
```
.klp/staging
```

Final content should be:
```
node_modules
dist
.DS_Store
*.log
.vite
.env
.env.local
.klp/staging
```

- [ ] **Step 3: Commit**

```bash
git add cli/scaffold/requests cli/scaffold/gitignore.tmpl
git commit -m "feat(scaffold): request-state folders + ignore .klp/staging"
```

---

## Task 5: Scaffold — extended CLAUDE.md template

**Files:**
- Modify: `cli/scaffold/claude/CLAUDE.md.tmpl`

- [ ] **Step 1: Append a new section**

At the bottom of `cli/scaffold/claude/CLAUDE.md.tmpl`, append:

```markdown

## Agentic design pipeline

This project ships with a 4-stage pipeline that turns YAML design requests into React mockup pages.

### Request lifecycle

```
requests/pending/        ← brain agents drop YAML here
requests/to-be-review/   ← after pipeline generates mockups; review in-browser
requests/to-be-validate/ ← after your review; pending meeting sign-off
requests/processed/      ← validated, done
```

### Running the pipeline

- `/klp-design <id> [extras…]` — runs the full pipeline on `requests/pending/<id>.yaml`. Optional trailing text becomes ephemeral context for the run (logged to `docs/design-log.md`, not written into the YAML).
- `/klp-design-review <id>` — moves `to-be-review/<id>.yaml` → `to-be-validate/<id>.yaml`.
- `/klp-design-validate <id>` — moves `to-be-validate/<id>.yaml` → `processed/<id>.yaml`.
- `/klp-design-reset <id>` — moves any state → `pending/` and deletes `src/mockups/<id>/` so the run can be re-done.

### Viewing mockups

Run `pnpm dev` and visit `http://localhost:5173/`. The index auto-enumerates every `_meta.json` under `src/mockups/` and exposes each screen at `#/mockups/<id>/<screen>`.

### DS awareness for agents

Agents read `docs/agent-brief.md` first (condensed inventory + token aliases + rules), then drill into `docs/index.md` and `docs/components/_index_<name>.md` per component used. Brand-specific guidance lives in `docs/brands/{{brand}}.md`.

### Ad-hoc components

When the DS doesn't cover a need:

- One-off use: composed inline in the mockup file.
- Used across ≥ 2 screens: a reusable component is created under `src/components/custom/<name>/`.

Every gap is logged to `docs/ds-gaps.md` for later DS promotion.

### Updating the DS

Run `npx github:BaptisteMo/klp-design-system update` to pull latest DS changes interactively. Your `src/mockups/*`, `src/components/custom/*`, `docs/ds-gaps.md`, `docs/design-log.md`, and request folders are never touched by update.
```

- [ ] **Step 2: Commit**

```bash
git add cli/scaffold/claude/CLAUDE.md.tmpl
git commit -m "docs(scaffold): consumer CLAUDE.md covers design pipeline"
```

---

## Task 6: Agent template — `request-analyzer`

**Files:**
- Create: `cli/scaffold/claude/agents/request-analyzer.md.tmpl`

- [ ] **Step 1: Write template**

```markdown
---
name: request-analyzer
description: Stage 1 of /klp-design. Parses a YAML request, maps each screen to DS components, flags ad-hoc needs and DS gaps. Produces `.klp/staging/<id>/plan.json`. Does not write consumer source.
tools: Read, Write, Glob, Grep, Bash
model: sonnet
---

# request-analyzer

You are the first stage of the `/klp-design` pipeline. You read a YAML request, consult the shipped design-system docs, and produce a machine-readable plan that downstream agents execute. You never write React files or mutate consumer source; your only output is `.klp/staging/<id>/plan.json` and your final report.

## Input (via prompt)

- `requestPath`: relative path to the YAML request, e.g. `requests/pending/<id>.yaml`.
- `extras`: optional free-form string (from `/klp-design <id> extras…`). Treat as additional context; do not persist.

## Workflow

1. **Read the request.** Parse YAML without an external lib — use a minimal hand-rolled parser. Validate required fields: `id`, `title`, `goal`, `screens[].{name, purpose, key_elements}`. If anything is missing, fail fast with a clear message; do not proceed.
2. **Read `docs/agent-brief.md`** for the component inventory and token aliases. If the file is missing, fail with "DS docs not shipped — run `klp-ui update`".
3. **Read `docs/index.md`** for the catalogue and relations.
4. **Read `klp.lock.json`** to know the active brand. Then read `docs/brands/<brand>.md` for brand quirks.
5. **For each screen:**
   - Pick DS components from the inventory. For each picked component, read `docs/components/_index_<name>.md` to confirm it fits (anatomy + variants + states align with the screen purpose).
   - For elements the DS does not cover, emit an `ad_hoc` entry:
     - `reuse: "inline"` if the same concept appears on exactly this one screen.
     - `reuse: "custom"` if it appears on ≥ 2 screens in this request.
   - Use `layout_hint` sparingly — a short prose hint the composer will respect (e.g. "full-width centered, vertical flow, max-w-xl"), not a complete CSS plan.
6. **Log `gaps[]`** for ad-hoc entries that plausibly belong in the DS. Severity: `important` for missing-component, `minor` for partial-coverage.
7. **Write `.klp/staging/<id>/plan.json`** with the shape shown below. Ensure the directory exists (`mkdir -p`).

## plan.json shape

```json
{
  "id": "<id>",
  "title": "<title>",
  "brand": "<active brand>",
  "extras": "<slash-command extras or empty string>",
  "screens": [
    {
      "name": "<screen name>",
      "purpose": "<short prose>",
      "states": ["default", ...],
      "ds_components": [
        { "name": "<component>", "usage": "<why>", "variants": { "<axis>": "<value>" } }
      ],
      "ad_hoc": [
        { "name": "<kebab-case>", "reuse": "inline|custom", "purpose": "<prose>" }
      ],
      "layout_hint": "<short prose>"
    }
  ],
  "gaps": [
    { "kind": "missing-component|partial-coverage", "need": "<kebab-case>", "screen": "<name>", "severity": "important|minor" }
  ]
}
```

## Report (at the end)

Return a JSON object:
```json
{
  "planPath": ".klp/staging/<id>/plan.json",
  "screenCount": <n>,
  "dsComponentCount": <n>,
  "adHocCount": <n>,
  "gapCount": <n>
}
```

## Rules

- Never modify the YAML source.
- Never write outside `.klp/staging/<id>/`.
- If parsing fails, delete any partial `plan.json` before returning.
- Do not fabricate component names. Only pick from `docs/agent-brief.md` inventory.
```

- [ ] **Step 2: Commit**

```bash
git add cli/scaffold/claude/agents/request-analyzer.md.tmpl
git commit -m "feat(scaffold): request-analyzer agent template"
```

---

## Task 7: Agent template — `ad-hoc-builder`

**Files:**
- Create: `cli/scaffold/claude/agents/ad-hoc-builder.md.tmpl`

- [ ] **Step 1: Write template**

```markdown
---
name: ad-hoc-builder
description: Stage 2 of /klp-design. Builds reusable custom components under src/components/custom/ and stages inline JSX snippets for one-offs. Only runs when plan.ad_hoc is non-empty.
tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
---

# ad-hoc-builder

You produce the ad-hoc components declared in a plan. You do NOT design the mockup pages themselves — that's the mockup-composer's job. Your job is to hand the composer a set of small, clean, DS-consistent building blocks it can import.

## Input (via prompt)

- `planPath`: path to `.klp/staging/<id>/plan.json`.

## Workflow

1. **Read the plan.** Collect every `ad_hoc` entry across all screens, deduplicated by `name`.
2. **Read `docs/agent-brief.md`** for composition rules + token aliases. These are non-negotiable.
3. **For each `reuse: "custom"` entry:**
   - Create `src/components/custom/<name>/<PascalName>.tsx` (e.g. `avatar-upload` → `AvatarUpload.tsx`).
   - Create `src/components/custom/<name>/index.ts` re-exporting the component.
   - Follow DS conventions: function component, `cn()` from `@/lib/cn`, `class-variance-authority` only if there are real variant axes, Tailwind utilities on token aliases only. No hex, no inline SVG, no `@radix-ui/*` imports.
   - Keep the API small (usually a single root prop bag — avoid cva unless you need it).
4. **For each `reuse: "inline"` entry:**
   - Write a JSX snippet to `.klp/staging/<id>/inline/<screen>/<name>.tsx`. The file exports default a React component named after the entry.
   - Snippets may call DS components (`@/components/ui/*`) freely.
5. **Never** import `./BrandProvider` or `brand-provider` — brand is already applied at the root.

## Report

Return JSON:
```json
{
  "customWritten": ["<name>", ...],
  "inlineStagedFor": [{ "screen": "<name>", "components": ["<name>", ...] }],
  "skipped": <n>
}
```

Report `skipped` entries when you refuse a build (e.g. unavoidable hex color). For each skip, explain in a `notes[]` array.

## Rules

- Never touch DS components at `src/components/ui/`.
- Never write outside `src/components/custom/`, `.klp/staging/<id>/inline/`, or commit the staged inline files to git.
- If any file would violate composition rules (hex, primitive-token ref, inline SVG), refuse it; list in `skipped`.
```

- [ ] **Step 2: Commit**

```bash
git add cli/scaffold/claude/agents/ad-hoc-builder.md.tmpl
git commit -m "feat(scaffold): ad-hoc-builder agent template"
```

---

## Task 8: Agent template — `mockup-composer`

**Files:**
- Create: `cli/scaffold/claude/agents/mockup-composer.md.tmpl`

- [ ] **Step 1: Write template**

```markdown
---
name: mockup-composer
description: Stage 3 of /klp-design. Writes one React file per screen under src/mockups/<id>/ and a _meta.json per request. Uses DS components + ad-hoc components from Stage 2.
tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
---

# mockup-composer

You compose the actual mockup pages. Your output is the thing the human looks at in the browser.

## Input (via prompt)

- `planPath`: path to `.klp/staging/<id>/plan.json`.

## Workflow

1. **Read the plan** and load any `.klp/staging/<id>/inline/<screen>/*.tsx` snippets.
2. **For each DS component referenced**, read `docs/components/_index_<name>.md` to get precise props and anatomy.
3. **For each screen in order**, write `src/mockups/<id>/<screen>.tsx`:
   - Default export React component named `<PascalScreen>Mockup`.
   - Root wrapper: `<div className="min-h-screen bg-klp-bg-default text-klp-fg-default p-klp-size-xl">…</div>` (adjust padding by screen purpose, but stay within token aliases).
   - If the screen declares multiple states, render each state as a labeled `<section data-state="…">` stacked vertically, preceded by a small heading using `font-klp-mono` + `text-klp-fg-muted` so it's clear in review.
   - Import DS components as `import { X } from '@/components/ui/<name>'`.
   - Import ad-hoc reusables as `import { X } from '@/components/custom/<name>'`.
   - Import staged inline snippets as `import X from '.klp/staging/<id>/inline/<screen>/<name>'` — WAIT: do NOT do this. Inline snippets must be inlined into the screen file. Copy their content into the JSX, then the staging files are deleted by Stage 4.
4. **Write `src/mockups/<id>/_meta.json`:**

```json
{
  "id": "<id>",
  "title": "<title>",
  "project": "<project or null>",
  "goal": "<goal>",
  "generatedAt": "<ISO now>",
  "sourceRequest": "requests/pending/<id>.yaml",
  "brand": "<brand>",
  "screens": [
    { "name": "<name>", "route": "/mockups/<id>/<name>", "states": ["default", …] }
  ]
}
```

## Constraints

- Respect `layout_hint`s but don't pad them out — the mockup is static, not a real app.
- Never wrap in `<BrandProvider>` — the app root already does it.
- Never import `@radix-ui/*` directly or the scaffold routing (`import.meta.glob`).
- If a DS component referenced in `plan.json` is not present under `src/components/ui/`, abort with a clear message (likely the manifest hasn't shipped it yet).

## Report

```json
{
  "screensWritten": ["<name>", ...],
  "metaPath": "src/mockups/<id>/_meta.json",
  "missingDsComponents": ["<name>", ...]
}
```

If `missingDsComponents` is non-empty, the pipeline MUST halt before Stage 4.
```

- [ ] **Step 2: Commit**

```bash
git add cli/scaffold/claude/agents/mockup-composer.md.tmpl
git commit -m "feat(scaffold): mockup-composer agent template"
```

---

## Task 9: Agent template — `design-finalizer`

**Files:**
- Create: `cli/scaffold/claude/agents/design-finalizer.md.tmpl`

- [ ] **Step 1: Write template**

```markdown
---
name: design-finalizer
description: Stage 4 of /klp-design. Appends gap entries + design-log lines, (re)creates src/mockups/_index.tsx if missing, moves the YAML from pending to to-be-review, cleans staging.
tools: Read, Write, Edit, Glob, Bash
model: haiku
---

# design-finalizer

Mechanical stage. No judgment calls.

## Input (via prompt)

- `planPath`: path to `.klp/staging/<id>/plan.json`.
- `extras`: slash-command extras (may be empty).

## Workflow

1. **Read the plan.**
2. **Append to `docs/ds-gaps.md`:** if the file does not exist, create it with a header `# DS gaps\n\nLogged automatically by /klp-design.\n`. Then append a dated section:

```markdown
## <YYYY-MM-DD> — request `<id>`
- **<kind>** `<need>` (screen: `<screen>`, severity: <severity>)
- …
```

If `plan.gaps` is empty, write `- (no gaps)`.

3. **Append to `docs/design-log.md`:** if missing, create with header `# Design log\n`. Then append:

```
- <ISO now> — `<id>` → `to-be-review` — extras: "<extras>"
```

4. **If `src/mockups/_index.tsx` does not exist**, copy the shipped seed from the manifest scaffold (it was already placed by `klp-ui init`; if truly missing, print a warning and skip — the user can re-run init or create it by hand).

5. **Move the YAML:** `git mv requests/pending/<id>.yaml requests/to-be-review/<id>.yaml`. If `git mv` exits non-zero, fall back to plain `mv` and warn.

6. **Clean staging:** `rm -rf .klp/staging/<id>/`.

## Report

```json
{
  "newState": "to-be-review",
  "gapsLogged": <n>,
  "mockupsIndexStatus": "present|regenerated|missing"
}
```
```

- [ ] **Step 2: Commit**

```bash
git add cli/scaffold/claude/agents/design-finalizer.md.tmpl
git commit -m "feat(scaffold): design-finalizer agent template"
```

---

## Task 10: Slash-command template — `/klp-design`

**Files:**
- Create: `cli/scaffold/claude/commands/klp-design.md.tmpl`

- [ ] **Step 1: Write template**

```markdown
---
description: Run the agentic design pipeline on a YAML request. Usage: /klp-design <id> [extras…]
argument-hint: <id> [extras]
allowed-tools: Agent, Bash, Read, Write
---

# /klp-design

Argument: **$ARGUMENTS** — first token is the request id (kebab-case). Remaining tokens are ephemeral extras passed through to the pipeline.

You are orchestrating the 4-stage design pipeline. Follow these steps exactly; do not shortcut.

---

## Preflight

1. Parse `$ARGUMENTS`. Split on whitespace. First token = `id`. Rest = `extras` (join with single spaces).
2. If `id` is empty, ask the user which request and stop.
3. Verify `requests/pending/<id>.yaml` exists. If not:
   - If it exists in `to-be-review/` or later, refuse and suggest `/klp-design-reset <id>` to re-run.
   - Otherwise error: "no pending request matching id".
4. Verify `docs/agent-brief.md` exists (DS docs shipped). If not: abort with "run `klp-ui update`".
5. Verify `klp.lock.json` exists. If not: abort with "run `klp-ui init` first".

## Stage 1 — Analyze

Dispatch the **request-analyzer** subagent via the Agent tool:
- `subagent_type: "request-analyzer"`
- prompt: "Analyze request `requests/pending/<id>.yaml`. Extras: `<extras>`. Write the plan to `.klp/staging/<id>/plan.json`. Return JSON report."

Parse the returned JSON. If `screenCount === 0` or `planPath` missing, abort with the analyzer's message.

Print a short summary to the user (screen count, DS components, ad-hoc count, gap count).

## Stage 2 — Build ad-hoc (conditional)

If `plan.ad_hoc` is non-empty across any screen, dispatch the **ad-hoc-builder** subagent:
- prompt: "Build ad-hoc components from `.klp/staging/<id>/plan.json`. Return JSON report."

If the report contains `skipped` entries, print them to the user; they may require attention.

## Stage 3 — Compose

Dispatch the **mockup-composer** subagent:
- prompt: "Compose mockups from `.klp/staging/<id>/plan.json`. Return JSON report."

If `missingDsComponents` is non-empty, HALT. Print the missing names and tell the user to run `klp-ui update` or mark those needs as ad-hoc in the YAML.

## Stage 4 — Finalize

Dispatch the **design-finalizer** subagent:
- prompt: "Finalize request `<id>` using plan `.klp/staging/<id>/plan.json`. Extras: `<extras>`. Return JSON report."

## Summary

Print a final message:

```
✓ Mockups generated: <n> screens
  Request moved to: requests/to-be-review/<id>.yaml
  Open: http://localhost:5173/#/mockups/<id>/<first-screen>
  Next: /klp-design-review <id> after you've looked at them.
```
```

- [ ] **Step 2: Commit**

```bash
git add cli/scaffold/claude/commands/klp-design.md.tmpl
git commit -m "feat(scaffold): /klp-design slash command template"
```

---

## Task 11: Slash-command templates — review / validate / reset

**Files:**
- Create: `cli/scaffold/claude/commands/klp-design-review.md.tmpl`
- Create: `cli/scaffold/claude/commands/klp-design-validate.md.tmpl`
- Create: `cli/scaffold/claude/commands/klp-design-reset.md.tmpl`

- [ ] **Step 1: Write `klp-design-review.md.tmpl`**

```markdown
---
description: Mark a reviewed design as awaiting validation. Usage: /klp-design-review <id>
argument-hint: <id>
allowed-tools: Bash, Read, Write
---

# /klp-design-review

Argument: **$ARGUMENTS** — request id.

1. Verify `requests/to-be-review/<id>.yaml` exists. If not, abort with a clear message.
2. `git mv requests/to-be-review/<id>.yaml requests/to-be-validate/<id>.yaml` (fall back to plain `mv` if not a git repo).
3. Append to `docs/design-log.md`: `- <ISO now> — \`<id>\` → to-be-validate — (review signed off)`.
4. Print: `✓ <id> moved to to-be-validate/. Use /klp-design-validate <id> after meeting sign-off.`
```

- [ ] **Step 2: Write `klp-design-validate.md.tmpl`**

```markdown
---
description: Mark a validated design as processed. Usage: /klp-design-validate <id>
argument-hint: <id>
allowed-tools: Bash, Read, Write
---

# /klp-design-validate

Argument: **$ARGUMENTS** — request id.

1. Verify `requests/to-be-validate/<id>.yaml` exists. If not, abort.
2. `git mv requests/to-be-validate/<id>.yaml requests/processed/<id>.yaml` (fallback to plain mv).
3. Append to `docs/design-log.md`: `- <ISO now> — \`<id>\` → processed — (validated)`.
4. Print: `✓ <id> moved to processed/. Done.`
```

- [ ] **Step 3: Write `klp-design-reset.md.tmpl`**

```markdown
---
description: Reset a request to pending and delete its mockups so /klp-design can re-run. Usage: /klp-design-reset <id>
argument-hint: <id>
allowed-tools: Bash, Read, Write
---

# /klp-design-reset

Argument: **$ARGUMENTS** — request id.

1. Locate the YAML by searching `requests/to-be-review/`, `requests/to-be-validate/`, `requests/processed/`. If not found in any, abort.
2. `git mv <found-path> requests/pending/<id>.yaml` (fallback to plain mv).
3. If `src/mockups/<id>/` exists, `rm -rf src/mockups/<id>/`.
4. Append to `docs/design-log.md`: `- <ISO now> — \`<id>\` → pending — (reset)`.
5. Print: `✓ <id> reset to pending/. Mockups deleted. Re-run with /klp-design <id>.`
```

- [ ] **Step 4: Commit**

```bash
git add cli/scaffold/claude/commands/klp-design-review.md.tmpl cli/scaffold/claude/commands/klp-design-validate.md.tmpl cli/scaffold/claude/commands/klp-design-reset.md.tmpl
git commit -m "feat(scaffold): design state-transition slash commands"
```

---

## Task 12: Manifest builder — `docs` group + `brandFiles[]` + extended scaffold

**Files:**
- Modify: `scripts/build-manifest.ts`

- [ ] **Step 1: Add `buildDocsGroup` + new scaffold `tmplToDst` entries**

Open `scripts/build-manifest.ts`. Make the following changes:

**a.** After `buildLibGroup()`, add a new function:

```ts
function buildDocsGroup(): { files: ManifestFile[]; brandFiles: (ManifestFile & { brand: string })[] } {
  const files: ManifestFile[] = []
  const simple = [
    'docs/agent-brief.md',
    'docs/index.md',
    'docs/overview.md',
    'docs/tokens/_index_tokens.md',
    'docs/tokens/colors.md',
    'docs/tokens/radius.md',
    'docs/tokens/spacing.md',
    'docs/tokens/typography.md',
    'docs/brands/_index_brands.md',
  ]
  for (const p of simple) {
    if (!existsSync(join(ROOT, p))) continue
    files.push({ src: p, dst: p, hash: hashFile(join(ROOT, p)) })
  }
  // per-component docs
  const compDir = join(ROOT, 'docs/components')
  if (existsSync(compDir)) {
    for (const entry of readdirSync(compDir)) {
      if (!/^_index_.*\.md$/.test(entry)) continue
      const p = `docs/components/${entry}`
      files.push({ src: p, dst: p, hash: hashFile(join(ROOT, p)) })
    }
  }
  // brand docs — declared separately so init can pick only one
  const brandFiles: (ManifestFile & { brand: string })[] = []
  const brandDir = join(ROOT, 'docs/brands')
  if (existsSync(brandDir)) {
    for (const entry of readdirSync(brandDir)) {
      if (!/^(klub|atlas|showup|wireframe)\.md$/.test(entry)) continue
      const brand = entry.replace(/\.md$/, '')
      const p = `docs/brands/${entry}`
      brandFiles.push({ src: p, dst: p, hash: hashFile(join(ROOT, p)), brand })
    }
  }
  return { files, brandFiles }
}
```

**b.** Extend `tmplToDst(...)` to map the new scaffold templates. Replace the existing `mapping` object contents with:

```ts
  const mapping: Record<string, string> = {
    'package.json.tmpl': 'package.json',
    'vite.config.ts.tmpl': 'vite.config.ts',
    'tsconfig.json.tmpl': 'tsconfig.json',
    'tsconfig.node.json.tmpl': 'tsconfig.node.json',
    'index.html.tmpl': 'index.html',
    'main.tsx.tmpl': 'src/main.tsx',
    'App.tsx.tmpl': 'src/App.tsx',
    'index.css.tmpl': 'src/index.css',
    'gitignore.tmpl': '.gitignore',
    'claude/CLAUDE.md.tmpl': '.claude/CLAUDE.md',
    'claude/agents/.gitkeep': '.claude/agents/.gitkeep',
    'claude/skills/.gitkeep': '.claude/skills/.gitkeep',
    'claude/agents/request-analyzer.md.tmpl': '.claude/agents/request-analyzer.md',
    'claude/agents/ad-hoc-builder.md.tmpl': '.claude/agents/ad-hoc-builder.md',
    'claude/agents/mockup-composer.md.tmpl': '.claude/agents/mockup-composer.md',
    'claude/agents/design-finalizer.md.tmpl': '.claude/agents/design-finalizer.md',
    'claude/commands/klp-design.md.tmpl': '.claude/commands/klp-design.md',
    'claude/commands/klp-design-review.md.tmpl': '.claude/commands/klp-design-review.md',
    'claude/commands/klp-design-validate.md.tmpl': '.claude/commands/klp-design-validate.md',
    'claude/commands/klp-design-reset.md.tmpl': '.claude/commands/klp-design-reset.md',
    'mockups/_index.tsx.tmpl': 'src/mockups/_index.tsx',
    'requests/pending/.gitkeep': 'requests/pending/.gitkeep',
    'requests/to-be-review/.gitkeep': 'requests/to-be-review/.gitkeep',
    'requests/to-be-validate/.gitkeep': 'requests/to-be-validate/.gitkeep',
    'requests/processed/.gitkeep': 'requests/processed/.gitkeep',
  }
```

**c.** Replace the `main()` function's `groups` object to include the new `docs` group and keep the existing groups:

```ts
  const docs = buildDocsGroup()
  const manifest = {
    version: MANIFEST_VERSION,
    generatedAt: new Date().toISOString(),
    ref: 'main',
    brands: BRANDS,
    groups: {
      tokens: { required: true, ...buildTokenGroup() },
      lib: { required: true, ...buildLibGroup() },
      components: { required: true, ...buildComponentsGroup() },
      docs: { required: true, files: docs.files, brandFiles: docs.brandFiles },
      claude: { required: false, ...buildClaudeGroup() },
      scaffold: { required: true, ...buildScaffoldGroup() },
    },
  }
```

- [ ] **Step 2: Regenerate manifest**

Run: `pnpm run build:manifest`
Expected: succeeds, includes the new `docs` group. Prints counts unchanged for other groups.

- [ ] **Step 3: Sanity-check manifest**

Run:
```bash
node -e "const m = JSON.parse(require('fs').readFileSync('registry/manifest.json','utf8')); console.log('docs files:', m.groups.docs.files.length); console.log('brandFiles:', m.groups.docs.brandFiles.map(b => b.brand).join(',')); console.log('scaffold files:', m.groups.scaffold.files.length);"
```

Expected:
- `docs files: ≥ 10` (agent-brief + index + overview + 4 tokens + brands index + ~N per-component indexes)
- `brandFiles: atlas,klub,showup,wireframe`
- `scaffold files: 25` = 12 original (package.json, vite.config.ts, tsconfig.json, tsconfig.node.json, index.html, main.tsx, App.tsx, index.css, gitignore, claude/CLAUDE.md, claude/agents/.gitkeep, claude/skills/.gitkeep) + 4 agents + 4 commands + 1 mockups seed + 4 request gitkeeps.

If the count differs, inspect `registry/manifest.json` directly to find the discrepancy before proceeding.

- [ ] **Step 4: Commit**

```bash
git add scripts/build-manifest.ts registry/manifest.json
git commit -m "feat(manifest): docs group + brandFiles + extended scaffold mapping"
```

---

## Task 13: Manifest module + validator — tolerate `brandFiles[]`

**Files:**
- Modify: `cli/manifest.mjs`
- Modify: `scripts/validate-manifest.mjs`

- [ ] **Step 1: Update `validateManifest` in cli/manifest.mjs**

In `cli/manifest.mjs`, inside the `for (const [groupName, group] of Object.entries(manifest.groups))` loop, add brandFiles validation after the existing `if (group.files)` block:

Change:
```js
  for (const [groupName, group] of Object.entries(manifest.groups)) {
    if (group.files) {
      for (const f of group.files) validateFile(f, `groups.${groupName}.files`)
    }
    if (group.items) {
      for (const [itemName, item] of Object.entries(group.items)) {
        for (const f of item.files) validateFile(f, `groups.${groupName}.items.${itemName}.files`)
      }
    }
  }
```

to:
```js
  for (const [groupName, group] of Object.entries(manifest.groups)) {
    if (group.files) {
      for (const f of group.files) validateFile(f, `groups.${groupName}.files`)
    }
    if (group.brandFiles) {
      for (const f of group.brandFiles) {
        validateFile(f, `groups.${groupName}.brandFiles`)
        if (typeof f.brand !== 'string' || !f.brand) {
          throw new Error(`groups.${groupName}.brandFiles: missing brand for ${f.src}`)
        }
      }
    }
    if (group.items) {
      for (const [itemName, item] of Object.entries(group.items)) {
        for (const f of item.files) validateFile(f, `groups.${groupName}.items.${itemName}.files`)
      }
    }
  }
```

Also update `flattenManifest` to include brandFiles (they are fetched like regular files, just selectively):

Change:
```js
export function flattenManifest(manifest) {
  const out = []
  for (const [groupName, group] of Object.entries(manifest.groups)) {
    if (group.files) {
      for (const f of group.files) out.push({ ...f, group: groupName })
    }
    if (group.items) {
      for (const [itemName, item] of Object.entries(group.items)) {
        for (const f of item.files) out.push({ ...f, group: groupName, item: itemName })
      }
    }
  }
  return out
}
```

to:
```js
export function flattenManifest(manifest, options = {}) {
  const selectedBrand = options.brand ?? null
  const out = []
  for (const [groupName, group] of Object.entries(manifest.groups)) {
    if (group.files) {
      for (const f of group.files) out.push({ ...f, group: groupName })
    }
    if (group.brandFiles) {
      for (const f of group.brandFiles) {
        if (selectedBrand && f.brand !== selectedBrand) continue
        out.push({ ...f, group: groupName })
      }
    }
    if (group.items) {
      for (const [itemName, item] of Object.entries(group.items)) {
        for (const f of item.files) out.push({ ...f, group: groupName, item: itemName })
      }
    }
  }
  return out
}
```

Callers that pass no `options` get everything (validators, tests). Callers that pass `{ brand }` get only the matching brand doc.

- [ ] **Step 2: Update `scripts/validate-manifest.mjs`**

Open `scripts/validate-manifest.mjs`. Update the `flatten` helper:

Change:
```js
function flatten(m) {
  const out = []
  for (const [g, group] of Object.entries(m.groups)) {
    if (group.files) for (const f of group.files) out.push({ ...f, group: g })
    if (group.items) {
      for (const [i, item] of Object.entries(group.items)) {
        for (const f of item.files) out.push({ ...f, group: g, item: i })
        for (const dep of item.deps.components) {
          if (!m.groups.components.items[dep]) {
            console.error(`✗ ${g}.items.${i}: depends on unknown component "${dep}"`)
            errors++
          }
        }
      }
    }
  }
  return out
}
```

to:
```js
function flatten(m) {
  const out = []
  for (const [g, group] of Object.entries(m.groups)) {
    if (group.files) for (const f of group.files) out.push({ ...f, group: g })
    if (group.brandFiles) for (const f of group.brandFiles) out.push({ ...f, group: g, brand: f.brand })
    if (group.items) {
      for (const [i, item] of Object.entries(group.items)) {
        for (const f of item.files) out.push({ ...f, group: g, item: i })
        for (const dep of item.deps.components) {
          if (!m.groups.components.items[dep]) {
            console.error(`✗ ${g}.items.${i}: depends on unknown component "${dep}"`)
            errors++
          }
        }
      }
    }
  }
  return out
}
```

- [ ] **Step 3: Run validator**

Run: `pnpm run validate:manifest`
Expected: exit 0.

- [ ] **Step 4: Run smoke test**

Run: `pnpm run test:cli`
Expected: all assertions pass (the existing tests still work; they call `flattenManifest` without `brand` → all entries returned).

- [ ] **Step 5: Commit**

```bash
git add cli/manifest.mjs scripts/validate-manifest.mjs
git commit -m "feat(manifest): brandFiles[] validation + brand-filtering in flatten"
```

---

## Task 14: `cli/init.mjs` — brand filter + seed scaffold paths

**Files:**
- Modify: `cli/init.mjs`

- [ ] **Step 1: Brand-filter the manifest during init**

In `cli/init.mjs`, inside `run(rest)` after `const manifest = await fetchManifest(args.ref, REPO, { force: args.force })`, change:

```js
  const manifest = await fetchManifest(args.ref, REPO, { force: args.force })
  const files = flattenManifest(manifest)
```

to:

```js
  const manifest = await fetchManifest(args.ref, REPO, { force: args.force })
  const files = flattenManifest(manifest, { brand })
```

This filters brand docs to only the chosen brand.

- [ ] **Step 2: Verify**

Run `node --check cli/init.mjs`. Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add cli/init.mjs
git commit -m "feat(cli): init ships only the chosen brand doc"
```

---

## Task 15: `cli/update.mjs` — `--brand=<new>` swap

**Files:**
- Modify: `cli/update.mjs`

- [ ] **Step 1: Accept `--brand` + pass brand filter**

In `cli/update.mjs`, update `parseArgs`:

Change:
```js
function parseArgs(rest) {
  const out = { ref: 'main', dryRun: false, verbose: false, force: false }
  for (const arg of rest) {
    if (arg.startsWith('--ref=')) out.ref = arg.slice(6)
    else if (arg === '--dry-run') out.dryRun = true
    else if (arg === '--verbose') out.verbose = true
    else if (arg === '--force') out.force = true
  }
  return out
}
```

to:
```js
function parseArgs(rest) {
  const out = { ref: 'main', dryRun: false, verbose: false, force: false, brand: null }
  for (const arg of rest) {
    if (arg.startsWith('--ref=')) out.ref = arg.slice(6)
    else if (arg === '--dry-run') out.dryRun = true
    else if (arg === '--verbose') out.verbose = true
    else if (arg === '--force') out.force = true
    else if (arg.startsWith('--brand=')) out.brand = arg.slice(8)
  }
  return out
}
```

- [ ] **Step 2: Resolve effective brand + pass to computeDiff input**

In `run(rest)`, after `const lockfile = JSON.parse(await readFile(lockPath, 'utf8'))`, add:

```js
  const effectiveBrand = args.brand ?? lockfile.brand
  if (args.brand && args.brand !== lockfile.brand) {
    console.log(pc.yellow(`! switching brand: ${lockfile.brand} → ${args.brand}`))
    console.log(pc.gray(`  remember to update <BrandProvider brand="${args.brand}"> in src/App.tsx`))
  }
```

Then pass `effectiveBrand` into the diff via the manifest filter. Since `computeDiff` uses `flattenManifest(manifest)` internally, we need to pre-filter. The simplest option: pass a pre-filtered manifest object. Rebuild `manifest` with a filtered `brandFiles`:

Inside `run`, after `const manifest = await fetchManifest(args.ref, REPO, { force: args.force })`, add:

```js
  // Filter brand docs to the active brand only, so diff doesn't flag other-brand entries as REMOVED.
  if (manifest.groups.docs?.brandFiles) {
    manifest.groups.docs = {
      ...manifest.groups.docs,
      brandFiles: manifest.groups.docs.brandFiles.filter((f) => f.brand === effectiveBrand),
    }
  }
```

- [ ] **Step 3: Update lockfile.brand on successful apply**

Where we write `newLock`, update to reflect the potentially changed brand:

Change:
```js
  const newLock = {
    ...lockfile,
    manifestVersion: manifest.version,
    ref: args.ref,
    files: newLockFiles,
  }
```

to:
```js
  const newLock = {
    ...lockfile,
    manifestVersion: manifest.version,
    ref: args.ref,
    brand: effectiveBrand,
    files: newLockFiles,
  }
```

- [ ] **Step 4: Syntax check**

Run: `node --check cli/update.mjs` → exit 0.

- [ ] **Step 5: Commit**

```bash
git add cli/update.mjs
git commit -m "feat(cli): update supports --brand=<new> (swap brand doc, advise App.tsx edit)"
```

---

## Task 16: `package.json` — update files field for new scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Ensure files field includes build-agent-brief**

In `package.json`, the `files` field already includes `cli`, `src`, `registry`, scripts. Add `scripts/build-agent-brief.ts` to the list. Final `"files"`:

```json
"files": [
  "cli",
  "src",
  "registry",
  "scripts/build-manifest.ts",
  "scripts/build-agent-brief.ts",
  "scripts/validate-manifest.mjs",
  "README.md"
]
```

- [ ] **Step 2: Commit**

```bash
git add package.json
git commit -m "chore(pkg): include build-agent-brief in npx tarball"
```

---

## Task 17: DS-repo CLAUDE.md — agentic design workflow section

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Append new section after the existing "CLI distribution workflow"**

Append to the root `CLAUDE.md`:

```markdown

## Agentic design workflow

Separate from the DS authoring workflow (`/klp-build-component`), the consumer projects can run a 4-stage design pipeline triggered by `/klp-design <request-id> [extras…]`. The pipeline reads a YAML request and produces React mockup pages.

- Pipeline stages: `request-analyzer` → `ad-hoc-builder` → `mockup-composer` → `design-finalizer`. Templates live at `cli/scaffold/claude/agents/*.md.tmpl` and ship via the `scaffold` manifest group.
- Supporting slash commands: `/klp-design-review`, `/klp-design-validate`, `/klp-design-reset`. Templates at `cli/scaffold/claude/commands/*.md.tmpl`.
- The consumer's `docs/` tree is populated at init via the new `docs` manifest group — ships `agent-brief.md`, `index.md`, `overview.md`, per-component docs, token docs, and the active brand doc (via `brandFiles[]` selection).
- `docs/agent-brief.md` is generated by `scripts/build-agent-brief.ts`. Run `pnpm run build:agent-brief` after any change to `klp-components.json` or `src/styles/tokens/aliases.css`. `pnpm run build:all` runs the full chain (`sync:tokens` → `build:agent-brief` → `build:manifest` → `validate:manifest`).
- The consumer's request-state folders (`requests/{pending,to-be-review,to-be-validate,processed}/`) ship empty at init. Brain agents drop YAML in `pending/`. `/klp-design` moves files through the state machine.
- `src/mockups/_index.tsx` ships as a seed; the consumer app's `App.tsx` routes via `import.meta.glob` over `src/mockups/*/*.tsx`.
- Pipeline-maintained files never in the manifest: `docs/ds-gaps.md`, `docs/design-log.md`, `src/mockups/*`, `src/components/custom/*`. `klp-ui update` never touches them.

Spec: `docs/superpowers/specs/2026-04-20-agentic-design-workflow-design.md`.
Plan: `docs/superpowers/plans/2026-04-20-agentic-design-workflow.md`.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(claude): add agentic design workflow section"
```

---

## Task 18: Final verification (manual)

- [ ] **Step 1: Run full umbrella build**

```bash
pnpm run build:all
```

Expected: all four subcommands (`sync:tokens`, `build:agent-brief`, `build:manifest`, `validate:manifest`) exit 0.

- [ ] **Step 2: Run smoke test**

```bash
pnpm run test:cli
```

Expected: all assertions pass.

- [ ] **Step 3: Dry-run init in a tmpdir**

Push the current branch and merge to main first (so `npx github:` sees it). Then:

```bash
cd ~/Desktop && rm -rf klp-design-demo
npx github:BaptisteMo/klp-design-system init klp-design-demo --brand=klub --no-install --no-git
```

Expected: directory written; includes `.claude/agents/{request-analyzer,ad-hoc-builder,mockup-composer,design-finalizer}.md`, `.claude/commands/klp-design*.md`, `docs/agent-brief.md`, `docs/brands/klub.md` (only), `requests/{pending,to-be-review,to-be-validate,processed}/.gitkeep`, `src/mockups/_index.tsx`.

- [ ] **Step 4: Typecheck generated project**

```bash
cd ~/Desktop/klp-design-demo && pnpm install && pnpm typecheck
```

Expected: no type errors.

- [ ] **Step 5: Dev-server smoke**

```bash
cd ~/Desktop/klp-design-demo && pnpm dev
```

Visit `http://localhost:5173/`. Expected: index page renders "No mockups yet. Drop a YAML…". Close server.

- [ ] **Step 6: Final commit (if anything lingering)**

```bash
cd /Users/morillonbaptiste/klp-design-system && git status
```

If clean, done.

---

## Summary

After completion:
- DS repo:
  - `scripts/build-agent-brief.ts` generates `docs/agent-brief.md`
  - `scripts/build-manifest.ts` emits `docs` group + `brandFiles[]`
  - `cli/manifest.mjs` + `scripts/validate-manifest.mjs` understand `brandFiles[]`
  - `cli/init.mjs` filters brand docs to chosen brand
  - `cli/update.mjs` accepts `--brand=<new>` and swaps the brand doc
  - 4 agent templates + 4 slash-command templates + seed `mockups/_index.tsx` + 4 request gitkeeps + updated `App.tsx.tmpl`/`gitignore.tmpl`/`CLAUDE.md.tmpl`
- Consumer (post-init):
  - Reads `docs/agent-brief.md` + `docs/components/_index_*.md` + active brand doc
  - Receives YAML requests in `requests/pending/`
  - Runs `/klp-design <id>` to produce switchable React mockup pages
  - Tracks state via folder moves; logs gaps + design-log automatically
