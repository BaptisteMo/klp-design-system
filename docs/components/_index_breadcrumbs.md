---
title: BreadCrumbs
type: component
status: stable
category: navigation
captureBrand: wireframe
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/breadcrumbs/spec.json
  - src/components/breadcrumbs/BreadCrumbs.tsx
dependencies:
  components: []
  externals: ["class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "typography"]
  brands: ["wireframe"]
usedBy:
  - header-desktop
  - header-phone
created: 2026-04-17
updated: 2026-04-21
---

# BreadCrumbs

Horizontal breadcrumb trail showing navigation hierarchy. A single axis (Steps) controls how many ancestor steps are shown before the current (active) step. The first step always shows a home icon. Intermediate steps use fg/muted with a chevron-right separator. The last (current) step uses fg/default with a chevron-down dropdown affordance.

## Anatomy

```
nav (root)
└── ol (list)
    └── li (step-item, repeated per steps[])
        ├── step-icon     (span) — Home/store icon on the first step only
        ├── step-label    (span) — Text label
        ├── step-separator (span) — chevron-down on current; chevron-right on ancestors
```

## Variants

| steps |
|---|
| 0 |
| 1 |
| 2 |
| 3 |

The `steps` variant is derived from `steps.length - 1` when `stepsVariant` is omitted.

## Props usage

Extends `React.HTMLAttributes<HTMLElement>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `steps` | **required** | `BreadCrumbStep[]` | — | Ordered list of steps from root to current |
| `showDropdownAffordance` | optional | `boolean` | `true` | Whether the current (last) step shows a chevron-down dropdown affordance |
| `stepsVariant` | optional | `'0' \| '1' \| '2' \| '3'` | derived | Override the steps variant key (derived from steps.length - 1 if omitted) |

## Examples

```tsx
import { BreadCrumbs } from './BreadCrumbs'

export function BreadCrumbsExample() {
  return (
    <BreadCrumbs
      steps={[
        { label: 'Home', href: '/' },
        { label: 'Category', href: '/category' },
        { label: 'Current Page' },
      ]}
    />
  )
}
```

## Accessibility

- **Role**: `navigation` with `aria-label="Breadcrumb"`
- **Keyboard support**: Each step renders as `<a>` (when `href` is provided) or `<button>` — standard keyboard navigation applies.
- **ARIA notes**: The current (last) step carries `aria-current="page"`.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — Store, ChevronRight, ChevronDown icons

### Token groups

- [Colors](../tokens/colors.md)
- [Typography](../tokens/typography.md)

### Brands

- [wireframe](../brands/wireframe.md)

## Used by

- [Header Desktop](./_index_header-desktop.md)
- [Header Phone](./_index_header-phone.md)

## Files

- Source: [`src/components/breadcrumbs/BreadCrumbs.tsx`](../../src/components/breadcrumbs/BreadCrumbs.tsx)
- Example: [`src/components/breadcrumbs/BreadCrumbs.example.tsx`](../../src/components/breadcrumbs/BreadCrumbs.example.tsx)
- Playground: [`playground/routes/breadcrumbs.tsx`](../../playground/routes/breadcrumbs.tsx)
- Registry: [`registry/breadcrumbs.json`](../../registry/breadcrumbs.json)
- Figma spec: [`.klp/figma-refs/breadcrumbs/spec.json`](../../.klp/figma-refs/breadcrumbs/spec.json)
- Reference screenshots: [`.klp/figma-refs/breadcrumbs/`](../../.klp/figma-refs/breadcrumbs/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
