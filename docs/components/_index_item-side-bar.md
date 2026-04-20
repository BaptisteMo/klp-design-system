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
  components:
    - action-sheet-item
  externals:
    - "@radix-ui/react-collapsible"
    - class-variance-authority
    - lucide-react
  tokenGroups:
    - colors
    - radius
    - spacing
    - typography
  brands:
    - klub
usedBy: [sidebar]
created: 2026-04-20
updated: 2026-04-20
---

# Item Side Bar

A sidebar navigation item with an icon, label, and optional collapsible content panel. Two feature axes: Collapsible (shows chevron affordance and expands an ActionSheet content area) and Static (no chevron, no content panel). Three states: Rest, Hover, Active.

## Anatomy

```
item-side-bar
├── root            (div)     — Outer container wrapping trigger + optional content panel.
├── trigger         (button)  — Clickable row: icon-container + label + optional chevron. bg-filled on hover/active.
│   ├── icon-container (div)  — Decorative icon wrapper with padding and border. Shows brand border on active, invisible on rest/hover.
│   │   └── decorative-icon (div) — 20×20 icon wrapper with 2px (size-4xs) padding.
│   │       └── icon        (span) — Folder-open vector icon inside decorative-icon. 16×16. lucide-react: folder-open.
│   ├── label       (span)    — Item text label.
│   └── chevron     (span)    — Collapsible-only. chevron-right (rest/hover) or chevron-down (active). 16×16 wrapper, 14×14 icon.
└── content         (div)     — Collapsible-only. Expanded panel containing ActionSheetItem rows. Hidden when feature=static or state=rest.
```

## Variants

Two variant axes: **feature** (collapsible / static) × **state** (rest / hover / active). 6 documented variants.

| state \ feature | collapsible | static |
|---|---|---|
| rest | [✓](.klp/figma-refs/item-side-bar/rest-collapsible.png) | [✓](.klp/figma-refs/item-side-bar/rest-static.png) |
| hover | [✓](.klp/figma-refs/item-side-bar/hover-collapsible.png) | [✓](.klp/figma-refs/item-side-bar/hover-static.png) |
| active | [✓](.klp/figma-refs/item-side-bar/active-collapsible.png) | [✓](.klp/figma-refs/item-side-bar/active-static.png) |

**Notes on variant matrix:**
- `active/collapsible` — trigger fill `bg-klp-bg-default`; icon-container shows contrasted border; chevron changes to `chevron-down`; content panel expanded.
- `active/static` — trigger fill `bg-klp-bg-inset` (same as hover); icon-container shows contrasted border; no chevron or content.
- `rest/*` — trigger has no fill (transparent); icon-container border and fill are invisible.
- `hover/*` — trigger fill `bg-klp-bg-inset`; icon-container border and fill remain invisible.

## API

`ItemSideBar` extends no HTML attribute type directly but accepts `className` and forwards `onClick` to the trigger button.

| Prop | Type | Default | Description |
|---|---|---|---|
| `state` | `'rest' \| 'hover' \| 'active'` | `'rest'` | Interaction state — drives trigger fill and icon-container border. |
| `feature` | `'collapsible' \| 'static'` | `'collapsible'` | Feature mode — collapsible adds chevron and expandable content panel. |
| `icon` | `React.ReactNode` | `<FolderOpen />` | Icon rendered inside the decorative icon box. Defaults to FolderOpen from lucide-react. |
| `label` | `React.ReactNode` | `'Label'` | Item label text. |
| `children` | `React.ReactNode` | — | Content rows rendered inside the expanded panel. Pass one or more `<ActionSheetItem>` elements. |
| `open` | `boolean` | — | Whether the collapsible panel is open (controlled). Only relevant when `feature='collapsible'`. |
| `defaultOpen` | `boolean` | — | Default open state (uncontrolled). Only relevant when `feature='collapsible'`. |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when open state changes. Forwarded to Radix Collapsible.Root. |
| `onClick` | `React.MouseEventHandler<HTMLButtonElement>` | — | Forwarded to the trigger button. |
| `className` | `string` | — | Additional CSS classes applied to the root element. |

## Tokens

### `trigger` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill (hover, active/collapsible) | `--klp-bg-inset` | `var(--klp-color-gray-200)` |
| fill (active/collapsible) | `--klp-bg-default` | `var(--klp-color-light-100)` |
| fill (rest) | literal: `transparent` | — |

### `icon-container` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill (active) | `--klp-bg-default` | `var(--klp-color-light-100)` |
| fill (rest/hover) | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke (active) | `--klp-border-contrasted` | `var(--klp-color-gray-600)` |
| stroke (rest/hover) | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| cornerRadius | `--klp-radius-m` | `var(--klp-radius-base)` |

### `decorative-icon` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| paddingX | `--klp-size-4xs` | `var(--klp-spacing-0-5)` |
| paddingY | `--klp-size-4xs` | `var(--klp-spacing-0-5)` |
| width/height | literal: `20px` | — (no `--klp-size-*` alias at 20px; see DS gaps) |

### `icon` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| size | literal: `16px` | — |
| icon | literal: `folder-open` | lucide-react `FolderOpen` |

### `label` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| fontSize | `--klp-font-size-text-medium` | `16px` |
| fontFamily | `--klp-font-family-label` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-label` | `400` |

### `chevron` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| wrapper size | literal: `16px` | — |
| icon size | literal: `14px` | — (no `--klp-size-*` alias at 14px; see DS gaps) |
| icon (rest/hover) | literal: `chevron-right` | lucide-react `ChevronRight` |
| icon (active) | literal: `chevron-down` | lucide-react `ChevronDown` |

### `content` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| padding | `--klp-size-xs` | `var(--klp-spacing-2)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` (resolved from cross-file Figma variable; see DS gaps) |
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |

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

- **Role**: `button` (trigger element). The collapsible feature maps to `Collapsible.Root` + `Collapsible.Trigger` + `Collapsible.Content` from `@radix-ui/react-collapsible`, which provides proper `aria-expanded` and `aria-controls` semantics automatically.
- **Keyboard support**: `Enter`, `Space` — activates the trigger (toggles collapsible open/close, or fires `onClick` for static).
- **ARIA notes**: Collapsible feature uses Radix Collapsible for proper `aria-expanded`/`aria-controls` semantics. Static feature renders as a plain button without a disclosure widget. The icon and chevron spans are marked `aria-hidden="true"`. (source: spec.json:a11y)

## Dependencies

### klp components

- [ActionSheet Item](./_index_action-sheet-item.md) — imported from `@/components/action-sheet-item`; used as content row children inside the expanded collapsible panel (source: spec.json:composition.reuses[0]).

### External libraries

- [@radix-ui/react-collapsible](https://www.npmjs.com/package/@radix-ui/react-collapsible) — `Collapsible.Root`, `Collapsible.Trigger`, `Collapsible.Content` for the collapsible feature variant.
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `cva` for all layer variant maps.
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `FolderOpen`, `ChevronRight`, `ChevronDown` icons.

### Token groups

- [Colors](../tokens/colors.md) — `bg-*`, `fg-*`, `border-*` aliases for trigger fill, icon-container border, label color, content fill.
- [Radius](../tokens/radius.md) — `--klp-radius-m` (icon-container), `--klp-radius-l` (content panel).
- [Spacing](../tokens/spacing.md) — `--klp-size-4xs` (decorative-icon padding), `--klp-size-xs` (trigger padding, content padding).
- [Typography](../tokens/typography.md) — `--klp-font-size-text-medium`, `--klp-font-family-label`, `--klp-font-weight-label` on the label layer.

### Brands

- [klub](../brands/klub.md) — captureBrand; all reference screenshots captured under the klub brand.

## Used by

- [SideBar](./_index_sidebar.md) — imports `ItemSideBar` for each navigation row in the scrollable menu.

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
| `decorative-icon` | `unmatched-instance` | No `decorative-icon` component in `klp-components.json`. Figma instance "Decorative Icon" has no klp entry. Inlined as 20×20 span wrapper with `p-klp-size-4xs`. | `inlined-local-cva` |
| `icon` | `unmatched-instance` | No standalone `icon` component in `klp-components.json`. Figma instance "Icon/Folder-open" has no klp entry. Rendered directly via lucide-react `FolderOpen`. | `inlined-local-cva` |
| `chevron` | `unmatched-instance` | No standalone `icon` component in `klp-components.json`. Figma instance "Icon selector" has no klp entry. Chevron rendered via lucide-react `ChevronRight` / `ChevronDown`. | `inlined-local-cva` |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
