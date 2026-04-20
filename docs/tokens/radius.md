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
- [List Content](../components/_index_list-content.md) — `rounded-klp-l` on root layer (via `--klp-size-xs` cornerRadius from spec) and `rounded-klp-l` on action-button layer.
- [Floating Alert](../components/_index_floating-alert.md) — `rounded-klp-l` on dismiss-button layer.
- [Tabulations](../components/_index_tabulations.md) — `radius-l` is the candidate token for root and cell-root `cornerRadius 8px` literals (currently CSS literals pending Figma re-linking; see tokenGaps in spec.json). `radius-m` is the candidate for cell-badge `cornerRadius 4px`.
- [Item Side Bar](../components/_index_item-side-bar.md) — `--klp-radius-m` on icon-container layer; `--klp-radius-l` on content panel (resolved from cross-file Figma variable, value 8px).
- [Header Desktop](../components/_index_header-desktop.md) — `--klp-radius-l` on action-button-tertiary, action-button-secondary, and search-input layers.
- [Header Phone](../components/_index_header-phone.md) — `--klp-radius-l` on menu-button, notification-btn, and search-button `cornerRadius` layers.
- [SideBar](../components/_index_sidebar.md) — `--klp-radius-l` on notification-button `cornerRadius` layer.

<!-- KLP:NOTES:BEGIN -->
## Notes
<!-- KLP:NOTES:END -->
