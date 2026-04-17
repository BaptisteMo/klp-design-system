---
title: Tabulations
type: component
status: stable
category: navigation
captureBrand: klub
radixPrimitive: "@radix-ui/react-tabs"
sources:
  - .klp/figma-refs/tabulations/spec.json
  - src/components/tabulations/Tabulations.tsx
dependencies:
  components: [tabulation-cells]
  externals: ["@radix-ui/react-tabs", "class-variance-authority"]
  tokenGroups: [colors, spacing, radius]
  brands: [klub]
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# Tabulations

Horizontal tab bar container that wraps a set of Tabulation_Cells instances separated by vertical line dividers. Scroll type=None (fixed layout). The bar handles the outer frame, inner padding, and divider chrome; individual cell selection state (active/rest) is delegated to the Tabulation_Cells sub-component.

## Anatomy

```
tabulations
├── root       (div)     — Horizontal flex container; hug both axes; holds cells and dividers; role=tablist
├── divider    (span)    — Vertical separator line between cells; aria-hidden
├── cell-root  (button)  — Individual tab trigger; paddingX 12px, paddingY 6px, cornerRadius 8px; active state adds bg/brand-low fill + drop-shadow
├── cell-label (span)    — Tab label text; bold weight in active state, regular in rest
└── cell-badge (span)    — Numeric count pill; bg/brand-low + fg/brand-contrasted when active; transparent + fg/muted when rest
```

(source: spec.json:anatomy)

## Variants

Single axis: **scroll-type**.

| scroll-type | Screenshot |
|---|---|
| `none` | [scroll-type-none-default.png](../../.klp/figma-refs/tabulations/scroll-type-none-default.png) |

(source: spec.json:variantAxes, spec.json:variants)

## API

`TabulationsProps` extends `React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>` (all Radix `Tabs.Root` props are forwarded, including `defaultValue`, `value`, `onValueChange`, `orientation`, etc.) plus `VariantProps<typeof rootVariants>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tabs` | `Array<{ value: string; label: ReactNode; badge?: number \| string }>` | — | Array of tab descriptors. Each entry produces one tab trigger inside the bar. `value` is the Radix selection identifier; `label` is the visible text; `badge` is the optional numeric count shown in the badge pill. |
| `scrollType` | `"none"` | `"none"` | Controls the scroll layout of the bar. Only `"none"` (fixed) is defined in the current spec. |
| `className` | `string` | `undefined` | Additional Tailwind classes merged via `cn()` onto the `Tabs.List` wrapper. |
| `children` | `ReactNode` | — | `TabulationsContent` (= `Tabs.Content`) panels rendered below the tab list. |

**Re-exported part** for rendering tab panel content:

| Export | Radix part | Usage |
|---|---|---|
| `TabulationsContent` | `Tabs.Content` | Panel revealed when the matching tab is active; `value` must match the tab entry's `value`. |

(source: src/components/tabulations/Tabulations.tsx:46–60)

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-subtle` | `var(--klp-color-gray-100)` |
| stroke | `--klp-border-default` | `var(--klp-color-gray-400)` |
| cornerRadius | literal: `8px` | — |
| paddingAll | literal: `2px` | — |
| itemSpacing | literal: `4px` | — |

> ❓ UNVERIFIED: `tokenGaps` in spec.json flags `cornerRadius 8px`, `paddingAll 2px`, and `itemSpacing 4px` as candidates for `--klp-radius-l`, `--klp-size-4xs`, and `--klp-size-3xs` respectively. These Figma variables cross-reference a published library; current implementation uses CSS literals pending re-linking to local alias variables.

(source: spec.json:variants[0].layers.root, spec.json:tokenGaps)

### `divider` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| stroke | `--klp-border-default` | `var(--klp-color-gray-400)` |
| strokeWeight | literal: `1px` | — |
| length | literal: `24px` | — |

(source: spec.json:variants[0].layers.divider)

### `cell-root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill (rest) | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| fill (active) | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| cornerRadius | literal: `8px` | — |
| paddingLeft/Right | literal: `12px` | — |
| paddingTop/Bottom | literal: `6px` | — |
| itemSpacing | literal: `8px` | — |
| dropShadow (active) | literal: `0 1px 1px rgba(0,0,0,0.15)` | — |

> Note: The active cell fill (`bg/brand-low`) is supplied by the `TabulationCell` sub-component; the `Tabulations` container does not override it. (source: spec.json:variants[0].layers.cell-root note)

(source: spec.json:variants[0].layers.cell-root, spec.json:tokenGaps)

### `cell-label` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| font-size | `--klp-font-size-text-medium` | `16px` |
| font-family | `--klp-font-family-label` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| font-weight (active) | `--klp-font-weight-label-bold` | `600` |
| font-weight (rest) | `--klp-font-weight-label` | `400` |

(source: spec.json:variants[0].layers.cell-label)

### `cell-badge` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill (active) | `--klp-bg-brand-low` | `var(--klp-color-emerald-50)` |
| fill (rest) | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| color (active) | `--klp-fg-brand-contrasted` | `var(--klp-color-emerald-700)` |
| color (rest) | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| font-size | `--klp-font-size-text-small` | `14px` |
| font-family | `--klp-font-family-body` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| font-weight | `--klp-font-weight-body` | `400` |
| paddingX | `--klp-size-xs` | `var(--klp-spacing-2)` |
| paddingY | `--klp-size-2xs` | `var(--klp-spacing-1-5)` |
| cornerRadius | literal: `4px` | — |

(source: spec.json:variants[0].layers.cell-badge)

## Examples

```tsx
import { Tabulations, TabulationsContent } from '@/components/tabulations'

export function TabulationsExample() {
  return (
    <Tabulations
      defaultValue="home"
      tabs={[
        { value: 'home',     label: 'Home',     badge: 3 },
        { value: 'offers',   label: 'Offers',   badge: 12 },
        { value: 'account',  label: 'Account' },
      ]}
    >
      <TabulationsContent value="home">
        <p className="mt-4 text-klp-fg-default">Home content</p>
      </TabulationsContent>
      <TabulationsContent value="offers">
        <p className="mt-4 text-klp-fg-default">Offers content</p>
      </TabulationsContent>
      <TabulationsContent value="account">
        <p className="mt-4 text-klp-fg-default">Account content</p>
      </TabulationsContent>
    </Tabulations>
  )
}
```

(source: src/components/tabulations/Tabulations.example.tsx)

## Accessibility

- **Role**: `tablist` (source: spec.json:a11y.role)
- **Keyboard support**: `ArrowLeft`, `ArrowRight`, `Home`, `End`, `Enter`, `Space` (source: spec.json:a11y.keyboardSupport)
- **ARIA notes**: Root renders as `role=tablist`. Each cell trigger renders as `role=tab` with `aria-selected=true` when active. Radix `Tabs.List` + `Tabs.Trigger` handle all ARIA roles, selection state, and keyboard navigation automatically. (source: spec.json:a11y.notes)

## Dependencies

### klp components

- [Tabulation Cells](./_index_tabulation-cells.md) — `TabulationCell` and `TabulationCellsContent` imported from `@/components/tabulation-cells`. The `TabulationsCellBridge` internal wrapper observes Radix `data-state` mutations and maps them to the `state` prop expected by `TabulationCell`.

### External libraries

- [@radix-ui/react-tabs](https://www.npmjs.com/package/@radix-ui/react-tabs) — Radix Tabs primitive providing `Root`, `List`, `Trigger`, and `Content` parts with full a11y and keyboard navigation.
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — Variant-based class composition for `rootVariants` and `dividerVariants`.

### Token groups

- [Colors](../tokens/colors.md) — `bg-subtle`, `bg-invisible`, `bg-brand-low`, `border-default`, `border-invisible`, `fg-default`, `fg-muted`, `fg-brand-contrasted` tokens consumed across root, divider, cell-root, cell-label, and cell-badge layers.
- [Spacing](../tokens/spacing.md) — `size-xs` and `size-2xs` for cell-badge padding.
- [Radius](../tokens/radius.md) — `radius-l` candidate for root and cell-root cornerRadius (currently CSS literals; see tokenGaps note above).

### Brands

- [klub](../brands/klub.md) — captureBrand; all reference screenshots captured under this brand.

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/tabulations/Tabulations.tsx`](../../src/components/tabulations/Tabulations.tsx)
- Example: [`src/components/tabulations/Tabulations.example.tsx`](../../src/components/tabulations/Tabulations.example.tsx)
- Playground: [`playground/routes/tabulations.tsx`](../../playground/routes/tabulations.tsx)
- Registry: [`registry/tabulations.json`](../../registry/tabulations.json)
- Figma spec: [`.klp/figma-refs/tabulations/spec.json`](../../.klp/figma-refs/tabulations/spec.json)
- Reference screenshots: [`.klp/figma-refs/tabulations/`](../../.klp/figma-refs/tabulations/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->

<!-- KLP:GAPS:BEGIN -->
## Gaps

No gaps recorded.
<!-- KLP:GAPS:END -->
