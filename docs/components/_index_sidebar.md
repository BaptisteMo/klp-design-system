---
title: SideBar
type: component
status: stable
category: navigation
captureBrand: klub
radixPrimitive: null
sources:
  - .klp/figma-refs/sidebar/spec.json
  - src/components/sidebar/Sidebar.tsx
dependencies:
  components: ["button", "item-side-bar"]
  externals: ["class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "typography"]
  brands: ["klub"]
usedBy: []
created: 2026-04-21
updated: 2026-04-21
---

# SideBar

A full sidebar navigation panel with a header (logo + notification/close button + context switcher), a menu of ItemSideBar rows, and a profile footer. Two device layouts: Desktop (247×640px) and Phone (320×568px).

## Anatomy

```
nav (root)                   — aria-label="Site navigation"; device-variant dimensions
└── content (div)
    ├── header (div)
    │   ├── logo-notif (div)   — space-between; 40px height
    │   │   ├── logo (div)     — 123×40px slot; defaults to "KLUB" text
    │   │   └── notif-button (Button/tertiary/icon) — Bell (desktop) or X (phone)
    │   │       └── notification-dot (span) — 8px orange dot; hidden on phone
    │   └── context-switcher (div) — 44px; space-between; role=button
    │       ├── context-label (span)
    │       └── context-chevron (span) — ChevronRight icon
    └── menu (div)           — flex-col gap; flex-1
        └── menu-item[*] (div)
            └── ItemSideBar  — one per entry in menuItems[]
└── profil (div)             — footer; border-t; 72px height
    ├── avatar (div)         — 40×40px circle; image or slot
    └── user-name (span)
```

## Variants

| device |
|---|
| desktop |
| phone |

## Props usage

Extends `React.HTMLAttributes<HTMLElement>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `menuItems` | **required** | `SideBarMenuItem[]` | `[]` | Menu items rendered as ItemSideBar instances |
| `device` | optional | `SideBarDevice` | `"desktop"` | Desktop or phone layout |
| `logo` | optional | `React.ReactNode` | — | Logo node rendered in the header |
| `contextLabel` | optional | `string` | `"Shopping Center"` | Context/location label text |
| `onNotificationClick` | optional | `React.MouseEventHandler<HTMLButtonElement>` | — | Called when notification/close button is clicked |
| `onContextSwitcherClick` | optional | `React.MouseEventHandler<HTMLDivElement>` | — | Called when context-switcher is clicked |
| `avatar` | optional | `React.ReactNode` | — | Avatar image node or src string |
| `userName` | optional | `string` | `"User Name"` | User display name |

### SideBarMenuItem shape

| Field | Type | Description |
|---|---|---|
| `key` | `string` | Unique key for the menu item |
| `label` | `React.ReactNode` | Label text |
| `icon` | `React.ReactNode` | Icon node (defaults to FolderOpen) |
| `feature` | `'collapsible' \| 'static'` | Feature mode for the item |
| `state` | `'rest' \| 'hover' \| 'active'` | Interaction state |
| `children` | `React.ReactNode` | Children for collapsible items |
| `onClick` | `React.MouseEventHandler<HTMLButtonElement>` | Click handler |

## Examples

```tsx
import { FolderOpen, Home, Settings, Users } from 'lucide-react'
import { SideBar } from './SideBar'

export function SideBarExample() {
  return (
    <SideBar
      device="desktop"
      contextLabel="Klub! — Centre Commercial"
      userName="Baptiste M."
      menuItems={[
        {
          key: 'home',
          label: 'Accueil',
          icon: <Home aria-hidden="true" strokeWidth={1.5} />,
          feature: 'static',
          state: 'active',
        },
        {
          key: 'files',
          label: 'Fichiers',
          icon: <FolderOpen aria-hidden="true" strokeWidth={1.5} />,
          feature: 'collapsible',
          state: 'rest',
        },
        {
          key: 'team',
          label: 'Équipe',
          icon: <Users aria-hidden="true" strokeWidth={1.5} />,
          feature: 'static',
          state: 'rest',
        },
        {
          key: 'settings',
          label: 'Paramètres',
          icon: <Settings aria-hidden="true" strokeWidth={1.5} />,
          feature: 'static',
          state: 'rest',
        },
      ]}
    />
  )
}
```

## Accessibility

- **Role**: `navigation` (native `<nav>` with `aria-label="Site navigation"`)
- **Keyboard support**: All interactive elements (notification button, context switcher, menu items) are keyboard-focusable. Tab order follows DOM order.
- **ARIA notes**: Context switcher uses `role="button"` with `tabIndex={0}` and keyboard handler for Enter/Space. Notification button label switches between "Notifications" (desktop) and "Close navigation" (phone).

## Dependencies

### klp components

- [Button](./_index_button.md) — notification/close button renders as `<Button variant="tertiary" size="icon">`.
- [Item Side Bar](./_index_item-side-bar.md) — each menu item renders as `<ItemSideBar>` with feature/state/icon/label.

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — Bell, X, ChevronRight, FolderOpen icons

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

### Brands

- [klub](../brands/klub.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/sidebar/Sidebar.tsx`](../../src/components/sidebar/Sidebar.tsx)
- Example: [`src/components/sidebar/Sidebar.example.tsx`](../../src/components/sidebar/Sidebar.example.tsx)
- Playground: [`playground/routes/sidebar.tsx`](../../playground/routes/sidebar.tsx)
- Registry: [`registry/sidebar.json`](../../registry/sidebar.json)
- Figma spec: [`.klp/figma-refs/sidebar/spec.json`](../../.klp/figma-refs/sidebar/spec.json)
- Reference screenshots: [`.klp/figma-refs/sidebar/`](../../.klp/figma-refs/sidebar/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| logo | unmatched-instance | No 'brand-logo' component in klp-components.json. Logo is a slot prop accepting any ReactNode, with a text fallback 'KLUB'. | inlined-ad-hoc |
| context-label | token-gap | Font size is literal `14px` — no `--klp-text-*` alias covers this value exactly | accepted-literal |
| user-name | token-gap | Font size is literal `16px` — no `--klp-text-*` alias covers this value exactly | accepted-literal |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
