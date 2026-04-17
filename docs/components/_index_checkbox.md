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
  externals:
    - "@radix-ui/react-checkbox"
    - class-variance-authority
  tokenGroups:
    - colors
    - spacing
    - radius
  brands:
    - klub
usedBy: []
created: 2026-04-16
updated: 2026-04-16
---

# Checkbox

A toggle control that supports unchecked (Rest), hover, checked (Clicked), indeterminate (Mixed), and disabled states. Single variant axis: State.

## Anatomy

```
checkbox
├── root       (button)  — Radix Checkbox.Root; 24×24 box with padding and border radius
└── indicator  (span)    — Radix Checkbox.Indicator; wraps the icon vector; visible when checked or mixed
```

## Variants

Single axis: **State**. One variant per state value; no secondary axis.

| State | Screenshot |
|---|---|
| `rest` | [default-rest.png](../../.klp/figma-refs/checkbox/default-rest.png) |
| `hover` | [default-hover.png](../../.klp/figma-refs/checkbox/default-hover.png) |
| `clicked` (checked) | [default-clicked.png](../../.klp/figma-refs/checkbox/default-clicked.png) |
| `mixed` (indeterminate) | [default-mixed.png](../../.klp/figma-refs/checkbox/default-mixed.png) |
| `disable` | [default-disable.png](../../.klp/figma-refs/checkbox/default-disable.png) |

(source: spec.json:variantAxes, spec.json:variants)

## API

`CheckboxProps` extends `Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'asChild'>` and `VariantProps<typeof rootVariants>`. All native `<button>` HTML attributes are available except `asChild`. The Radix root passes `checked`, `onCheckedChange`, `disabled`, `required`, `name`, `value` automatically.

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean \| 'indeterminate'` | `undefined` | Controlled checked state. `'indeterminate'` renders the minus icon. |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | `undefined` | Callback fired when the checked state changes. |
| `disabled` | `boolean` | `false` | Disables the control and applies the disable visual state. |
| `required` | `boolean` | `false` | Marks the checkbox as required within a form. |
| `name` | `string` | `undefined` | Name of the field when used inside a form. |
| `value` | `string` | `'on'` | Value submitted with the form. |
| `className` | `string` | `undefined` | Additional class names applied to the root element. |

(source: src/components/checkbox/Checkbox.tsx:CheckboxProps)

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill (rest) | `--klp-bg-default` | `var(--klp-color-light-100)` |
| fill (hover) | `--klp-bg-brand-low` | `var(--klp-color-emerald-50)` |
| fill (clicked / checked) | `--klp-bg-brand` | `var(--klp-color-emerald-500)` |
| fill (mixed / indeterminate) | `--klp-bg-brand` | `var(--klp-color-emerald-500)` |
| fill (disable) | `--klp-bg-disable` | `var(--klp-color-gray-200)` |
| stroke (rest) | `--klp-border-default` | `var(--klp-color-gray-400)` |
| stroke (hover) | `--klp-border-brand` | `var(--klp-color-emerald-500)` |
| stroke (clicked / checked) | `--klp-border-brand` | `var(--klp-color-emerald-500)` |
| stroke (mixed / indeterminate) | `--klp-border-brand` | `var(--klp-color-emerald-500)` |
| stroke (disable) | `--klp-border-contrasted` | `var(--klp-color-gray-600)` |
| corner-radius | `--klp-radius-m` | `var(--klp-radius-base)` |
| padding (all sides) | `--klp-size-3xs` | `var(--klp-spacing-1)` |
| width | literal | `24px` |
| height | literal | `24px` |
| stroke-weight | literal | `1px` |

### `indicator` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color (clicked / checked) | `--klp-fg-on-emphasis` | `var(--klp-color-gray-100)` |
| color (mixed / indeterminate) | `--klp-fg-on-emphasis` | `var(--klp-color-gray-100)` |
| icon (checked) | literal | `check` (inline SVG 16×16) |
| icon (mixed) | literal | `minus` (inline SVG 16×16) |
| icon size | literal | `16px` |

(source: spec.json:variants, aliases.css:[data-brand="klub"])

## Examples

```tsx
import { useState } from 'react'
import { Checkbox } from './Checkbox'

/**
 * Checkbox usage example.
 *
 * The Checkbox component wraps Radix Checkbox.Root + Checkbox.Indicator.
 * Pass `checked` (boolean | 'indeterminate') and `onCheckedChange` to
 * control the state. Associate with a label via `aria-label` or `<label htmlFor>`.
 */
export function CheckboxExample() {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(false)

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Uncontrolled */}
      <div className="flex items-center gap-2">
        <Checkbox id="uncontrolled-demo" aria-label="Accept terms" />
        <label
          htmlFor="uncontrolled-demo"
          className="text-klp-text-medium font-klp-label text-klp-fg-default cursor-pointer select-none"
        >
          Accept terms (uncontrolled)
        </label>
      </div>

      {/* Controlled */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="controlled-demo"
          checked={checked}
          onCheckedChange={(value) => setChecked(value === true ? true : value === 'indeterminate' ? 'indeterminate' : false)}
        />
        <label
          htmlFor="controlled-demo"
          className="text-klp-text-medium font-klp-label text-klp-fg-default cursor-pointer select-none"
        >
          Controlled: {String(checked)}
        </label>
      </div>

      {/* Indeterminate */}
      <div className="flex items-center gap-2">
        <Checkbox id="mixed-demo" checked="indeterminate" aria-label="Indeterminate" />
        <label
          htmlFor="mixed-demo"
          className="text-klp-text-medium font-klp-label text-klp-fg-default cursor-pointer select-none"
        >
          Indeterminate (mixed)
        </label>
      </div>

      {/* Disabled */}
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-demo" disabled aria-label="Disabled checkbox" />
        <label
          htmlFor="disabled-demo"
          className="text-klp-text-medium font-klp-label text-klp-fg-disable cursor-not-allowed select-none"
        >
          Disabled
        </label>
      </div>
    </div>
  )
}
```

(source: src/components/checkbox/Checkbox.example.tsx)

## Accessibility

- **Role**: `checkbox`
- **Keyboard support**: `Space` — toggles the checked state
- **ARIA attributes**: `aria-checked` (`true | false | mixed`), `disabled`
- **ARIA notes**: Radix `Checkbox.Root` handles `role="checkbox"` and `aria-checked` automatically, including the `"mixed"` value for the indeterminate state. Associate with a visible label using `<label htmlFor="…">` or pass `aria-label` directly on the component.

(source: spec.json:a11y)

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-checkbox](https://www.npmjs.com/package/@radix-ui/react-checkbox) — Radix primitive providing `Checkbox.Root` and `Checkbox.Indicator` with full ARIA/keyboard support
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — variant class composition via `cva()`

### Token groups

- [Colors](../tokens/colors.md) — `--klp-bg-*`, `--klp-fg-*`, `--klp-border-*` tokens
- [Spacing](../tokens/spacing.md) — `--klp-size-3xs` padding token
- [Radius](../tokens/radius.md) — `--klp-radius-m` corner-radius token

### Brands

- [klub](../brands/klub.md) — Figma reference screenshots captured under the klub brand

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/checkbox/Checkbox.tsx`](../../src/components/checkbox/Checkbox.tsx)
- Example: [`src/components/checkbox/Checkbox.example.tsx`](../../src/components/checkbox/Checkbox.example.tsx)
- Playground: [`playground/routes/checkbox.tsx`](../../playground/routes/checkbox.tsx)
- Registry: [`registry/checkbox.json`](../../registry/checkbox.json)
- Figma spec: [`.klp/figma-refs/checkbox/spec.json`](../../.klp/figma-refs/checkbox/spec.json)
- Reference screenshots: [`.klp/figma-refs/checkbox/`](../../.klp/figma-refs/checkbox/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->

<!-- KLP:GAPS:BEGIN -->
## Gaps

No gaps recorded.
<!-- KLP:GAPS:END -->
