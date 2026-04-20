# @klp/ui — project conventions

This file is read by Claude Code on every session. Follow it when editing the repo.

## What this repo is

A React 19 + TypeScript + Vite design system built on **Radix Primitives** (for behavior + a11y) and **Tailwind v4** (for styling via `--klp-*` CSS variables). Distribution model: **shadcn-style copy-paste** via the `klp-ui` CLI — consumers own the source of each component they add.

## Component rules

- Source lives in `src/components/<name>/`. One folder per component.
- Every component ships with: `<Component>.tsx`, `index.ts`, `<Component>.example.tsx`, and a playground route at `playground/routes/<component>.tsx` rendering the full variant × size × state matrix.
- Styling uses **Tailwind utilities referencing `--klp-*` alias tokens** (e.g. `bg-klp-bg-brand`, `text-klp-fg-default`, `border-klp-border-default`, `rounded-klp-m`, `gap-klp-size-s`). **Never hardcode hex colors.** Never reference primitives (`--klp-color-*`) directly.
- Class composition goes through `cn()` from `@/lib/cn`. Never concatenate class strings by hand.
- Variants use `class-variance-authority`. One `cva` block per component.
- Compose Radix Primitives as base. Re-export Radix parts for compound components (e.g. `<Dialog.Root>`, `<Dialog.Trigger>`).

### Composition discipline (new components)

When a new component reuses existing DS primitives (Button, Badges, Input, …), the pipeline enforces reuse automatically:

- **figma-extractor** flags every Figma INSTANCE whose mainComponent matches an entry in `klp-components.json` → sets `anatomy[].klpComponent` and `spec.composition.reuses[]`.
- **component-adapter** must import and render these flagged components; any deviation is reported as a typed `gap` (`unmatched-instance`, `partial-reuse`, `no-instance-no-match`, `new-primitive`).
- **validate-tokens.mjs** cross-checks that the source imports and uses every flagged component (`reuse` check family) and that no inline `<svg>` markup is introduced (`icons` check family).
- **documentalist** scans `@/components/*` imports in source to keep `dependencies.components[]` and reverse `usedBy[]` edges current. Gaps are persisted per-component in `docs/components/_index_<name>.md` under `KLP:GAPS:BEGIN/END` markers and aggregated in `docs/gaps.md`.

For specs captured before this discipline (v1 specs without the `composition` field), the agents fall back to best-effort mode — no regression.

## Styling

- Tailwind v4 CSS-first. Tokens are organized in 3 layers under `src/styles/tokens/`:
  - `primitives.css` — raw palettes + scales (`--klp-color-*`, `--klp-spacing-*`, `--klp-radius-*`).
  - `aliases.css` — semantic tokens (`--klp-bg-*`, `--klp-fg-*`, `--klp-border-*`, `--klp-size-*`, `--klp-font-*`) switched by `[data-brand]`.
  - `theme.css` — Tailwind v4 `@theme inline` block exposing **aliases only** as `klp-*` utilities.
  `src/styles/tokens.css` is the orchestrator: imports the 3 layers, then the `--- manual additions ---` marker.
- Layers are regenerated from `.klp/tokens.json` by `pnpm run sync:tokens`. Primitives are internal: **components must never reference `--klp-color-*` directly**, always go through aliases.
- Brand switching uses `[data-brand="klub|atlas|showup|wireframe"]` on a root element (see `document.documentElement.dataset.brand`). Default brand is **Wireframe**. No `[data-theme="dark"]`, no `prefers-color-scheme`.

## Workflow

- Bootstrap a new component: `/klp-build-component <Figma node name>` — orchestrates the pipeline:
  1. `figma-extractor` (subagent) — captures the Figma spec (`.klp/figma-refs/<name>/spec.json`) with per-layer token bindings + reference PNGs
  2. `component-adapter` (subagent) — writes the React source + playground route + registry stub
  3. `klp-token-validator` (skill; runs `scripts/validate-tokens.mjs`) — asserts every layer × state × property uses the correct Tailwind alias utility; ≤1s, no Chromium, no thresholds. Stage-3 retries patch mismatches inline once; further failures surface to the user.
  4. `documentalist` (subagent) — generates `docs/components/_index_<name>.md` + updates `klp-components.json` + runs the cross-reference reverse-index pass (non-blocking; failure here doesn't abort the commit gate)
- Validate token bindings for one component: `node scripts/validate-tokens.mjs <name>` — outputs JSON, exit 0 on pass, 1 on mismatch.
- Regenerate / re-sync the docs for a single component (without rerunning the full pipeline): dispatch the `documentalist` agent manually with `operation: DOCUMENT, component: <name>`.
- Health-check the doc tree: dispatch `documentalist` with `operation: LINT`.
- Brief a fresh agent on the project: dispatch `documentalist` with `operation: CRAWL` — returns a 1-page summary of components, tokens, brands, and the dependency graph.
- Visual review is a human step. Open the playground (`pnpm dev` → `http://localhost:5173/<name>`) alongside the Figma references in `.klp/figma-refs/<name>/` and reconcile any last-10% drift.
- Batch import N components from Figma: `/klp-build-batch [--page=Components] [--names=A,B,C] [--force]` — discovers candidates on the named Figma page, then runs extract → adapt → validate → document SERIALLY for each. 3 user gates total (start / mid-batch failures / final commit). Use this when integrating 3+ components at once.
- Expected Figma structure for batch: a single page named `Components` containing `Section`s named per category (e.g. `Inputs`, `Overlays`, `Feedback`). Each section contains `COMPONENT_SET` nodes. Section names map to spec `category`; component-set names map to component `name` (kebab-cased).

## Don'ts

- No hardcoded hex, rgb, or named colors in component source.
- No inline `<style>` tags.
- No `className` concatenation without `cn()`.
- No Storybook, no MDX, no docs site. Playground route + generated Markdown only.
- Don't edit `docs/components/*.md` by hand outside the `<!-- KLP:NOTES:BEGIN --> ... <!-- KLP:NOTES:END -->` block — anything outside the markers is overwritten by the documentalist on next regeneration. Manual prose goes between the markers.
- Don't write to `klp-components.json` from any other agent (component-adapter writes a stub during Stage 2; the documentalist owns the canonical entry).
- Don't commit `docs/.lint-report.md` — local diagnostic only.
- Don't write a local cva that duplicates an existing DS component — import it from `@/components/<name>` instead.
- Don't edit the `KLP:GAPS` block by hand — it's regenerated by the documentalist from the adapter's `gaps[]`.
- Don't edit `docs/gaps.md` by hand — it's a pure snapshot, rewritten at every documentalist pass.

## Useful paths

- Tokens: `src/styles/tokens.css` (orchestrator), `src/styles/tokens/{primitives,aliases,theme}.css` (generated)
- Tokens source of truth: `.klp/tokens.json` (captured from Figma via MCP, committed for diff-tracking)
- Tokens sync script: `scripts/sync-tokens.ts`
- Component source: `src/components/<name>/`
- Playground routes: `playground/routes/<name>.tsx`
- Figma specs (extractor output): `.klp/figma-refs/<name>/`
- Registry (CLI distribution): `registry/<name>.json` + `registry/index.json`
- Agent-facing index: `klp-components.json` (repo root) — sole writer is the `documentalist` agent
- Generated docs tree: `docs/` — `index.md` (master catalog), `overview.md`, `log.md`, `components/_index_<name>.md`, `tokens/<group>.md`, `brands/<brand>.md`. Regenerated by the `documentalist` agent. The `<!-- KLP:NOTES:BEGIN --> ... <!-- KLP:NOTES:END -->` block on each page is preserved across regenerations.
- Agent definitions: `.claude/agents/{figma-extractor,component-adapter,documentalist}.md`
- Token validator: `scripts/validate-tokens.mjs` + skill at `.claude/skills/klp-token-validator/SKILL.md`
- Slash command: `.claude/commands/klp-build-component.md`
- Batch slash command: `.claude/commands/klp-build-batch.md`
- Batch state helper: `scripts/batch-state.mjs` (writes to `.klp/staging/`, gitignored)
- Aggregated DS gaps: `docs/gaps.md` (regenerated at every documentalist pass)
- Per-component gap block: inside `docs/components/_index_<name>.md` between `<!-- KLP:GAPS:BEGIN --> ... <!-- KLP:GAPS:END -->` (do not edit by hand)

## CLI distribution workflow

The DS is also distributed to external (personal) React projects via a CLI committed at `cli/`. Two commands: `init` (scaffold a fresh project) and `update` (batch + interactive per-file override).

- Source of truth for distribution: `registry/manifest.json`. Never hand-edit. Regenerate via `pnpm run build:manifest` after any change to `src/components/**`, `src/styles/tokens/**`, `src/lib/**`, or `cli/scaffold/**`.
- Integrity check: `pnpm run validate:manifest` — fails if a file's disk hash diverges from the manifest hash. Run before committing.
- Smoke test: `pnpm run test:cli` — asserts CLI help/version, rewrite rules, hash, manifest module, and diff categorization. Run before committing CLI changes.
- Consumer invocation: `npx github:BaptisteMo/klp-design-system init` and `npx github:BaptisteMo/klp-design-system update`.
- Lockfile (`klp.lock.json`) on the consumer side records the hash of every file at install/update time. Used to categorize diff: NEW, CHANGED-UPSTREAM, LOCAL-ONLY-CHANGE, CONFLICT, REMOVED-UPSTREAM, ALREADY-APPLIED.
- Consumer component path is flat: `src/components/ui/<name>/` (except `brand-provider` which is flat at `src/components/brand-provider.tsx`). The CLI rewrites imports on copy (`cli/rewrite.mjs`).
- Scaffold templates live in `cli/scaffold/` and are loaded from the CLI's local tarball, not GitHub raw. `{{projectName}}`, `{{brand}}`, `{{npmDeps}}` are interpolated. Scaffold files are one-time init artifacts — update does not re-apply them.
- npm tarball scope is limited via `"files"` in `package.json` to `cli/`, `src/`, `registry/`, `scripts/build-manifest.ts`, `scripts/validate-manifest.mjs`, `README.md`. Docs, playground, and `.klp/` are excluded.

Spec: `docs/superpowers/specs/2026-04-20-cli-distribution-design.md`.
Plan: `docs/superpowers/plans/2026-04-20-cli-distribution.md`.

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
