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
  components: ["tabulation-cells"]
  externals: ["@radix-ui/react-tabs", "class-variance-authority"]
  tokenGroups: ["colors", "spacing", "radius"]
  brands: ["klub"]
usedBy: []
created: 2026-04-17
updated: 2026-04-21
---

# Tabulations

A styled tab bar container built on Radix Tabs. Accepts a `tabs` array and renders `TabulationCell` instances separated by vertical dividers. Bridges Radix `data-state` to the TabulationCell `state` prop via a MutationObserver.

## Anatomy

```
TabsPrimitive.Root (root)
└── TabsPrimitive.List (list)  — bg-subtle border rounded-l p-[2px] gap-[4px]
    └── [for each tab, with divider between]:
        ├── divider (span)          — 24px h, 1px w; border-default; aria-hidden
        └── TabulationsCellBridge   — bridges Radix data-state → TabulationCell state prop
            └── TabulationCell      — styled Tabs.Trigger + optional Badge
└── children                   — TabulationsContent (Tabs.Content) panels
```

## Variants

| scrollType |
|---|
| none |

## Props usage

Extends `React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `tabs` | **required** | `Array<{value: string, label: React.ReactNode, badge?: number\|string}>` | — | Each tab item. `value` is the Radix identifier; `label` is the display text; `badge` is an optional count. |
| `scrollType` | optional | `'none'` | `"none"` | Reserved scroll behavior axis (currently only `none`) |

All other Radix Tabs.Root props pass through (e.g. `value`, `defaultValue`, `onValueChange`, `orientation`).

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

## Accessibility

- **Role**: `tablist` (Radix Tabs.List) / `tab` (each TabulationCell trigger) / `tabpanel` (TabulationsContent)
- **Keyboard support**: Arrow keys navigate between tabs. Tab key moves focus in/out. Content panels respond to selection.
- **ARIA notes**: `aria-selected`, `aria-controls`, `aria-labelledby` are all managed by Radix. Divider spans are `aria-hidden`.

## Dependencies

### klp components

- [Tabulation Cells](./_index_tabulation-cells.md) — TabulationsCellBridge wraps TabulationCell and bridges Radix data-state to the cva state prop.

### External libraries

- [@radix-ui/react-tabs](https://www.npmjs.com/package/@radix-ui/react-tabs) — Tabs.Root, Tabs.List, Tabs.Trigger, Tabs.Content
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Radius](../tokens/radius.md)

### Brands

- [klub](../brands/klub.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/tabulations/Tabulations.tsx`](../../src/components/tabulations/Tabulations.tsx)
- Example: [`src/components/tabulations/Tabulations.example.tsx`](../../src/components/tabulations/Tabulations.example.tsx)
- Playground: [`playground/routes/tabulations.tsx`](../../playground/routes/tabulations.tsx)
- Registry: [`registry/tabulations.json`](../../registry/tabulations.json)
- Figma spec: [`.klp/figma-refs/tabulations/spec.json`](../../.klp/figma-refs/tabulations/spec.json)
- Reference screenshots: [`.klp/figma-refs/tabulations/`](../../.klp/figma-refs/tabulations/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
