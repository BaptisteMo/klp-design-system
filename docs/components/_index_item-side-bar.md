---
title: Item Side Bar
type: component
status: stable
category: navigation
captureBrand: klub
radixPrimitive: "@radix-ui/react-collapsible"
sources:
  - .klp/figma-refs/item-side-bar/spec.json
  - src/components/item-side-bar/ItemSideBar.tsx
dependencies:
  components: ["action-sheet-item"]
  externals: ["@radix-ui/react-collapsible", "class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "radius"]
  brands: ["klub"]
usedBy: ["sidebar"]
created: 2026-04-20
updated: 2026-04-21
---

# Item Side Bar

A sidebar navigation item with an icon, label, and optional collapsible content panel. Two feature modes: Collapsible (shows chevron affordance and expands an ActionSheet content area) and Static (no chevron, no content panel). Three states: Rest, Hover, Active.

> **Class B note:** The `hover` state is driven by CSS `:hover` pseudo-class on the trigger element — it is not a value you pass via a prop. The `state` prop controls `rest` and `active` only; the `hover` appearance applies automatically when the user hovers. Do not set `state="hover"` in interactive contexts.

## Anatomy

```
div (root)
└── Collapsible.Root | div  — feature=collapsible uses Radix root; static uses plain div
    ├── trigger (button)    — Collapsible.Trigger (collapsible) or plain button (static)
    │   ├── icon-container (span) — Rounded square; border + bg vary by state
    │   │   └── decorative-icon (span) — 20×20 wrapper with padding
    │   │       └── icon (span)  — 16×16 icon; defaults to FolderOpen
    │   ├── label (span)    — Item label text
    │   └── chevron (span)  — collapsible-only; ChevronRight at rest/hover, ChevronDown at active
    └── Collapsible.Content — collapsible-only; contains content panel
        └── content (div)   — Expanded panel; rounded-klp-l, bg-klp-bg-default
```

## Variants

| feature \ state | rest | hover | active |
|---|---|---|---|
| collapsible | ✓ | ✓ | ✓ |
| static | ✓ | ✓ | ✓ |

## Props usage

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `state` | **persistent** | `ItemSideBarState` | `"rest"` | Interaction state — drives trigger fill and icon-container border. Represents the currently-selected navigation item. |
| `feature` | optional | `ItemSideBarFeature` | `"collapsible"` | Feature mode — collapsible adds chevron + expandable content panel |
| `icon` | optional | `React.ReactNode` | — | Icon to render inside the decorative icon box. Defaults to FolderOpen. |
| `label` | **required** | `React.ReactNode` | `"Label"` | Item label text |
| `children` | optional | `React.ReactNode` | — | Content rows rendered inside the expanded panel (collapsible only). |
| `open` | optional | `boolean` | — | Whether the collapsible panel is open (controlled) |
| `defaultOpen` | optional | `boolean` | — | Default open state (uncontrolled) |
| `onOpenChange` | optional | `(open: boolean) => void` | — | Callback when open state changes |
| `onClick` | optional | `React.MouseEventHandler<HTMLButtonElement>` | — | Forwarded to the trigger button |
| `className` | optional | `string` | — | Additional className applied to the root wrapper |

### Do / Don't

**Do:** Set `state="active"` on the item that represents the currently selected navigation destination. The parent component (Sidebar) owns and passes this value.

**Don't:** Derive `state` inside the component itself, or set it based on local click state — it represents the navigation selection owned by the router or page context above.

**Do:** Use `feature="static"` when the item is a leaf (no sub-navigation). Use `feature="collapsible"` when the item has child routes.

## Examples

```tsx
import { FolderOpen } from 'lucide-react'
import { ItemSideBar, ActionSheetItem } from '@/components/item-side-bar'

export function ItemSideBarExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Static — rest */}
      <ItemSideBar
        feature="static"
        state="rest"
        icon={<FolderOpen strokeWidth={1.5} />}
        label="Projects"
      />

      {/* Static — active */}
      <ItemSideBar
        feature="static"
        state="active"
        icon={<FolderOpen strokeWidth={1.5} />}
        label="Projects"
      />

      {/* Collapsible — rest (collapsed) */}
      <ItemSideBar
        feature="collapsible"
        state="rest"
        icon={<FolderOpen strokeWidth={1.5} />}
        label="Projects"
      >
        <ActionSheetItem state="default">Sub-item A</ActionSheetItem>
        <ActionSheetItem state="default">Sub-item B</ActionSheetItem>
      </ItemSideBar>

      {/* Collapsible — active (expanded) */}
      <ItemSideBar
        feature="collapsible"
        state="active"
        icon={<FolderOpen strokeWidth={1.5} />}
        label="Projects"
        defaultOpen
      >
        <ActionSheetItem state="default">Sub-item A</ActionSheetItem>
        <ActionSheetItem state="default">Sub-item B</ActionSheetItem>
      </ItemSideBar>
    </div>
  )
}
```

## Accessibility

- **Role**: `button` (trigger element)
- **Keyboard support**: `Enter`/`Space` expands/collapses (collapsible variant). Tab to focus.
- **ARIA notes**: Collapsible.Trigger sets `aria-expanded` automatically via Radix. Icon is `aria-hidden`.

## Dependencies

### klp components

- [Action Sheet Item](./_index_action-sheet-item.md) — content panel rows rendered as `<ActionSheetItem>` instances.

### External libraries

- [@radix-ui/react-collapsible](https://www.npmjs.com/package/@radix-ui/react-collapsible) — Collapsible.Root, Trigger, Content for the collapsible variant
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — FolderOpen (default icon), ChevronRight, ChevronDown

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Radius](../tokens/radius.md)

### Brands

- [klub](../brands/klub.md)

## Used by

- [SideBar](./_index_sidebar.md) — renders ItemSideBar instances for each menu item.

## Files

- Source: [`src/components/item-side-bar/ItemSideBar.tsx`](../../src/components/item-side-bar/ItemSideBar.tsx)
- Example: [`src/components/item-side-bar/ItemSideBar.example.tsx`](../../src/components/item-side-bar/ItemSideBar.example.tsx)
- Playground: [`playground/routes/item-side-bar.tsx`](../../playground/routes/item-side-bar.tsx)
- Registry: [`registry/item-side-bar.json`](../../registry/item-side-bar.json)
- Figma spec: [`.klp/figma-refs/item-side-bar/spec.json`](../../.klp/figma-refs/item-side-bar/spec.json)
- Reference screenshots: [`.klp/figma-refs/item-side-bar/`](../../.klp/figma-refs/item-side-bar/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| decorative-icon | unmatched-instance | No DS icon component — lucide-react icons inlined directly | inlined-ad-hoc |
| icon | unmatched-instance | No DS icon component — lucide-react icons inlined directly | inlined-ad-hoc |
| chevron | unmatched-instance | No DS icon component — ChevronRight/ChevronDown from lucide-react, not a klp primitive | inlined-ad-hoc |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
