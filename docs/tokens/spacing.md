---
title: Spacing tokens
type: token-group
group: spacing
updated: 2026-04-16
---

# Spacing tokens

`--klp-size-*` aliases. Identical across all 4 brands (no per-brand spacing override).

| Alias | Primitive | Resolved |
|---|---|---|
| `--klp-size-4xs` | `--klp-spacing-0-5` | 2px |
| `--klp-size-3xs` | `--klp-spacing-1` | 4px |
| `--klp-size-2xs` | `--klp-spacing-1-5` | 6px |
| `--klp-size-xs` | `--klp-spacing-2` | 8px |
| `--klp-size-s` | `--klp-spacing-3` | 12px |
| `--klp-size-m` | `--klp-spacing-4` | 16px |
| `--klp-size-l` | `--klp-spacing-6` | 24px |
| `--klp-size-xl` | `--klp-spacing-8` | 32px |
| `--klp-size-2xl` | `--klp-spacing-12` | 48px |
| `--klp-size-3xl` | `--klp-spacing-16` | 64px |

> ⚠️ Atlas overrides `--klp-default-text` to `--klp-spacing-4` (16px) instead of `--klp-spacing-3-5` (14px) used by other brands. This token is consumed implicitly via the default Tailwind text size — components don't reference it directly.

## Tailwind utilities

| Property | Utility | Example |
|---|---|---|
| Padding | `p-klp-size-*` `px-klp-size-*` `py-klp-size-*` | `px-klp-size-m` |
| Margin | `m-klp-size-*` `mx-klp-size-*` `my-klp-size-*` | `mt-klp-size-l` |
| Gap | `gap-klp-size-*` | `gap-klp-size-2xs` |
| Width | `w-klp-size-*` | `w-klp-size-xl` |
| Height | `h-klp-size-*` | `h-klp-size-m` |

## Used by

- [Button](../components/_index_button.md) — `px-klp-size-{s,m,l}`, `py-klp-size-{2xs,xs,s}`, `gap-klp-size-2xs`, `p-klp-size-xs` (icon size).
- [Checkbox](../components/_index_checkbox.md) — `p-klp-size-3xs` (4px padding on all sides of root).
- [Radio](../components/_index_radio.md) — `p-klp-size-3xs` (unchecked states), `p-klp-size-2xs` (checked state), `size-round` (full corner radius), `gap-klp-size-xs` (RadioGroup column gap).

<!-- KLP:NOTES:BEGIN -->
## Notes
<!-- KLP:NOTES:END -->
