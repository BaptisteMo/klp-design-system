---
title: Switch
type: component
status: stable
category: inputs
captureBrand: wireframe
radixPrimitive: "@radix-ui/react-switch"
sources:
  - .klp/figma-refs/switch/spec.json
  - src/components/switch/Switch.tsx
dependencies:
  components: []
  externals:
    - "@radix-ui/react-switch"
    - class-variance-authority
    - lucide-react
  tokenGroups:
    - colors
    - spacing
  brands:
    - wireframe
usedBy: []
created: 2026-04-16
updated: 2026-04-16
---

# Switch

Toggle switch with two states: on (checked) and off (unchecked). Uses animated thumb with icon indicator. Backed by Radix Switch primitive for full a11y and keyboard support.

## Anatomy

```
switch
├── root   (button) — Track/pill container. Radix Switch.Root. Background switches between bg/brand (on) and bg/inset (off).
├── thumb  (span)   — Sliding circle. Radix Switch.Thumb. Always bg/default (white). Translates 20px right on toggle.
└── icon   (span)   — Icon overlay inside the thumb. Checkmark visible when on (bd/brand stroke), invisible when off (bd/invisible stroke). Rendered via lucide-react Check at 16×16.
```

## Variants

Single-axis variant matrix. One axis: `state`.

| State      | Screenshot |
|------------|------------|
| `toggle-on`  | [toggle-on-default.png](../../.klp/figma-refs/switch/toggle-on-default.png) |
| `toggle-off` | [toggle-off-default.png](../../.klp/figma-refs/switch/toggle-off-default.png) |

Both variants are documented in `spec.variants[]` (source: `.klp/figma-refs/switch/spec.json`).

## API

`SwitchProps` extends `Omit<React.ComponentPropsWithoutRef<SwitchPrimitive.Root>, 'asChild'>` and `VariantProps<typeof rootVariants>`. All native HTML `button` attributes (e.g. `id`, `disabled`, `defaultChecked`, `checked`, `onCheckedChange`, `aria-label`) are forwarded to the Radix Switch.Root element.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional class names applied to the root element. |
| `checked` | `boolean` | `undefined` | Controlled checked state. |
| `defaultChecked` | `boolean` | `undefined` | Initial checked state for uncontrolled usage. |
| `onCheckedChange` | `(checked: boolean) => void` | `undefined` | Callback fired when the checked state changes. |
| `disabled` | `boolean` | `undefined` | When true, prevents user interaction and applies disabled styling via `data-[disabled]`. |
| `required` | `boolean` | `undefined` | When true, marks the switch as required in a form. |
| `name` | `string` | `undefined` | Name of the switch when submitted in a form. |
| `value` | `string` | `"on"` | Value of the switch when submitted in a form. |

## Tokens

### `root` layer

| Property | Token | Resolved (wireframe) |
|----------|-------|----------------------|
| fill (toggle-on) | `--klp-bg-brand` | `var(--klp-color-gray-500)` |
| fill (toggle-off) | `--klp-bg-inset` | `var(--klp-color-gray-200)` |
| stroke (toggle-on) | `--klp-border-brand` | `var(--klp-color-gray-500)` |
| stroke (toggle-off) | `--klp-border-default` | `var(--klp-color-gray-300)` |
| cornerRadius | `--klp-size-round` | `var(--klp-radius-full)` |
| width | literal: `44px` | — |
| height | literal: `24px` | — |
| strokeWeight | literal: `1px` | — |

### `thumb` layer

| Property | Token | Resolved (wireframe) |
|----------|-------|----------------------|
| fill (both states) | `--klp-bg-default` | `var(--klp-color-light-100)` |
| width | literal: `20px` | — |
| height | literal: `20px` | — |
| dropShadow | literal: `0 4px 16px rgba(112,112,112,0.35)` | — |

### `icon` layer

| Property | Token | Resolved (wireframe) |
|----------|-------|----------------------|
| stroke (toggle-on) | `--klp-border-brand` | `var(--klp-color-gray-500)` |
| stroke (toggle-off) | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| opacity (toggle-on) | literal: `1` | — |
| opacity (toggle-off) | literal: `0` | — |
| width | literal: `16px` | — |
| height | literal: `16px` | — |
| strokeWeight | literal: `1.2px` | — |

## Examples

```tsx
import { Switch } from './Switch'

/**
 * Switch example — copy this into your app.
 *
 * The Switch renders as a native button with role=switch and aria-checked.
 * Always pair with a visible label (or aria-label).
 */
export function SwitchExample() {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="notifications"
        className="text-klp-text-medium font-klp-label text-klp-fg-default"
      >
        Enable notifications
      </label>
      <Switch id="notifications" defaultChecked aria-label="Enable notifications" />
    </div>
  )
}
```

## Accessibility

- **Role**: `switch`
- **Keyboard support**: `Space` — toggles the switch between checked and unchecked.
- **ARIA notes**: Radix Switch.Root renders a native `<button>` with `role="switch"` and `aria-checked` automatically reflecting the current state. Use the `checked` and `onCheckedChange` props to control state. Always pair with a visible label (or `aria-label`) outside this component — the Switch itself does not render label text.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-switch](https://www.npmjs.com/package/@radix-ui/react-switch) — Radix Switch primitive providing `role="switch"`, `aria-checked`, keyboard handling, and `data-state` attribute for styling.
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `cva()` used for composing `rootVariants`, `thumbVariants`, and `iconVariants`.
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `Check` icon rendered inside the thumb as the on-state indicator.

### Token groups

- [Colors](../tokens/colors.md) — `--klp-bg-brand`, `--klp-bg-inset`, `--klp-bg-default`, `--klp-border-brand`, `--klp-border-default`, `--klp-border-invisible`.
- [Spacing](../tokens/spacing.md) — `--klp-size-round` (maps `cornerRadius` to `--klp-radius-full`).

### Brands

- [wireframe](../brands/wireframe.md) — reference screenshots captured under the wireframe brand.

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/switch/Switch.tsx`](../../src/components/switch/Switch.tsx)
- Example: [`src/components/switch/Switch.example.tsx`](../../src/components/switch/Switch.example.tsx)
- Playground: [`playground/routes/switch.tsx`](../../playground/routes/switch.tsx)
- Registry: [`registry/switch.json`](../../registry/switch.json)
- Figma spec: [`.klp/figma-refs/switch/spec.json`](../../.klp/figma-refs/switch/spec.json)
- Reference screenshots: [`.klp/figma-refs/switch/`](../../.klp/figma-refs/switch/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
