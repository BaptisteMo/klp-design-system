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

<!-- KLP:NOTES:BEGIN -->
## Notes
<!-- KLP:NOTES:END -->
