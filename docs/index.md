---
title: klp-design-system — Documentation Index
type: overview
updated: 2026-04-16
---

# klp-design-system

Master catalog of generated documentation. Maintained by the [`documentalist`](../.claude/agents/documentalist.md) agent. Never edit by hand outside the `## Notes` block.

Start here:
- [Project overview](./overview.md) — what this is, architecture, pipeline
- [Operations log](./log.md) — append-only history of doc operations

## Components

### inputs
- [Button](./components/_index_button.md) — Interactive button, 5 types × 4 sizes × 4 states (20 variants)
- [Checkbox](./components/_index_checkbox.md) — Toggle control, single State axis (rest / hover / clicked / mixed / disable), 5 variants
- [Radio](./components/_index_radio.md) — Radio button control, single State axis (rest / hover / clicked / disable), 4 variants

### feedback
*(empty — no components yet)*

### layout
*(empty — no components yet)*

### navigation
*(empty — no components yet)*

### overlays
*(empty — no components yet)*

### data-display
*(empty — no components yet)*

## Tokens
- [Token system overview](./tokens/_index_tokens.md) — 3-layer architecture (primitives → aliases → Tailwind theme)
- [Colors](./tokens/colors.md) — `bg-*`, `fg-*`, `border-*` aliases switched per brand
- [Spacing](./tokens/spacing.md) — `size-*` scale
- [Radius](./tokens/radius.md) — `radius-*` scale
- [Typography](./tokens/typography.md) — `font-*` family / weight / size

## Brands
- [Brand system overview](./brands/_index_brands.md) — how brands switch at runtime
- [wireframe](./brands/wireframe.md) — grayscale placeholder, default
- [klub](./brands/klub.md) — emerald primary
- [atlas](./brands/atlas.md) — night-blue primary, dense type scale
- [showup](./brands/showup.md) — midnight + gold

## Patterns
*(created on demand — file under `docs/patterns/_index_patterns.md` when added)*

## Architecture
*(created on demand — file under `docs/architecture/_index_architecture.md` when ADRs are added)*

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
