---
title: klp-design-system — Documentation Index
type: overview
updated: 2026-04-17
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
- [Input](./components/_index_input.md) — Text input field with label and optional icons, 3 sizes × 6 states (18 variants)
- [Radio](./components/_index_radio.md) — Radio button control, single State axis (rest / hover / clicked / disable), 4 variants
- [Switch](./components/_index_switch.md) — Toggle switch, 2 states (toggle-on / toggle-off), animated thumb with check icon
- [Text Area](./components/_index_text-area.md) — Multi-line text input, 2 feature variants × 6 states (12 variants)

### feedback
- [Floating Alert](./components/_index_floating-alert.md) — Floating alert banner, 4 states × 3 sizes (12 variants)
- [InContent Alert](./components/_index_in-content-alert.md) — Inline alert banner, 4 content types × 3 sizes (12 variants)

### layout
*(empty — no components yet)*

### navigation
- [BreadCrumbs](./components/_index_breadcrumbs.md) — Horizontal breadcrumb trail, single Steps axis (0–3 ancestor steps), 4 variants
- [Tabulation Cells](./components/_index_tabulation-cells.md) — Single tab cell with label and optional badge, 2 states (rest / active)
- [Tabulations](./components/_index_tabulations.md) — Horizontal tab bar container wrapping Tabulation Cells with dividers, scroll-type=none (1 variant)

### overlay
- [Tooltip](./components/_index_tooltip.md) — Contextual tooltip bubble with a directional arrow, 4 arrow-orientation variants

### overlays
- [ActionSheet Item](./components/_index_action-sheet-item.md) — Single action-sheet row item, 7 states × 3 sizes (21 variants)

### data-display
- [Badge](./components/_index_badges.md) — Status indicator pill, 9 types × 3 sizes × 2 styles (48 variants)
- [Table Row](./components/_index_table-row.md) — Data table row, 4 types × floating-action axis (5 variants); supports empty state with illustration slot

### list
- [List Content](./components/_index_list-content.md) — List row with decorative icon, label + sublabel, and optional action button, 3 sizes × 3 states (9 variants)

### lists
- [ActionSheet Menu](./components/_index_action-sheet-menu.md) — Contextual menu panel with grouped ActionSheet_Item rows, optional section titles, and separators. 3 layout types (default / checkbox / flat)
- [List](./components/_index_list.md) — Vertical list container with header, optional action button, and repeated List Content rows. 3 style variants (condensed / default / with-inputs)

### table cells
- [Table Cells / Actions](./components/_index_table-cells-actions.md) — Table cell with 1–4 inline action buttons (icon-only + primary labelled), 2 height tiers × 4 action counts (8 variants)
- [Table Cells / Badges](./components/_index_table-cells-badges.md) — Table cell embedding a klp Badge or Status-badge instance, 2 types × 2 heights × 6 widths (22 variants)
- [Table Cells / Checkbox](./components/_index_table-cells-checkbox.md) — Table cell wrapping a single klp Checkbox instance, 2 height tiers × 2 width variants (3 variants)
- [Table Cells / Empty](./components/_index_table-cells-empty.md) — Empty placeholder spacer cell, 2 height tiers × 3 width variants (3 variants)
- [Table Cells / Text](./components/_index_table-cells-text.md) — Table cell with primary text and optional subtitle, 2 height tiers × 5 column widths (10 variants); optional checkbox, avatar, icon-button, badge slots

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
