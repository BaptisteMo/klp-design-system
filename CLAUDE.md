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
