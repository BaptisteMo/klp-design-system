---
title: Radius tokens
type: token-group
group: radius
updated: 2026-04-16
---

# Radius tokens

`--klp-radius-*` aliases. Identical across all 4 brands.

| Alias | Primitive | Resolved |
|---|---|---|
| `--klp-radius-m` | `--klp-radius-base` | 8px |
| `--klp-radius-l` | `--klp-radius-lg` | 12px |
| `--klp-radius-xl` | `--klp-radius-2xl` | 16px |
| `--klp-size-square` | `--klp-radius-none` | 0 |
| `--klp-size-round` | `--klp-radius-full` | 9999px |

> The `--klp-size-square` and `--klp-size-round` aliases sit in the spacing layer of `aliases.css` for historical reasons but are conceptually radius values.

## Tailwind utilities

| Property | Utility | Example |
|---|---|---|
| Border radius | `rounded-klp-*` | `rounded-klp-l` |

## Used by

- [Button](../components/_index_button.md) — `rounded-klp-l` on root layer.
- [Checkbox](../components/_index_checkbox.md) — `rounded-klp-m` on root layer.
- [Tooltip](../components/_index_tooltip.md) — `rounded-klp-m` on root layer.
- [Input](../components/_index_input.md) — `rounded-klp-l` on input-box layer across all 18 variants.

<!-- KLP:NOTES:BEGIN -->
## Notes
<!-- KLP:NOTES:END -->
