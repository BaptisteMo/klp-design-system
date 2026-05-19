---
title: Button
type: component
status: stable
category: inputs
captureBrand: atlas
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/button/spec.json
  - src/components/button/Button.tsx
dependencies:
  components: []
  externals: ["@radix-ui/react-slot", "class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "radius", "typography"]
  brands: ["atlas"]
usedBy:
  - collapsible
  - floating-alert
  - header-desktop
  - header-phone
  - list
  - list-content
  - modal-variation
  - pagination
  - sidebar
  - text-area
created: 2026-04-16
updated: 2026-04-21
---

# Button

Interactive button component with 5 type variants (primary, secondary, tertiary, destructive, validation), 4 sizes (sm, md, lg, icon), and 4 interaction states (rest, hover, clicked, disable). Supports optional left/right icon slots.

## Anatomy

```
button (root)
├── icon-left  (span) — Optional, rendered before the label
├── label      (span) — Hidden when size=icon; content passed as children
└── icon-right (span) — Optional, rendered after the label
```

## Variants

| type \ size | sm | md | lg | icon |
|---|---|---|---|---|
| primary | ✓ | ✓ | ✓ | ✓ |
| secondary | ✓ | ✓ | ✓ | ✓ |
| tertiary | ✓ | ✓ | ✓ | ✓ |
| destructive | ✓ | ✓ | ✓ | ✓ |
| validation | ✓ | ✓ | ✓ | ✓ |

> Note: The `state` axis (rest/hover/clicked/disable) from the Figma spec is expressed entirely via CSS pseudo-classes (`:hover`, `:active`, `[disabled]`) and the native `disabled` attribute — no `state` prop exists on `ButtonProps`. This is correct by design: Class B situation — a cva state axis without a corresponding prop.

## Props usage

Extends `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>`. All native button attributes except `type` are forwarded via `...props`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `children` | **required** | `React.ReactNode` | — | Button label or content. |
| `variant` | optional | `'primary' \| 'secondary' \| 'tertiary' \| 'destructive' \| 'validation'` | `"primary"` | Visual style variant (maps to spec variantAxes.type) |
| `size` | optional | `'sm' \| 'md' \| 'lg' \| 'icon'` | `"md"` | Size axis |
| `htmlType` | optional | `'button' \| 'submit' \| 'reset'` | `"button"` | Native button type attribute |
| `asChild` | optional | `boolean` | `false` | Render child element in place of `<button>` (e.g. `<a>`) |
| `leftIcon` | optional | `React.ReactNode` | — | Optional icon rendered before the label |
| `rightIcon` | optional | `React.ReactNode` | — | Optional icon rendered after the label |

## Examples

```tsx
import { Button } from './Button'

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1l1.75 3.55 3.92.57-2.84 2.76.67 3.9L8 9.98l-3.5 1.84.67-3.9L2.33 5.12l3.92-.57L8 1z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

export function ButtonExample() {
  return (
    <div className="flex flex-wrap items-center gap-klp-size-s">
      <Button variant="primary" size="md" leftIcon={<StarIcon />}>Primary</Button>
      <Button variant="secondary" size="md">Secondary</Button>
      <Button variant="tertiary" size="md">Tertiary</Button>
      <Button variant="destructive" size="md">Destructive</Button>
      <Button variant="validation" size="md">Validation</Button>
      <Button variant="primary" size="icon" aria-label="Star"><StarIcon /></Button>
    </div>
  )
}
```

## Accessibility

- **Role**: `button` (native HTML)
- **Keyboard support**: `Enter` and `Space` activate; `Tab` focuses.
- **ARIA notes**: `aria-disabled` mirrors the `disabled` prop for screen reader parity. When `asChild` renders an `<a>`, the semantic role shifts to `link` — ensure `href` is present.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — Slot/asChild pattern
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — icon library (used by consumer examples)

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Radius](../tokens/radius.md)
- [Typography](../tokens/typography.md)

### Brands

- [atlas](../brands/atlas.md)

## Used by

- [Collapsible](./_index_collapsible.md)
- [Floating Alert](./_index_floating-alert.md)
- [Header Desktop](./_index_header-desktop.md)
- [Header Phone](./_index_header-phone.md)
- [List](./_index_list.md)
- [List Content](./_index_list-content.md)
- [Modal Variation](./_index_modal-variation.md)
- [Pagination](./_index_pagination.md)
- [SideBar](./_index_sidebar.md)
- [Text Area](./_index_text-area.md)

## Files

- Source: [`src/components/button/Button.tsx`](../../src/components/button/Button.tsx)
- Example: [`src/components/button/Button.example.tsx`](../../src/components/button/Button.example.tsx)
- Playground: [`playground/routes/button.tsx`](../../playground/routes/button.tsx)
- Registry: [`registry/button.json`](../../registry/button.json)
- Figma spec: [`.klp/figma-refs/button/spec.json`](../../.klp/figma-refs/button/spec.json)
- Reference screenshots: [`.klp/figma-refs/button/`](../../.klp/figma-refs/button/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
