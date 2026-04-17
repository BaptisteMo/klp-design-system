---
title: Tabulation Cells
type: component
status: stable
category: navigation
captureBrand: klub
radixPrimitive: "@radix-ui/react-tabs"
sources:
  - .klp/figma-refs/tabulation-cells/spec.json
  - src/components/tabulation-cells/TabulationCells.tsx
dependencies:
  components: [badges]
  externals: ["@radix-ui/react-tabs", "class-variance-authority"]
  tokenGroups: ["colors", "spacing", "typography"]
  brands: ["klub"]
usedBy: [tabulations]
created: 2026-04-17
updated: 2026-04-17
---

# Tabulation Cells

A single tab cell used within a tabulation bar. Renders a label and an optional badge count. State=Rest shows a neutral transparent background; State=Active shows the selected tab with brand-low fill, bold label, and brand-accented badge.

## Anatomy

```
tabulation-cell (root)
├── label  (span)  — Tab text; font-weight regular in Rest, bold in Active
└── badge  (span)  — Numeric count pill; always rendered when badge prop is provided; bg/invisible + fg/muted at rest, bg/brand-low + fg/brand-contrasted when active
```

(source: spec.json:anatomy)

## Variants

Single axis: **State**.

| State | Screenshot |
|---|---|
| `rest` | [rest-default.png](../../.klp/figma-refs/tabulation-cells/rest-default.png) |
| `active` | [active-default.png](../../.klp/figma-refs/tabulation-cells/active-default.png) |

(source: spec.json:variantAxes, spec.json:variants)

## API

`TabulationCellProps` extends `React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>` (all Radix `Tabs.Trigger` props are forwarded). The `value` prop (required by Radix) identifies the panel this tab controls.

| Prop | Type | Default | Description |
|---|---|---|---|
| `state` | `"rest" \| "active"` | `"rest"` | Visual state of the tab cell. Drives root fill, label weight, and badge colors. |
| `badge` | `number \| string` | `undefined` | Badge count to display alongside the label. Omit or pass `undefined` to hide the badge entirely. |
| `className` | `string` | `undefined` | Additional Tailwind classes merged via `cn()`. |
| `children` | `ReactNode` | — | Tab label text. |

**Re-exported Radix compound parts** (for assembling a full tabulation bar):

| Export | Radix part | Usage |
|---|---|---|
| `TabulationCellsRoot` | `Tabs.Root` | Wraps the entire tab widget; `defaultValue` or `value` sets selected tab. |
| `TabulationCellsList` | `Tabs.List` | Horizontal container for tab cells; sets `role="tablist"`. |
| `TabulationCellsContent` | `Tabs.Content` | Panel revealed when the matching tab is active; `value` must match the trigger's `value`. |

(source: src/components/tabulation-cells/TabulationCells.tsx:61–113)

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill (rest) | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| fill (active) | `--klp-bg-brand-low` | `var(--klp-color-emerald-50)` |
| cornerRadius | literal: `8px` | — |
| paddingLeft/Right | literal: `12px` | — |
| paddingTop/Bottom | literal: `6px` | — |
| itemSpacing | literal: `8px` | — |

> ❓ UNVERIFIED: `tokenGaps` in spec.json flags four layout literals (`cornerRadius 8px`, `paddingLeft/Right 12px`, `paddingTop/Bottom 6px`, `itemSpacing 8px`) as candidates for `--klp-radius-m`, `--klp-size-s`, `--klp-size-2xs`, `--klp-size-xs` respectively. These are currently implemented as CSS literals pending a Figma token assignment.

(source: spec.json:variants[0].layers.root, spec.json:variants[1].layers.root, spec.json:tokenGaps)

### `label` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| font-size | `--klp-font-size-text-medium` | `16px` |
| font-family | `--klp-font-family-label` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| font-weight (rest) | `--klp-font-weight-label` | `400` |
| font-weight (active) | `--klp-font-weight-label-bold` | `600` |

(source: spec.json:variants[0].layers.label, spec.json:variants[1].layers.label)

### `badge` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill (rest) | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| fill (active) | `--klp-bg-brand-low` | `var(--klp-color-emerald-50)` |
| stroke (both) | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| color (rest) | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| color (active) | `--klp-fg-brand-contrasted` | `var(--klp-color-emerald-700)` |
| font-size | `--klp-font-size-text-small` | `14px` |
| font-family | `--klp-font-family-body` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| font-weight | `--klp-font-weight-body` | `400` |
| paddingX | `--klp-size-xs` | `var(--klp-spacing-2)` |
| paddingY | `--klp-size-2xs` | `var(--klp-spacing-1-5)` |
| cornerRadius | literal: `4px` | — |

(source: spec.json:variants[0].layers.badge, spec.json:variants[1].layers.badge)

## Examples

```tsx
import {
  TabulationCell,
  TabulationCellsRoot,
  TabulationCellsList,
  TabulationCellsContent,
} from './TabulationCells'

export function TabulationCellsExample() {
  return (
    <TabulationCellsRoot defaultValue="tab1">
      <TabulationCellsList className="flex gap-1 rounded-klp-m bg-klp-bg-subtle p-1">
        <TabulationCell value="tab1" badge={3}>
          Label
        </TabulationCell>
        <TabulationCell value="tab2" badge={12}>
          Label
        </TabulationCell>
        <TabulationCell value="tab3">
          Label
        </TabulationCell>
      </TabulationCellsList>
      <TabulationCellsContent value="tab1">
        <p className="text-klp-fg-default text-klp-text-medium mt-4">Content for tab 1</p>
      </TabulationCellsContent>
      <TabulationCellsContent value="tab2">
        <p className="text-klp-fg-default text-klp-text-medium mt-4">Content for tab 2</p>
      </TabulationCellsContent>
      <TabulationCellsContent value="tab3">
        <p className="text-klp-fg-default text-klp-text-medium mt-4">Content for tab 3</p>
      </TabulationCellsContent>
    </TabulationCellsRoot>
  )
}
```

(source: src/components/tabulation-cells/TabulationCells.example.tsx)

## Accessibility

- **Role**: `tab` (source: spec.json:a11y.role)
- **Keyboard support**: `Enter`, `Space`, `ArrowLeft`, `ArrowRight` (source: spec.json:a11y.keyboardSupport)
- **ARIA notes**: Must be wrapped in a `TabulationCellsList` (`role="tablist"`). `aria-selected="true"` is set automatically when the tab is active. Radix `Tabs.Trigger` handles all ARIA attributes and keyboard navigation. (source: spec.json:a11y.notes)

## Dependencies

### klp components

- [Badge](./_index_badges.md) — `Badge` is rendered as the optional numeric count pill alongside the tab label (the `badge` prop maps directly to a `<Badge>` instance).

### External libraries

- [@radix-ui/react-tabs](https://www.npmjs.com/package/@radix-ui/react-tabs) — Radix Tabs primitive providing `Root`, `List`, `Trigger`, and `Content` parts with full a11y and keyboard support.
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — Variant-based class composition for `rootVariants`, `labelVariants`, and `badgeVariants`.

### Token groups

- [Colors](../tokens/colors.md) — `bg-*`, `fg-*`, `border-*` tokens for root fill, label color, and badge fill/stroke/color.
- [Spacing](../tokens/spacing.md) — `size-xs` and `size-2xs` for badge padding.
- [Typography](../tokens/typography.md) — `font-family-*`, `font-weight-*`, `font-size-*` for label and badge text.

### Brands

- [klub](../brands/klub.md) — captureBrand; reference screenshots captured under this brand.

## Used by

- [Tabulations](./_index_tabulations.md) — `TabulationCell` and `TabulationCellsContent` are imported and composed inside the `Tabulations` component as the cell and panel primitives.

## Files

- Source: [`src/components/tabulation-cells/TabulationCells.tsx`](../../src/components/tabulation-cells/TabulationCells.tsx)
- Example: [`src/components/tabulation-cells/TabulationCells.example.tsx`](../../src/components/tabulation-cells/TabulationCells.example.tsx)
- Playground: [`playground/routes/tabulation-cells.tsx`](../../playground/routes/tabulation-cells.tsx)
- Registry: [`registry/tabulation-cells.json`](../../registry/tabulation-cells.json)
- Figma spec: [`.klp/figma-refs/tabulation-cells/spec.json`](../../.klp/figma-refs/tabulation-cells/spec.json)
- Reference screenshots: [`.klp/figma-refs/tabulation-cells/`](../../.klp/figma-refs/tabulation-cells/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->

<!-- KLP:GAPS:BEGIN -->
## Gaps

No gaps recorded.
<!-- KLP:GAPS:END -->
