---
title: Collapsible
type: component
status: stable
category: disclosure
captureBrand: wireframe
radixPrimitive: "@radix-ui/react-collapsible"
sources:
  - .klp/figma-refs/collapsible/spec.json
  - src/components/collapsible/Collapsible.tsx
dependencies:
  components: ["button"]
  externals: ["@radix-ui/react-collapsible", "class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "radius", "spacing", "typography"]
  brands: ["wireframe"]
usedBy: []
created: 2026-04-21
updated: 2026-04-21
---

# Collapsible

Expandable disclosure panel with a header (icon + title + chevron toggle button) and a collapsible content area. Single variant axis: open/close state.

## Anatomy

```
div (root) — Radix CollapsiblePrimitive.Root
├── header (div)
│   ├── icon          (span) — Leading icon, defaults to ShoppingCart
│   ├── title         (span) — Section title text
│   └── toggle-button (Button/tertiary/icon) — ChevronRight, rotates 90° when open
└── content (CollapsiblePrimitive.Content)
    └── content-text (div) — Children or default placeholder text
```

## Variants

| state |
|---|
| close |
| open |

The `state` axis is derived internally from `open` / `defaultOpen` props — it is not directly settable as a prop.

## Props usage

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `open` | optional | `boolean` | — | Controlled open state |
| `defaultOpen` | optional | `boolean` | `false` | Default open state (uncontrolled) |
| `onOpenChange` | optional | `(open: boolean) => void` | — | Callback when open state changes |
| `icon` | optional | `React.ReactNode` | ShoppingCart | Leading icon in the header. Defaults to ShoppingCart as placeholder. |
| `title` | optional | `string` | `"Section title"` | Section title |
| `children` | optional | `React.ReactNode` | — | Content rendered inside the collapsible area |
| `className` | optional | `string` | — | Additional className on the root element |

## Examples

```tsx
import { ShoppingCart } from 'lucide-react'
import { Collapsible } from './Collapsible'

export function CollapsibleExample() {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-md">
      <Collapsible icon={<ShoppingCart strokeWidth={1.5} />} title="My section" defaultOpen={false}>
        <p>This is the hidden content revealed when expanded.</p>
      </Collapsible>
      <Collapsible icon={<ShoppingCart strokeWidth={1.5} />} title="My section" defaultOpen={true}>
        <p>This is the hidden content revealed when expanded.</p>
      </Collapsible>
    </div>
  )
}
```

## Accessibility

- **Role**: Uses Radix Collapsible primitive — toggle button has `aria-expanded` managed by Radix.
- **Keyboard support**: `Enter` and `Space` on the toggle button expand/collapse.
- **ARIA notes**: `aria-label` on the toggle button reflects open/close state: "Collapse section" / "Expand section".

## Dependencies

### klp components

- [Button](./_index_button.md) — toggle-button renders as `<Button variant="tertiary" size="icon">` wrapping a ChevronDown icon.

### External libraries

- [@radix-ui/react-collapsible](https://www.npmjs.com/package/@radix-ui/react-collapsible) — Radix Collapsible primitive
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — ChevronRight, ShoppingCart icons

### Token groups

- [Colors](../tokens/colors.md)
- [Radius](../tokens/radius.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

### Brands

- [wireframe](../brands/wireframe.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/collapsible/Collapsible.tsx`](../../src/components/collapsible/Collapsible.tsx)
- Example: [`src/components/collapsible/Collapsible.example.tsx`](../../src/components/collapsible/Collapsible.example.tsx)
- Playground: [`playground/routes/collapsible.tsx`](../../playground/routes/collapsible.tsx)
- Registry: [`registry/collapsible.json`](../../registry/collapsible.json)
- Figma spec: [`.klp/figma-refs/collapsible/spec.json`](../../.klp/figma-refs/collapsible/spec.json)
- Reference screenshots: [`.klp/figma-refs/collapsible/`](../../.klp/figma-refs/collapsible/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| toggle-button | partial-reuse | Button is imported and used for the toggle. ChevronDown is passed as children (icon-only slot). A rotation class is appended via className to animate the chevron on open — this is a one-off visual tweak, not a rebuild. | className-override |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
