---
title: Radio
type: component
status: stable
category: inputs
captureBrand: klub
radixPrimitive: "@radix-ui/react-radio-group"
sources:
  - .klp/figma-refs/radio/spec.json
  - src/components/radio/Radio.tsx
dependencies:
  components: []
  externals: ["@radix-ui/react-radio-group", "class-variance-authority"]
  tokenGroups: ["colors", "spacing", "radius"]
  brands: ["klub"]
usedBy: []
created: 2026-04-20
updated: 2026-04-21
---

# Radio

A radio button group built on Radix RadioGroup. States (rest, hover, checked, disabled) are driven by Radix `data-state` / `data-disabled` attributes — not a `state` prop.

> **Class B note:** This component has no `state` prop. Visual states (`rest`, `hover`, `checked`, `disable`) are driven entirely by Radix `data-state="checked|unchecked"` and `data-disabled` attribute selectors in the cva classes. Do not attempt to control visual state programmatically — use `value` / `defaultValue` on `RadioGroup` instead.

## Anatomy

```
RadioGroup (root)       — Radix RadioGroup.Root; flex-col gap-xs
└── RadioItem[*]        — Radix RadioGroup.Item; 24×24px circle
    └── RadioIndicator  — Radix RadioGroup.Indicator (forceMount); inner dot
```

## Variants

| state |
|---|
| rest (unchecked, no hover) |
| hover (unchecked + hovered) |
| checked |
| disabled |

## Props usage

### RadioGroup

Extends `React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `className` | optional | `string` | — | Additional className for the group root |

All other Radix RadioGroup.Root props pass through (e.g. `value`, `defaultValue`, `onValueChange`, `disabled`, `orientation`).

### RadioItem

Extends `React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `className` | optional | `string` | — | Additional className for the item |

All other Radix RadioGroup.Item props pass through (e.g. `value`, `id`, `disabled`).

## Examples

```tsx
import { RadioGroup, RadioItem } from './Radio'

export function RadioExample() {
  return (
    <RadioGroup defaultValue="option-1" aria-label="Example radio group">
      <div className="flex items-center gap-klp-size-xs">
        <RadioItem value="option-1" id="option-1" />
        <label htmlFor="option-1" className="font-klp-label text-klp-fg-default cursor-pointer">
          Option 1
        </label>
      </div>
      <div className="flex items-center gap-klp-size-xs">
        <RadioItem value="option-2" id="option-2" />
        <label htmlFor="option-2" className="font-klp-label text-klp-fg-default cursor-pointer">
          Option 2
        </label>
      </div>
      <div className="flex items-center gap-klp-size-xs">
        <RadioItem value="option-3" id="option-3" disabled />
        <label htmlFor="option-3" className="font-klp-label text-klp-fg-disable cursor-not-allowed">
          Option 3 (disabled)
        </label>
      </div>
    </RadioGroup>
  )
}
```

## Accessibility

- **Role**: `radiogroup` (RadioGroup root) / `radio` (each RadioItem)
- **Keyboard support**: Arrow keys cycle within the group. Tab moves to/from the group.
- **ARIA notes**: `aria-checked` is managed by Radix. Always pair with a visible `<label>` linked via `htmlFor` / `id`.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-radio-group](https://www.npmjs.com/package/@radix-ui/react-radio-group) — RadioGroup.Root, RadioGroup.Item, RadioGroup.Indicator
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

- Source: [`src/components/radio/Radio.tsx`](../../src/components/radio/Radio.tsx)
- Example: [`src/components/radio/Radio.example.tsx`](../../src/components/radio/Radio.example.tsx)
- Playground: [`playground/routes/radio.tsx`](../../playground/routes/radio.tsx)
- Registry: [`registry/radio.json`](../../registry/radio.json)
- Figma spec: [`.klp/figma-refs/radio/spec.json`](../../.klp/figma-refs/radio/spec.json)
- Reference screenshots: [`.klp/figma-refs/radio/`](../../.klp/figma-refs/radio/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
