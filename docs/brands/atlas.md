---
title: atlas
type: brand
brand: atlas
updated: 2026-04-16
---

# atlas

Night-blue primary, fuchsia secondary, **dense type scale** (~2px smaller across the board), **bolder labels** (700 vs 600). Designed for data-dense, informational interfaces.

## Identity

- **Primary font:** Inter (fallback: Roboto, system-ui)
- **Primary color:** `night-blue-700`
- **Secondary color:** `fuchsia-500`
- **Type scale:** dense — text-medium = 14px (vs 16 elsewhere), text-large = 16px (vs 18 elsewhere)
- **Label weight:** 700 (vs 600 elsewhere)
- **Inset / subtle backgrounds:** `night-blue-100` / `night-blue-50` (vs `gray-200` / `gray-100`)

## When to use

The Atlas product surface. Default working brand for new component extraction (per project memory) — most components capture their Figma references in this brand.

## Switch on

```html
<html data-brand="atlas">
```

```ts
document.documentElement.dataset.brand = 'atlas'
```

## Used by

- [Button](../components/_index_button.md) — captureBrand=atlas, references at `.klp/figma-refs/button/*.png`.

<!-- KLP:NOTES:BEGIN -->
## Notes
<!-- KLP:NOTES:END -->
