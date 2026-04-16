---
title: Color tokens
type: token-group
group: colors
updated: 2026-04-16
---

# Color tokens

Semantic color aliases switched by `[data-brand]`. **Components must consume aliases, never primitives.**

## Background (`--klp-bg-*`)

| Alias | wireframe | klub | atlas | showup |
|---|---|---|---|---|
| `bg-default` | `gray-100 / light-100` | `light-100` | `light-100` | `light-100` |
| `bg-disable` | `gray-200` | `gray-200` | `gray-200` | `gray-200` |
| `bg-inset` | `gray-200` | `gray-200` | `night-blue-100` | `night-blue-100` |
| `bg-subtle` | `gray-100` | `gray-100` | `night-blue-50` | `night-blue-50` |
| `bg-invisible` | `light-0` | `light-0` | `light-0` | `light-0` |
| `bg-brand` | `gray-500` | `emerald-500` | `night-blue-700` | `midnight-500` |
| `bg-brand-low` | `gray-300` | `emerald-50` | `night-blue-100` | `night-blue-100` |
| `bg-brand-contrasted` | `gray-600` | `emerald-700` | `night-blue-900` | `midnight-800` |
| `bg-secondary-brand` | `gray-500` | `cyan-500` | `fuchsia-500` | `gold-500` |
| `bg-secondary-brand-low` | `gray-300` | `cyan-50` | `fuchsia-300` | `gold-300` |
| `bg-secondary-brand-contrasted` | `gray-600` | `cyan-700` | `fuchsia-800` | `gold-700` |
| `bg-info` | `gray-300` | `blue-100` | `blue-100` | `blue-100` |
| `bg-info-contrasted` | `gray-500` | `blue-500` | `blue-500` | `blue-500` |
| `bg-success` | `gray-300` | `green-50` | `green-50` | `green-50` |
| `bg-success-emphasis` | `gray-500` | `green-500` | `green-500` | `green-500` |
| `bg-success-contrasted` | `gray-500` | `green-700` | `green-700` | `green-700` |
| `bg-warning` | `gray-300` | `orange-50` | `orange-50` | `orange-50` |
| `bg-warning-contrasted` | `gray-500` | `orange-500` | `orange-500` | `orange-500` |
| `bg-danger` | `gray-300` | `red-50` | `red-50` | `red-50` |
| `bg-danger-emphasis` | `gray-500` | `red-500` | `red-500` | `red-500` |
| `bg-danger-contrasted` | `gray-500` | `red-700` | `red-700` | `red-700` |
| `bg-decorative-orange` | `gray-400` | `orange-300` | `orange-400` | `orange-400` |

## Foreground (`--klp-fg-*`)

| Alias | wireframe | klub | atlas | showup |
|---|---|---|---|---|
| `fg-default` | `gray-800` | `gray-800` | `gray-800` | `midnight-800` |
| `fg-muted` | `gray-700` | `gray-700` | `gray-700` | `midnight-300` |
| `fg-subtle` | `gray-600` | `gray-600` | `gray-600` | `gray-600` |
| `fg-on-emphasis` | `gray-100` | `gray-100` | `gray-100` | `gray-100` |
| `fg-disable` | `gray-500` | `gray-600` | `gray-600` | `gray-600` |
| `fg-brand` | `gray-600` | `emerald-500` | `night-blue-700` | `midnight-500` |
| `fg-brand-contrasted` | `gray-800` | `emerald-700` | `night-blue-900` | `midnight-800` |
| `fg-secondary-brand` | `gray-600` | `cyan-500` | `fuchsia-500` | `gold-500` |
| `fg-secondary-brand-contrasted` | `gray-800` | `cyan-800` | `fuchsia-800` | `gold-800` |
| `fg-success` | `gray-600` | `green-500` | `green-500` | `green-500` |
| `fg-success-contrasted` | `gray-800` | `green-700` | `green-800` | `green-800` |
| `fg-danger` | `gray-600` | `red-500` | `red-500` | `red-500` |
| `fg-danger-contrasted` | `gray-800` | `red-700` | `red-800` | `red-800` |
| `fg-warning` | `gray-600` | `orange-500` | `orange-500` | `orange-500` |
| `fg-warning-contrasted` | `gray-800` | `orange-700` | `orange-800` | `orange-800` |
| `fg-info` | `gray-600` | `blue-500` | `blue-500` | `blue-500` |
| `fg-info-contrasted` | `gray-800` | `blue-700` | `blue-700` | `blue-700` |

## Border (`--klp-border-*`)

| Alias | wireframe | klub | atlas | showup |
|---|---|---|---|---|
| `border-default` | `gray-300` | `gray-400` | `gray-300` | `gray-300` |
| `border-muted` | `gray-200` | `gray-200` | `night-blue-300` | `midnight-100` |
| `border-light` | `light-100` | `light-100` | `light-100` | `light-100` |
| `border-contrasted` | `gray-600` | `gray-600` | `gray-600` | `gray-600` |
| `border-invisible` | `light-0` | `light-0` | `light-0` | `light-0` |
| `border-brand` | `gray-500` | `emerald-500` | `night-blue-700` | `midnight-500` |
| `border-brand-emphasis` | `gray-700` | `emerald-700` | `night-blue-800` | `midnight-800` |
| `border-brand-contrasted` | `gray-800` | `emerald-800` | `night-blue-900` | `midnight-900` |
| `border-secondary-brand` | `gray-500` | `cyan-500` | `fuchsia-500` | `gold-500` |
| `border-secondary-brand-emphasis` | `gray-700` | `cyan-700` | `fuchsia-700` | `gold-700` |
| `border-secondary-brand-contrasted` | `gray-800` | `cyan-800` | `fuchsia-800` | `gold-800` |
| `border-success` | `gray-300` | `green-300` | `green-300` | `green-300` |
| `border-success-emphasis` | `gray-500` | `green-500` | `green-500` | `green-500` |
| `border-success-contrasted` | `gray-700` | `green-700` | `green-700` | `green-700` |
| `border-danger` | `gray-300` | `red-200` | `red-300` | `red-300` |
| `border-danger-emphasis` | `gray-500` | `red-500` | `red-500` | `red-500` |
| `border-danger-contrasted` | `gray-700` | `red-700` | `red-700` | `red-700` |
| `border-warning` | `gray-300` | `orange-200` | `orange-300` | `orange-300` |
| `border-warning-emphasis` | `gray-500` | `orange-500` | `orange-500` | `orange-500` |
| `border-warning-contrasted` | `gray-700` | `orange-700` | `orange-700` | `orange-700` |
| `border-info` | `gray-300` | `blue-200` | `blue-200` | `blue-200` |
| `border-info-emphasis` | `gray-500` | `blue-500` | `blue-500` | `blue-500` |
| `border-info-contrasted` | `gray-700` | `blue-700` | `blue-700` | `blue-700` |

> Cell values reference primitives in `src/styles/tokens/primitives.css`. Each cell is `var(--klp-color-<value>)`.

## Tailwind utilities

| Token | Utility |
|---|---|
| `--klp-bg-*` | `bg-klp-bg-*` (e.g. `bg-klp-bg-brand`) |
| `--klp-fg-*` | `text-klp-fg-*` (e.g. `text-klp-fg-on-emphasis`) |
| `--klp-border-*` | `border-klp-border-*` (always paired with `border` for width) |

## Used by

- [Button](../components/_index_button.md) — consumes `bg`, `fg`, `border` tokens across all variants.
- [Checkbox](../components/_index_checkbox.md) — consumes `bg-default`, `bg-brand-low`, `bg-brand`, `bg-disable`, `border-default`, `border-brand`, `border-contrasted`, `fg-on-emphasis` tokens across all states.
- [Radio](../components/_index_radio.md) — consumes `bg-default`, `bg-brand-low`, `bg-brand`, `bg-disable`, `border-default`, `border-brand`, `border-contrasted` tokens across all four states.

<!-- KLP:NOTES:BEGIN -->
## Notes
<!-- KLP:NOTES:END -->
