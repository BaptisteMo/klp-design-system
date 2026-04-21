---
title: ActionSheet Menu
type: component
status: stable
category: lists
captureBrand: wireframe
radixPrimitive: "@radix-ui/react-popover"
sources:
  - .klp/figma-refs/action-sheet-menu/spec.json
  - src/components/action-sheet-menu/ActionSheetMenu.tsx
dependencies:
  components: ["action-sheet-item", "checkbox"]
  externals: ["@radix-ui/react-popover", "class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "radius", "spacing", "typography"]
  brands: ["wireframe"]
usedBy: []
created: 2026-04-17
updated: 2026-04-21
---

# ActionSheet Menu

A contextual menu panel composed of grouped ActionSheet_Item rows, optional section titles, and separator lines. Supports three layout types: Default (icon + label + secondary icon), Checkbox (checkbox row layout), and Flat (icon + label + secondary icon, no section headers).

## Anatomy

```
div (root)
├── section (div)         — Repeated per sections[]
│   ├── title   (span)    — Section header text; hidden in flat type
│   ├── item    (ActionSheetItem | label+Checkbox) — Repeated per section.items[]
│   └── separator (div/hr) — Between sections; inlined (no klp Separator component)
```

## Variants

| type |
|---|
| default |
| checkbox |
| flat |

## Props usage

Extends `React.HTMLAttributes<HTMLDivElement>` and `VariantProps<typeof rootVariants>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `sections` | **required** | `ActionSheetMenuSection[]` | — | Section groups, each with an optional title and an array of item definitions |
| `type` | optional | `ActionSheetMenuType` | `"default"` | Layout type controlling row rendering and separator visibility |

## Examples

```tsx
import { Settings, Share, Trash2, ChevronRight } from 'lucide-react'
import { ActionSheetMenu } from '@/components/action-sheet-menu'

export function ActionSheetMenuDefaultExample() {
  return (
    <ActionSheetMenu
      type="default"
      sections={[
        {
          title: 'Section title',
          items: [
            { id: 'settings', label: 'Settings', leftIcon: <Settings strokeWidth={1.5} />, rightIcon: <ChevronRight strokeWidth={1.5} />, onSelect: () => {} },
            { id: 'share', label: 'Share', leftIcon: <Share strokeWidth={1.5} />, onSelect: () => {} },
            { id: 'delete', label: 'Delete', leftIcon: <Trash2 strokeWidth={1.5} />, state: 'destructive', onSelect: () => {} },
          ],
        },
      ]}
    />
  )
}
```

## Accessibility

- **Role**: `menu` on the root div
- **ARIA notes**: Items rendered via `ActionSheetItem` carry `role="menuitem"`. Checkbox-type items carry `role="menuitemcheckbox"` with `aria-checked`.

## Dependencies

### klp components

- [ActionSheet Item](./_index_action-sheet-item.md) — Repeated for each list item row in default and flat types.
- [Checkbox](./_index_checkbox.md) — Used in checkbox type — each row wraps a Checkbox instance.

### External libraries

- [@radix-ui/react-popover](https://www.npmjs.com/package/@radix-ui/react-popover) — Popover positioning for the `ActionSheetMenuContent` convenience export
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — icons used by consumers

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

- Source: [`src/components/action-sheet-menu/ActionSheetMenu.tsx`](../../src/components/action-sheet-menu/ActionSheetMenu.tsx)
- Example: [`src/components/action-sheet-menu/ActionSheetMenu.example.tsx`](../../src/components/action-sheet-menu/ActionSheetMenu.example.tsx)
- Playground: [`playground/routes/action-sheet-menu.tsx`](../../playground/routes/action-sheet-menu.tsx)
- Registry: [`registry/action-sheet-menu.json`](../../registry/action-sheet-menu.json)
- Figma spec: [`.klp/figma-refs/action-sheet-menu/spec.json`](../../.klp/figma-refs/action-sheet-menu/spec.json)
- Reference screenshots: [`.klp/figma-refs/action-sheet-menu/`](../../.klp/figma-refs/action-sheet-menu/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| separator | unmatched-instance | No klp Separator component registered. | inlined-local |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
