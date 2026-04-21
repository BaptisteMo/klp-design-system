---
title: ActionSheet Item
type: component
status: stable
category: overlays
captureBrand: wireframe
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/action-sheet-item/spec.json
  - src/components/action-sheet-item/ActionSheetItem.tsx
dependencies:
  components: []
  externals: ["@radix-ui/react-slot", "class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "typography"]
  brands: ["wireframe"]
usedBy:
  - action-sheet-menu
  - item-side-bar
created: 2026-04-17
updated: 2026-04-21
---

# ActionSheet Item

A single row item for action sheets. Supports icon slots on both sides, an optional description label, and seven semantic states (Default, Hover, Active, Emphased, Disabled, Destructive, Creation) across three sizes.

## Anatomy

```
button (root)
├── icon-left  (span) — Optional first icon, 20×20px
├── content    (span) — Vertical flex stack
│   ├── label  (span) — Primary text content (children)
│   └── description (span) — Optional secondary text
└── icon-right (span) — Optional second action, 20×20px
```

## Variants

| state \ size | lg | md | sm |
|---|---|---|---|
| default | ✓ | ✓ | ✓ |
| hover | ✓ | ✓ | ✓ |
| active | ✓ | ✓ | ✓ |
| emphased | ✓ | ✓ | ✓ |
| disabled | ✓ | ✓ | ✓ |
| destructive | ✓ | ✓ | ✓ |
| creation | ✓ | ✓ | ✓ |

> Note: `state` is a **persistent** prop — it represents the navigation/selection state of the item and is set externally by the parent (e.g. ActionSheetMenu, ItemSideBar). It does not self-derive from interactions.

## Props usage

Extends `React.ButtonHTMLAttributes<HTMLButtonElement>` and `VariantProps<typeof rootVariants>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `state` | **persistent** | `ActionSheetItemState` | `"default"` | Semantic visual state — set by the parent to reflect selection/status. |
| `size` | optional | `ActionSheetItemSize` | `"lg"` | Row height and padding |
| `asChild` | optional | `boolean` | `false` | Render as child element via Slot |
| `firstIcon` | optional | `React.ReactNode` | — | Left-side icon slot |
| `secondAction` | optional | `React.ReactNode` | — | Right-side action/icon slot |
| `description` | optional | `React.ReactNode` | — | Secondary text below the label |

### Do / Don't

**Do:** Set `state` from the parent to reflect the selected or contextual condition of the item.

**Don't:** Leave `state` managed by this component's own click handler — it has no internal state machine. The parent (menu or sidebar) owns the active/selected state.

## Examples

```tsx
import { Plus } from 'lucide-react'
import { ActionSheetItem } from './ActionSheetItem'

export function ActionSheetItemExample() {
  return (
    <div className="flex w-80 flex-col gap-2">
      <ActionSheetItem state="default" size="lg" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
        Label action
      </ActionSheetItem>
      <ActionSheetItem state="destructive" size="lg" firstIcon={<Plus strokeWidth={1.5} />}>
        Delete item
      </ActionSheetItem>
      <ActionSheetItem state="creation" size="md" firstIcon={<Plus strokeWidth={1.5} />}>
        Create new
      </ActionSheetItem>
    </div>
  )
}
```

## Accessibility

- **Role**: `button` (native)
- **Keyboard support**: `Enter` and `Space` activate; `Tab` focuses.
- **ARIA notes**: `aria-disabled` is set when `resolvedState === 'disabled'`. The `disabled` attribute is also forwarded to prevent pointer events.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — asChild pattern
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — icons used by consumers

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

### Brands

- [wireframe](../brands/wireframe.md)

## Used by

- [ActionSheet Menu](./_index_action-sheet-menu.md)
- [Item Side Bar](./_index_item-side-bar.md)

## Files

- Source: [`src/components/action-sheet-item/ActionSheetItem.tsx`](../../src/components/action-sheet-item/ActionSheetItem.tsx)
- Example: [`src/components/action-sheet-item/ActionSheetItem.example.tsx`](../../src/components/action-sheet-item/ActionSheetItem.example.tsx)
- Playground: [`playground/routes/action-sheet-item.tsx`](../../playground/routes/action-sheet-item.tsx)
- Registry: [`registry/action-sheet-item.json`](../../registry/action-sheet-item.json)
- Figma spec: [`.klp/figma-refs/action-sheet-item/spec.json`](../../.klp/figma-refs/action-sheet-item/spec.json)
- Reference screenshots: [`.klp/figma-refs/action-sheet-item/`](../../.klp/figma-refs/action-sheet-item/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
