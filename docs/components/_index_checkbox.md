---
title: Checkbox
type: component
status: stable
category: inputs
captureBrand: klub
radixPrimitive: "@radix-ui/react-checkbox"
sources:
  - .klp/figma-refs/checkbox/spec.json
  - src/components/checkbox/Checkbox.tsx
dependencies:
  components: []
  externals: ["@radix-ui/react-checkbox", "class-variance-authority"]
  tokenGroups: ["colors", "spacing", "radius"]
  brands: ["klub"]
usedBy:
  - action-sheet-menu
created: 2026-04-17
updated: 2026-04-21
---

# Checkbox

A toggle control that supports unchecked (Rest), hover, checked (Clicked), indeterminate (Mixed), and disabled states. Single variant axis: State.

## Anatomy

```
button (root) — Radix CheckboxPrimitive.Root
└── indicator (span) — Radix CheckboxPrimitive.Indicator
    └── Check or Minus icon (16×16px)
```

## Variants

State is expressed via Radix data-* attribute selectors on the root element:

| state | data-state | notes |
|---|---|---|
| rest | `unchecked` | Default appearance |
| hover | `unchecked` + `:hover` | Via CSS hover pseudo-class |
| clicked | `checked` | Filled brand background |
| mixed | `indeterminate` | Filled brand background + Minus icon |
| disable | `[data-disabled]` | Muted background |

> Note: `state` is not a prop — it is driven by Radix's `checked` and `disabled` props plus CSS pseudo-classes. This is a **Class B** situation: a cva state axis without a `state` prop.

## Props usage

Extends `Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'asChild'>` and `VariantProps<typeof rootVariants>`. All Radix Checkbox.Root props (including `checked`, `onCheckedChange`, `disabled`, `required`) are forwarded.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `className` | optional | `string` | — | Additional class names for the root element |

## Examples

```tsx
import { useState } from 'react'
import { Checkbox } from './Checkbox'

export function CheckboxExample() {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(false)
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Checkbox id="uncontrolled-demo" aria-label="Accept terms" />
        <label htmlFor="uncontrolled-demo" className="text-klp-text-medium font-klp-label text-klp-fg-default cursor-pointer select-none">
          Accept terms (uncontrolled)
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="controlled-demo" checked={checked} onCheckedChange={setChecked} />
        <label htmlFor="controlled-demo" className="text-klp-text-medium font-klp-label text-klp-fg-default cursor-pointer select-none">
          Controlled ({String(checked)})
        </label>
      </div>
    </div>
  )
}
```

## Accessibility

- **Role**: `checkbox` (Radix primitive)
- **Keyboard support**: `Space` toggles; `Tab` focuses.
- **ARIA notes**: `aria-checked` is set to `"mixed"` when `checked="indeterminate"`. Associate with a visible label via `aria-label` or `<label htmlFor>`.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-checkbox](https://www.npmjs.com/package/@radix-ui/react-checkbox) — Radix Checkbox primitive
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Radius](../tokens/radius.md)

### Brands

- [klub](../brands/klub.md)

## Used by

- [ActionSheet Menu](./_index_action-sheet-menu.md)

## Files

- Source: [`src/components/checkbox/Checkbox.tsx`](../../src/components/checkbox/Checkbox.tsx)
- Example: [`src/components/checkbox/Checkbox.example.tsx`](../../src/components/checkbox/Checkbox.example.tsx)
- Playground: [`playground/routes/checkbox.tsx`](../../playground/routes/checkbox.tsx)
- Registry: [`registry/checkbox.json`](../../registry/checkbox.json)
- Figma spec: [`.klp/figma-refs/checkbox/spec.json`](../../.klp/figma-refs/checkbox/spec.json)
- Reference screenshots: [`.klp/figma-refs/checkbox/`](../../.klp/figma-refs/checkbox/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
