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

- Bootstrap a new component: `/klp-build-component <Figma node name>` — orchestrates `figma-extractor` → `component-adapter` → `visual-verifier` subagents (max 3 correction passes).
- Verify one component: `pnpm verify:component <name>` (Playwright screenshot diff against Figma reference, threshold 2%).
- Regenerate docs + index: runs automatically as the last step of `component-adapter`. Can be forced with `pnpm run docs:generate`.

## Don'ts

- No hardcoded hex, rgb, or named colors in component source.
- No inline `<style>` tags.
- No `className` concatenation without `cn()`.
- No Storybook, no MDX, no docs site. Playground route + generated Markdown only.
- Don't edit `docs/components/*.md` by hand — changes are lost on regeneration. Manual prose goes under `## Notes` (preserved by marker).
- Don't commit files inside `.klp/verify-reports/` — these are local diagnostics.

## Useful paths

- Tokens: `src/styles/tokens.css` (orchestrator), `src/styles/tokens/{primitives,aliases,theme}.css` (generated)
- Tokens source of truth: `.klp/tokens.json` (captured from Figma via MCP, committed for diff-tracking)
- Tokens sync script: `scripts/sync-tokens.ts`
- Component source: `src/components/<name>/`
- Playground routes: `playground/routes/<name>.tsx`
- Figma specs (extractor output): `.klp/figma-refs/<name>/`
- Registry (CLI distribution): `registry/<name>.json` + `registry/index.json`
- Agent-facing index: `klp-components.json` (repo root)
- Agent definitions: `.claude/agents/{figma-extractor,component-adapter,visual-verifier}.md`
- Slash command: `.claude/commands/klp-build-component.md`
