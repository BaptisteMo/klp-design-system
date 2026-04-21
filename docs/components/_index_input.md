---
title: Input
type: component
status: stable
category: inputs
captureBrand: klub
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/input/spec.json
  - src/components/input/Input.tsx
dependencies:
  components: []
  externals: ["class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "radius", "typography"]
  brands: ["klub"]
usedBy:
  - header-desktop
created: 2026-04-17
updated: 2026-04-21
---

# Input

Text input field with label, optional icons (search/action), and helper text. Supports three sizes (large, medium, small) and six states (default, filled, focused, success, danger, disable).

## Anatomy

```
div (root)
├── head (div)        — Label row; hidden when no label prop
│   ├── label (label) — Input label text
│   └── info-icon (span) — Info icon; shown when showInfoIcon=true
├── input-box (div)   — The styled input container with group focus-within
│   ├── icon-left  (span) — Optional left icon
│   ├── input      (input) — Native HTML input
│   └── icon-right (span) — Optional right icon
└── description (p) — Helper text; only rendered when description prop is provided
```

## Variants

| size \ state | default | filled | focused | success | danger | disable |
|---|---|---|---|---|---|---|
| large | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| medium | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| small | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Props usage

Extends `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>` and `VariantProps<typeof inputBoxVariants>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `label` | optional | `string` | — | Label text displayed above the input |
| `description` | optional | `string` | — | Helper / description text displayed below the input |
| `showInfoIcon` | optional | `boolean` | `false` | Show the optional info icon next to the label |
| `iconLeft` | optional | `React.ReactNode` | — | Icon rendered on the left inside the input box |
| `iconRight` | optional | `React.ReactNode` | — | Icon rendered on the right inside the input box |
| `size` | optional | `InputSize` | `"medium"` | Visual size of the input |
| `state` | **computed** | `InputState` | derived | Explicit visual state override. When omitted the component derives state from native HTML attributes (`disabled`, `aria-invalid`) and focus/value events. |
| `className` | optional | `string` | — | Additional className applied to the outer root wrapper |
| `inputBoxClassName` | optional | `string` | — | Additional className applied to the input-box container |

### Do / Don't

**Do:** Omit `state` in interactive contexts. The component auto-derives `filled`, `focused`, `disable`, and `danger` states from `value`, focus events, `disabled`, and `aria-invalid`.

**Don't:** Set `state` manually in interactive contexts — it overrides the derived state entirely, breaking the focus ring and filled color transitions.

**Do:** Use `state` in playground matrices and static design presentations where you want to lock a specific visual appearance.

## Examples

```tsx
import { Input } from './Input'

export function InputExample() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Input label="Label of the input" size="large" showInfoIcon placeholder="Placeholder" />
      <Input label="Search" size="medium" state="danger" description="This field is required." />
      <Input size="small" state="disable" disabled placeholder="Disabled" />
    </div>
  )
}
```

## Accessibility

- **Role**: native `<input>` semantics
- **Keyboard support**: Standard keyboard input; Tab to focus.
- **ARIA notes**: `htmlFor` auto-wires label to input via generated id from the `label` prop. Pass `aria-invalid` to trigger the danger state and communicate to screen readers.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — Info icon in the label row

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Radius](../tokens/radius.md)
- [Typography](../tokens/typography.md)

### Brands

- [klub](../brands/klub.md)

## Used by

- [Header Desktop](./_index_header-desktop.md)

## Files

- Source: [`src/components/input/Input.tsx`](../../src/components/input/Input.tsx)
- Example: [`src/components/input/Input.example.tsx`](../../src/components/input/Input.example.tsx)
- Playground: [`playground/routes/input.tsx`](../../playground/routes/input.tsx)
- Registry: [`registry/input.json`](../../registry/input.json)
- Figma spec: [`.klp/figma-refs/input/spec.json`](../../.klp/figma-refs/input/spec.json)
- Reference screenshots: [`.klp/figma-refs/input/`](../../.klp/figma-refs/input/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
