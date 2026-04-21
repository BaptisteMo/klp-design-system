---
title: Typography tokens
type: token-group
group: typography
updated: 2026-04-16
---

# Typography tokens

Brand-aware. Each brand has its own font family, weight scale, and size scale.

## Font family (`--klp-font-family-*`)

| Alias | wireframe | klub | atlas | showup |
|---|---|---|---|---|
| `font-family-title` | `Inter, Test Calibre, system-ui` | `Inter, Test Calibre, system-ui` | `Inter, Roboto, system-ui` | `Inter, Arial, system-ui` |
| `font-family-body` | (idem) | (idem) | (idem) | (idem) |
| `font-family-label` | (idem) | (idem) | (idem) | (idem) |

> Inter is the active fallback for all brands (loaded via `@fontsource/inter`). The brand-specific fonts (Test Calibre, Roboto, Arial) are layered after Inter — they take effect once their files ship locally.

## Font weight (`--klp-font-weight-*`)

| Alias | wireframe | klub | atlas | showup |
|---|---|---|---|---|
| `font-weight-title` | 600 | 600 | 700 | 600 |
| `font-weight-body` | 400 | 400 | 400 | 400 |
| `font-weight-body-bold` | 600 | 600 | 600 | 600 |
| `font-weight-label` | 400 | 400 | 400 | 400 |
| `font-weight-label-bold` | 600 | 600 | **700** | 600 |

> ⚠️ Tailwind v4 does not generate `font-weight-klp-*` utilities from the `@theme inline` block. Components currently use `font-bold` (700) as a workaround on labels. This drifts ~100 weight units from `--klp-font-weight-label-bold` on wireframe / klub / showup. Acceptable for now; revisit if visual diffs flag it.

## Font size (`--klp-font-size-*`)

| Alias | wireframe | klub | atlas | showup |
|---|---|---|---|---|
| `font-size-text-large` | 18 | 18 | **16** | 18 |
| `font-size-text-medium` | 16 | 16 | **14** | 16 |
| `font-size-text-small` | 14 | 14 | **12** | 14 |
| `font-size-text-smaller` | 12 | 12 | **11** | 12 |
| `font-size-heading-h1` | 30 | 30 | **24** | 30 |
| `font-size-heading-h2` | 24 | 24 | **20** | 24 |
| `font-size-heading-h3` | 20 | 20 | **18** | 20 |
| `font-size-heading-h4` | 18 | 18 | **16** | 18 |

Atlas runs a deliberately denser type scale (~2px smaller across the board) to match its informational/data-dense brand identity.

## Tailwind utilities

| Property | Utility | Example |
|---|---|---|
| Font family | `font-klp-*` | `font-klp-label` |
| Font weight | (use canonical Tailwind) | `font-bold`, `font-semibold` |
| Text size | `text-klp-text-*` `text-klp-heading-*` | `text-klp-text-medium`, `text-klp-heading-h2` |

## Used by

- [Button](../components/_index_button.md) — `font-klp-label`, `font-bold`, `text-klp-text-medium`, `text-klp-text-large`.
- [Tooltip](../components/_index_tooltip.md) — `font-klp-body`, `font-weight-klp-body`, `text-klp-text-medium` on label layer.
- [Badge](../components/_index_badges.md) — `font-klp-body`, `font-weight-klp-body`, `text-klp-text-small` on label layer across all variants.
- [Input](../components/_index_input.md) — `font-klp-label`, `font-weight-label` / `font-weight-label-bold`, `text-klp-text-large` / `text-klp-text-medium` on label, placeholder, and description layers.
- [List Content](../components/_index_list-content.md) — `font-klp-label`, `text-klp-text-medium` on label layer; `text-klp-text-small` (small/medium size) or `text-klp-text-medium` (large size) on sublabel layer.
- [ActionSheet Item](../components/_index_action-sheet-item.md) — `font-klp-label`, `font-weight-klp-label` (400), `text-klp-text-medium` (16px) on label layer across all variants.
- [Floating Alert](../components/_index_floating-alert.md) — `font-klp-body`, `font-klp-body` (weight 400), `text-klp-text-medium` (sm) / `text-klp-text-large` (md/lg) on content layer.
- [InContent Alert](../components/_index_in-content-alert.md) — `font-klp-label`, `font-klp-label-bold` (weight 600), `text-klp-text-medium` on title layer; `font-klp-body`, `font-klp-body` (weight 400), `text-klp-text-medium` on body layer.
- [BreadCrumbs](../components/_index_breadcrumbs.md) — `font-klp-body`, `font-weight-body` (400), `text-klp-text-medium` (16px) on step-label layer across all 4 step-count variants.
- [Tabulation Cells](../components/_index_tabulation-cells.md) — `font-klp-label` / `font-klp-label-bold`, `text-klp-text-medium` on label layer; `font-klp-body`, `text-klp-text-small` on badge layer across both states.
- [Text Area](../components/_index_text-area.md) — `font-klp-label`, `text-klp-text-medium`, `leading-[24px]` on label and placeholder layers across all variants.
- [Table (primitives)](../components/_index_table.md) — `font-klp-label`, `font-klp-label-bold`, `text-klp-text-medium` on head cell layer; `font-klp-body`, `text-klp-text-medium` on data cell layer; `text-klp-text-small` on caption layer.
- [Pagination](../components/_index_pagination.md) — `text-klp-text-small` on the range label.
- [Data Table](../components/_index_data-table.md) — sort icon and empty-state text consume `text-klp-fg-default` / `text-klp-fg-muted`; body typography inherited from Table primitives.
- [Item Side Bar](../components/_index_item-side-bar.md) — `--klp-font-size-text-medium`, `--klp-font-family-label`, `--klp-font-weight-label` on label layer across all variants.
- [Header Desktop](../components/_index_header-desktop.md) — `--klp-font-size-heading-h1`, `--klp-font-family-title`, `--klp-font-weight-title` on title layer across both feature variants.
- [Header Phone](../components/_index_header-phone.md) — `--klp-font-size-heading-h1`, `--klp-font-family-title`, `--klp-font-weight-title` on the title `h1` layer.
- [SideBar](../components/_index_sidebar.md) — `font-klp-label` on context-label and user-name layers; literal 14px (context-label) and 16px (user-name) font sizes.
- [Collapsible](../components/_index_collapsible.md) — `text-klp-text-large`, `font-klp-label`, `font-klp-label-bold` on title layer; `text-klp-text-medium`, `font-klp-label` on content-text layer across both state variants.

<!-- KLP:NOTES:BEGIN -->
## Notes
<!-- KLP:NOTES:END -->
