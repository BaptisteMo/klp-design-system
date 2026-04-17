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
  externals: [class-variance-authority, lucide-react]
  tokenGroups: [colors, typography]
  brands: [wireframe]
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# BreadCrumbs

Horizontal breadcrumb trail showing navigation hierarchy. A single axis (Steps) controls how many ancestor steps are shown before the current (active) step. The first step always shows a home icon. Intermediate steps use fg/muted with a chevron-right separator. The last (current) step uses fg/default with a chevron-down dropdown affordance.

## Anatomy

```
breadcrumbs
├── root           (nav)     — Horizontal flex container; gap 4px between step items; aria-label="Breadcrumb"
│   └── step-item  (button|a) — Individual breadcrumb step; paddingX=8px paddingY=4px cornerRadius=8px; renders as <a> when href provided
│       ├── step-icon      (span) — Home/store icon on first step only; 20×20 wrapper, 16×16 inner icon; aria-hidden
│       ├── step-label     (span) — Text label; fg/muted for ancestor steps, fg/default for current step
│       └── step-separator (span) — chevron-down inline after current step label (dropdown affordance); aria-hidden
└── step-separator (span)   — chevron-right rendered after each ancestor step-item (outside the button); aria-hidden
```

(source: spec.json:anatomy)

## Variants

Single variant axis: **steps** — the number of ancestor steps preceding the current (active) step. Steps 0 means only the current step is visible; steps 3 means three ancestors plus the current step.

| Steps value | Description | Reference screenshot |
|---|---|---|
| `0` | Single step: home icon + label + chevron-down. No ancestor steps. | [steps-0.png](../../.klp/figma-refs/breadcrumbs/steps-0.png) |
| `1` | Two steps: one ancestor (home icon + label + chevron-right, fg/muted) + one current (label + chevron-down, fg/default). | [steps-1.png](../../.klp/figma-refs/breadcrumbs/steps-1.png) |
| `2` | Three steps: two ancestors (fg/muted, chevron-right) + one current (fg/default, chevron-down). | [steps-2.png](../../.klp/figma-refs/breadcrumbs/steps-2.png) |
| `3` | Four steps: three ancestors (fg/muted, chevron-right) + one current (fg/default, chevron-down). Maximum depth shown in design. | [steps-3.png](../../.klp/figma-refs/breadcrumbs/steps-3.png) |

(source: spec.json:variantAxes, spec.json:variants)

## API

`BreadCrumbsProps` extends `React.HTMLAttributes<HTMLElement>`. All native `<nav>` HTML attributes pass through via spread.

**`BreadCrumbStep`** — shape of each entry in the `steps` array:

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Text label for this step. Required. |
| `href` | `string` | `undefined` | Optional URL. When provided, the step renders as `<a>`; otherwise as `<button>`. |
| `onClick` | `() => void` | `undefined` | Click handler for button-style steps. |

**`BreadCrumbsProps`**:

| Prop | Type | Default | Description |
|---|---|---|---|
| `steps` | `BreadCrumbStep[]` | — | Ordered list of steps from root to current. Required. |
| `showDropdownAffordance` | `boolean` | `true` | Whether the current (last) step shows a chevron-down dropdown affordance. |
| `stepsVariant` | `'0' \| '1' \| '2' \| '3'` | `undefined` | Override the steps variant key. Derived from `steps.length - 1` if omitted. |
| `className` | `string` | `undefined` | Additional classes applied to the `<nav>` root. |

(source: src/components/breadcrumbs/BreadCrumbs.tsx:BreadCrumbsProps)

## Tokens

### `step-icon` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| wrapperSize | literal: 20px | — |
| iconSize | literal: 16px | — |

> ❓ UNVERIFIED: `iconSize` (16px) and `wrapperSize` (20px) have no named `--klp-size-*` alias. A `--klp-size-icon-sm` and `--klp-size-icon-md` alias would be the correct fix. (source: spec.json:tokenGaps)

### `step-label` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color (ancestor) | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| color (current) | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| font-size | `--klp-font-size-text-medium` | `16px` |
| font-family | `--klp-font-family-body` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| font-weight | `--klp-font-weight-body` | `400` |

(source: spec.json:variants[0].layers.step-label, aliases.css:[data-brand="wireframe"])

### `step-separator` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| size | literal: 16px | — |
| icon (ancestor) | literal: chevron-right | — |
| icon (current) | literal: chevron-down | — |

(source: spec.json:variants[1].layers.step-separator)

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

(source: src/components/breadcrumbs/BreadCrumbs.example.tsx)

## Accessibility

- **Role**: `navigation` — the root element is a `<nav>` with `aria-label="Breadcrumb"`.
- **Keyboard support**: `Tab`, `Enter`, `Space` — each step is an interactive `<button>` or `<a>` element; standard keyboard navigation applies.
- **ARIA notes**: The current (last) step receives `aria-current="page"` and renders as a non-linking `<button>` by default. Ancestor steps render as `<a>` when `href` is provided. Icon spans carry `aria-hidden="true"`. For full screen-reader hierarchy, the component wraps steps in `<ol>/<li>` — use an ordered list for correct reading order.

(source: spec.json:a11y)

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — declared as `radixPrimitive` in spec; provides the `asChild`-style composition primitive referenced by this family.
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `cva` blocks for all five anatomy layers.
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `Store`, `ChevronRight`, `ChevronDown` icons.

### Token groups

- [Colors](../tokens/colors.md) — `--klp-fg-muted`, `--klp-fg-default`
- [Typography](../tokens/typography.md) — `--klp-font-size-text-medium`, `--klp-font-family-body`, `--klp-font-weight-body`

### Brands

- [wireframe](../brands/wireframe.md) — captureBrand; all reference screenshots captured under wireframe.

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/breadcrumbs/BreadCrumbs.tsx`](../../src/components/breadcrumbs/BreadCrumbs.tsx)
- Example: [`src/components/breadcrumbs/BreadCrumbs.example.tsx`](../../src/components/breadcrumbs/BreadCrumbs.example.tsx)
- Playground: [`playground/routes/breadcrumbs.tsx`](../../playground/routes/breadcrumbs.tsx)
- Registry: [`registry/breadcrumbs.json`](../../registry/breadcrumbs.json)
- Figma spec: [`.klp/figma-refs/breadcrumbs/spec.json`](../../.klp/figma-refs/breadcrumbs/spec.json)
- Reference screenshots: [`.klp/figma-refs/breadcrumbs/`](../../.klp/figma-refs/breadcrumbs/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
