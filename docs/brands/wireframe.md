---
title: wireframe
type: brand
brand: wireframe
updated: 2026-04-16
---

# wireframe

The default brand. Pure grayscale palette — every chromatic alias resolves to a `--klp-color-gray-*` shade. Designed as a neutral baseline for early prototyping and as a fallback when no `[data-brand]` is set on the document root.

## Identity

- **Primary font:** Inter (fallback: Test Calibre, system-ui)
- **Primary color:** `gray-500` (mid-gray)
- **Secondary color:** `gray-500` (no chromatic distinction in this brand)
- **Type scale:** standard (16/14/12 for text-medium/small/smaller)
- **Label weight:** 600

## When to use

- Early prototyping of a new component before brand decisions are made
- Verifying that a component is brand-agnostic and reads well without color
- Default state when no brand has been selected (CMS, admin tools, neutral previews)

## Switch on

```html
<html data-brand="wireframe">
```

```ts
document.documentElement.dataset.brand = 'wireframe'
```

## Used by

- [Switch](../components/_index_switch.md) — reference screenshots captured under the wireframe brand.

<!-- KLP:NOTES:BEGIN -->
## Notes
<!-- KLP:NOTES:END -->
