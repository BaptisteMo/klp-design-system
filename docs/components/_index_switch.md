---
title: Switch
type: component
status: stable
category: inputs
captureBrand: klub
radixPrimitive: "@radix-ui/react-switch"
sources:
  - .klp/figma-refs/switch/spec.json
  - src/components/switch/Switch.tsx
dependencies:
  components: []
  externals: ["@radix-ui/react-switch", "class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "radius"]
  brands: ["klub"]
usedBy: []
created: 2026-04-17
updated: 2026-04-21
---

# Switch

A toggle switch built on Radix Switch. Two states (checked/unchecked) driven by Radix `data-state` attributes. Displays a checkmark icon inside the thumb when toggled on.

> **Class B note:** This component has no `state` prop. Visual states (toggle-off, toggle-on, disabled) are driven entirely by Radix `data-state="checked|unchecked"` and `data-disabled` attribute selectors in the cva classes. Use `checked` / `defaultChecked` on the Switch to control state.

## Anatomy

```
Switch.Root (root)        — 44×24px pill; border; fill + stroke vary by data-state
└── Switch.Thumb          — 20×20px circle; translates 19px right when checked
    └── icon (span)       — Check icon; visible (opacity 1) when checked, hidden (opacity 0) otherwise
```

## Variants

| state |
|---|
| toggle-off (unchecked) |
| toggle-on (checked) |
| disabled |

## Props usage

Extends `Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'asChild'>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `className` | optional | `string` | — | Additional class names for the root element |

All other Radix Switch.Root props pass through (e.g. `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `id`, `name`, `value`).

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

- **Role**: `switch` (Radix sets `role="switch"` on the root button)
- **Keyboard support**: `Space` toggles. Tab to focus.
- **ARIA notes**: `aria-checked` is managed by Radix. Always pair with a visible `<label>` or `aria-label`.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-switch](https://www.npmjs.com/package/@radix-ui/react-switch) — Switch.Root, Switch.Thumb
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — Check icon inside thumb

### Token groups

- [Colors](../tokens/colors.md)
- [Radius](../tokens/radius.md)

### Brands

- [klub](../brands/klub.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/switch/Switch.tsx`](../../src/components/switch/Switch.tsx)
- Example: [`src/components/switch/Switch.example.tsx`](../../src/components/switch/Switch.example.tsx)
- Playground: [`playground/routes/switch.tsx`](../../playground/routes/switch.tsx)
- Registry: [`registry/switch.json`](../../registry/switch.json)
- Figma spec: [`.klp/figma-refs/switch/spec.json`](../../.klp/figma-refs/switch/spec.json)
- Reference screenshots: [`.klp/figma-refs/switch/`](../../.klp/figma-refs/switch/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
