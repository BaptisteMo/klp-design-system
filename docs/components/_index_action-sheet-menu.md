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
  components: ["action-sheet-item", "checkbox", "separator"]
  externals: ["@radix-ui/react-popover", "class-variance-authority"]
  tokenGroups: ["colors", "radius", "spacing", "typography"]
  brands: ["wireframe"]
usedBy:
  - input-multiselect
created: 2026-04-17
updated: 2026-08-10
---

# ActionSheet Menu

A contextual menu panel composed of grouped ActionSheet_Item rows, optional section titles, and separator lines. Supports three layout types: Default (icon + label + secondary icon), Checkbox (checkbox row layout), and Flat (icon + label + secondary icon, no section headers).

<!-- KLP:INTENT:BEGIN -->

## When to use

A contextual list of actions anchored to a trigger — grouped action-sheet-item rows with optional section titles and separators. Use the checkbox type for multi-select option lists (this is what input-multiselect opens).

**Don't use it for:** Not when the user must not proceed without answering — that is modal-variation. Not for a passive collection of records — that is list. Never as a permanently visible panel.

**Family — `floating-surfaces`:** modal-variation blocks on a decision. action-sheet-menu is a contextual action list anchored to a trigger. tooltip is a hover hint with zero actions. floating-alert is transient self-dismissing system feedback.

## Don't confuse with

| Component | How to choose |
|---|---|
| `modal-variation` | action-sheet-menu offers actions from a trigger; modal-variation blocks on a decision. |
| `tooltip` | action-sheet-menu holds actionable rows; tooltip is a hint with no actions. |
| `floating-alert` | action-sheet-menu is user-invoked; floating-alert is system-emitted. |

<!-- KLP:INTENT:END -->
## Anatomy

```
div (root)
├── section (div)         — Repeated per sections[]
│   ├── title   (span)    — Section header text; hidden in flat type
│   ├── item    (ActionSheetItem | label+Checkbox) — Repeated per section.items[]
│   └── separator          — Between sections; REUSED: separator (default/flat → margin="medium", checkbox → margin="none")
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
- [Separator](./_index_separator.md) — Between-section rule. `default`/`flat` map to `margin="medium"` (paddingY `--klp-size-m` in Figma, matches the previous inlined `<hr>` exactly); `checkbox` maps to `margin="none"` (bare 1px rectangle, no padding).

### External libraries

- [@radix-ui/react-popover](https://www.npmjs.com/package/@radix-ui/react-popover) — Popover positioning for the `ActionSheetMenuContent` convenience export
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — icons used by consumers

### Token groups

- [Colors](../tokens/colors.md)
- [Radius](../tokens/radius.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

## Used by

- [Input Multiselect](./_index_input-multiselect.md)

## Files

- Source: [`src/components/action-sheet-menu/ActionSheetMenu.tsx`](../../src/components/action-sheet-menu/ActionSheetMenu.tsx)
- Example: [`src/components/action-sheet-menu/ActionSheetMenu.example.tsx`](../../src/components/action-sheet-menu/ActionSheetMenu.example.tsx)
- Playground: [`playground/routes/action-sheet-menu.tsx`](../../playground/routes/action-sheet-menu.tsx)
- Registry: [`registry/action-sheet-menu.json`](../../registry/action-sheet-menu.json)
- Figma spec: [`.klp/figma-refs/action-sheet-menu/spec.json`](../../.klp/figma-refs/action-sheet-menu/spec.json)
- Reference screenshots: [`.klp/figma-refs/action-sheet-menu/`](../../.klp/figma-refs/action-sheet-menu/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
