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
  tokenGroups: ["colors", "spacing"]
  brands: ["klub"]
usedBy: []
created: 2026-04-16
updated: 2026-04-16
---

# Radio

Radio button control with four interaction states: rest (unchecked default), hover (unchecked hovered), clicked (checked/selected), and disable. No size axis — single size only.

## Anatomy

```
radio
├── root       (button) — Outer circular container. Uses Radix RadioGroup.Item. cornerRadius is always full (--klp-size-round = 9999px). Padding changes between unchecked (3XS = 4px) and checked (2XS = 6px) states.
└── indicator  (span)   — Inner ellipse dot. Rendered with forceMount so it is always in the DOM. In the clicked state shows white dot (bg-default) at 12px; in all other states its fill matches root background (effectively invisible).
```

## Variants

Single variant axis: **state**. No size or type axes (source: spec.json:variantAxes).

| State | Screenshot |
|---|---|
| `rest` | [default-rest.png](../../.klp/figma-refs/radio/default-rest.png) |
| `hover` | [default-hover.png](../../.klp/figma-refs/radio/default-hover.png) |
| `clicked` | [default-clicked.png](../../.klp/figma-refs/radio/default-clicked.png) |
| `disable` | [default-disable.png](../../.klp/figma-refs/radio/default-disable.png) |

## API

`RadioGroup` extends `React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>` (all Radix RadioGroup.Root props are forwarded).

`RadioItem` extends `React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>` (all Radix RadioGroup.Item props are forwarded).

### RadioGroup props

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Additional Tailwind/CSS classes merged via `cn()`. Applied on the `RadioGroupPrimitive.Root` wrapper. |

### RadioItem props

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Additional Tailwind/CSS classes merged via `cn()`. Applied on the `RadioGroupPrimitive.Item` wrapper. |
| `value` | `string` | required | The value associated with this radio item in the group. |
| `disabled` | `boolean` | `false` | Maps to the Radix `disabled` prop; triggers `data-disabled` attribute selectors for the disable visual state. |

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill — rest | `--klp-bg-default` | `var(--klp-color-light-100)` |
| fill — hover | `--klp-bg-brand-low` | `var(--klp-color-emerald-50)` |
| fill — clicked | `--klp-bg-brand` | `var(--klp-color-emerald-500)` |
| fill — disable | `--klp-bg-disable` | `var(--klp-color-gray-200)` |
| stroke — rest | `--klp-border-default` | `var(--klp-color-gray-400)` |
| stroke — hover | `--klp-border-brand` | `var(--klp-color-emerald-500)` |
| stroke — clicked | `--klp-border-brand` | `var(--klp-color-emerald-500)` |
| stroke — disable | `--klp-border-contrasted` | `var(--klp-color-gray-600)` |
| cornerRadius | `--klp-size-round` | `var(--klp-radius-full)` → 9999px |
| paddingX/Y — rest/hover/disable | `--klp-size-3xs` | `var(--klp-spacing-1)` → 4px |
| paddingX/Y — clicked | `--klp-size-2xs` | `var(--klp-spacing-1-5)` → 6px |
| width | literal | `24px` |
| height | literal | `24px` |
| strokeWeight | literal | `1px` |

### `indicator` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill — rest | `--klp-bg-default` | `var(--klp-color-light-100)` (matches root — invisible) |
| fill — hover | `--klp-bg-brand-low` | `var(--klp-color-emerald-50)` (matches root — invisible) |
| fill — clicked | `--klp-bg-default` | `var(--klp-color-light-100)` (white dot on brand background) |
| fill — disable | `--klp-bg-disable` | `var(--klp-color-gray-200)` (matches root — invisible) |
| width — rest/hover/disable | literal | `16px` |
| width — clicked | literal | `12px` (root padding change from 4px to 6px shrinks available area) |

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

- **Role**: `radio` (provided by Radix `RadioGroup.Item`)
- **Keyboard support**:
  - `Space` — selects the focused radio item
  - `ArrowUp` / `ArrowLeft` — moves focus to and selects the previous item in the group
  - `ArrowDown` / `ArrowRight` — moves focus to and selects the next item in the group
- **ARIA notes**: Use Radix `RadioGroup.Item` which provides full keyboard navigation within the group. The `disabled` prop maps to the native `disabled` attribute. The checked state maps to `data-state="checked"` from Radix. Each `RadioItem` should be associated with a visible `<label>` via `id`/`htmlFor`, or the `RadioGroup` root should carry an `aria-label` or `aria-labelledby`.

(source: spec.json:a11y)

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-radio-group](https://www.npmjs.com/package/@radix-ui/react-radio-group) — provides `RadioGroup.Root`, `RadioGroup.Item`, and `RadioGroup.Indicator` with full keyboard and ARIA behavior.
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `cva()` used for `rootVariants` and `indicatorVariants` class blocks.

### Token groups

- [Colors](../tokens/colors.md) — `bg-*` and `border-*` aliases consumed across all four states.
- [Spacing](../tokens/spacing.md) — `size-round`, `size-3xs`, `size-2xs` for corner radius and padding.

### Brands

- [klub](../brands/klub.md) — Figma reference screenshots captured under the klub brand.

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/radio/Radio.tsx`](../../src/components/radio/Radio.tsx)
- Example: [`src/components/radio/Radio.example.tsx`](../../src/components/radio/Radio.example.tsx)
- Playground: [`playground/routes/radio.tsx`](../../playground/routes/radio.tsx)
- Registry: [`registry/radio.json`](../../registry/radio.json)
- Figma spec: [`.klp/figma-refs/radio/spec.json`](../../.klp/figma-refs/radio/spec.json)
- Reference screenshots: [`.klp/figma-refs/radio/`](../../.klp/figma-refs/radio/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->

<!-- KLP:GAPS:BEGIN -->
## Gaps

No gaps recorded.
<!-- KLP:GAPS:END -->
