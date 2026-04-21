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
  components: ["badges"]
  externals: ["@radix-ui/react-tabs", "class-variance-authority"]
  tokenGroups: ["colors", "spacing", "radius", "typography"]
  brands: ["klub"]
usedBy: ["tabulations"]
created: 2026-04-17
updated: 2026-04-21
---

# Tabulation Cells

A single tab cell built on Radix Tabs.Trigger. Two states: rest (transparent background) and active (white background + shadow). Optionally displays a Badge count. Exports `TabulationCellsRoot`, `TabulationCellsList`, and `TabulationCellsContent` for direct Radix compound usage.

## Anatomy

```
TabsPrimitive.Trigger (root)  — inline-flex; state variant on bg + shadow
├── label (span)              — text; font-weight varies by state (normal → bold)
└── Badge (optional)          — badgeType: primary (active) or on-emphasis (rest)
```

## Variants

> The `state` column below documents visual appearances driven by CSS pseudo-classes
> (`:hover`, `:focus`, `:disabled`) or the Radix `data-state` attribute. It is NOT a
> runtime prop — the component derives it automatically.

| state |
|---|
| rest |
| active |

## Props usage

Extends `React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `children` | **required** | `React.ReactNode` | — | Label text rendered inside the tab cell |
| `badge` | optional | `number \| string` | — | Badge count to display alongside the label. Omit to hide the badge. |
| `state` | optional | `'rest' \| 'active'` | `"rest"` | Visual state — passed by the Tabulations bridge; do not set manually when using inside Tabulations. |

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

## Accessibility

- **Role**: `tab` (Radix Tabs.Trigger)
- **Keyboard support**: Arrow keys navigate between tabs. Tab key moves focus in/out of the tab list.
- **ARIA notes**: `aria-selected` and `aria-controls` are managed by Radix.

## Dependencies

### klp components

- [Badges](./_index_badges.md) — badge pill renders as `<Badge badgeType="primary|on-emphasis" badgeStyle="light" size="small">`.

### External libraries

- [@radix-ui/react-tabs](https://www.npmjs.com/package/@radix-ui/react-tabs) — Tabs.Root, Tabs.List, Tabs.Trigger, Tabs.Content
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Radius](../tokens/radius.md)
- [Typography](../tokens/typography.md)

### Brands

- [klub](../brands/klub.md)

## Used by

- [Tabulations](./_index_tabulations.md) — TabulationsCellBridge renders TabulationCell with Radix data-state bridged to the state prop.

## Files

- Source: [`src/components/tabulation-cells/TabulationCells.tsx`](../../src/components/tabulation-cells/TabulationCells.tsx)
- Example: [`src/components/tabulation-cells/TabulationCells.example.tsx`](../../src/components/tabulation-cells/TabulationCells.example.tsx)
- Playground: [`playground/routes/tabulation-cells.tsx`](../../playground/routes/tabulation-cells.tsx)
- Registry: [`registry/tabulation-cells.json`](../../registry/tabulation-cells.json)
- Figma spec: [`.klp/figma-refs/tabulation-cells/spec.json`](../../.klp/figma-refs/tabulation-cells/spec.json)
- Reference screenshots: [`.klp/figma-refs/tabulation-cells/`](../../.klp/figma-refs/tabulation-cells/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
