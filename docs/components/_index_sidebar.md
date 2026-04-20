---
title: SideBar
type: component
status: stable
category: navigation
captureBrand: klub
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/sidebar/spec.json
  - src/components/sidebar/SideBar.tsx
dependencies:
  components:
    - button
    - item-side-bar
  externals:
    - "@radix-ui/react-slot"
    - class-variance-authority
    - lucide-react
  tokenGroups:
    - colors
    - radius
    - spacing
    - typography
  brands:
    - klub
usedBy: []
created: 2026-04-20
updated: 2026-04-20
---

# SideBar

Vertical navigation sidebar with a branded header (logo + notification button), a location/context switcher, a scrollable menu of item-side-bar instances, and a user profile footer. Two device variants: Desktop (247px wide, 640px tall) and Phone (320px wide, 568px tall — wider with a close/dismiss button replacing the notification affordance).

## Anatomy

```
sidebar
├── root               (nav)   — Outer sidebar container. bg-default fill, bd/default border (right edge), 16px padding all sides.
│   └── content        (div)   — Inner vertical flex column. Sections: header, menu, profil with 24px gap.
│       ├── header     (div)   — Top section: logo+notification row and context-switcher row, 10px gap.
│       │   ├── logo-notif         (div)   — Horizontal space-between row, 40px height.
│       │   │   ├── logo           (div)   — KLUB complete logo — inline SVG/image asset, no variable bindings. 123×40px.
│       │   │   └── notification-button (button) — Tertiary icon-only Button (Bell desktop / X phone). klpComponent: button.
│       │   │       └── notification-dot (span) — 8×8px circular overlay, bg/decorative-orange. Hidden on phone.
│       │   └── context-switcher   (div)   — Horizontal space-between row, 44px height.
│       │       ├── context-label  (span)  — Active location/shopping center text. fg/default color.
│       │       └── context-chevron (span) — ChevronRight icon, fg/muted stroke.
│       └── menu       (div)   — Vertical nav item list, bg/invisible (transparent), 8px gap, 16px paddingBottom.
│           └── menu-item (div) — Each row is an ItemSideBar instance (collapsible or static). klpCandidate: item-side-bar.
└── profil             (div)   — Footer row: bg/default, bd/default top border, 16px padding, 8px gap, 72px height.
    ├── avatar         (div)   — 40×40px circular image (IMAGE fill — no token binding). rounded-full.
    └── user-name      (span)  — User display name. fg/default color, 16px fontSize (Inter Regular).
```

## Variants

Single variant axis: **device**.

| Device | Width | Height | Notification affordance | Notification dot |
|--------|-------|--------|------------------------|-----------------|
| desktop | 247px | 640px | Bell icon ([desktop.png](../../.klp/figma-refs/sidebar/desktop.png)) | Visible (bg/decorative-orange) |
| phone | 320px | 568px | X / close icon ([phone.png](../../.klp/figma-refs/sidebar/phone.png)) | Hidden |

## API

`SideBarProps` extends `React.HTMLAttributes<HTMLElement>`.

Native HTML attributes of `<nav>` are forwarded via `...props`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `device` | `'desktop' \| 'phone'` | `'desktop'` | Controls layout width, height, and which icon appears in the notification button (Bell on desktop, X on phone). |
| `logo` | `React.ReactNode` | — | Logo node rendered in the header left slot. Falls back to a text span `"KLUB"` when omitted. |
| `contextLabel` | `string` | `'Shopping Center'` | Text label for the active location shown in the context-switcher row. |
| `onNotificationClick` | `React.MouseEventHandler<HTMLButtonElement>` | — | Called when the notification (desktop) or close (phone) button is clicked. |
| `onContextSwitcherClick` | `React.MouseEventHandler<HTMLDivElement>` | — | Called when the context-switcher row is clicked or activated via keyboard. |
| `menuItems` | `SideBarMenuItem[]` | `[]` | Array of navigation items rendered as `ItemSideBar` instances in the scrollable menu. |
| `avatar` | `React.ReactNode` | — | Avatar content. Pass a `string` for an `<img src>`, or any `ReactNode` for custom content. |
| `userName` | `string` | `'User Name'` | User display name rendered next to the avatar in the profile footer. |

**`SideBarMenuItem` shape:**

| Field | Type | Default | Description |
|---|---|---|---|
| `key` | `string` | — | Unique React key for the item. |
| `label` | `React.ReactNode` | — | Label text for the navigation item. |
| `icon` | `React.ReactNode` | `<FolderOpen />` | Icon node. Passed to `ItemSideBar`. |
| `feature` | `'collapsible' \| 'static'` | `'static'` | Feature mode forwarded to `ItemSideBar`. |
| `state` | `'rest' \| 'hover' \| 'active'` | `'rest'` | Interaction state forwarded to `ItemSideBar`. |
| `children` | `React.ReactNode` | — | Collapsible panel content forwarded to `ItemSideBar`. |
| `onClick` | `React.MouseEventHandler<HTMLButtonElement>` | — | Click handler forwarded to `ItemSideBar`. |

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| stroke | `--klp-border-default` | `var(--klp-color-gray-400)` |
| paddingX | literal: 16px | — |
| paddingY | literal: 16px | — |
| itemSpacing | literal: 8px | — |
| width (desktop) | literal: 247px | — |
| width (phone) | literal: 320px | — |
| height (desktop) | literal: 640px | — |
| height (phone) | literal: 568px | — |

### `header` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| itemSpacing | literal: 10px | — |

### `notification-button` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| paddingX | `--klp-size-xs` | `var(--klp-spacing-2)` |
| paddingY | `--klp-size-xs` | `var(--klp-spacing-2)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` |

### `notification-dot` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-decorative-orange` | `var(--klp-color-orange-300)` |
| width | literal: 8px | — |
| height | literal: 8px | — |
| borderRadius | literal: 50% | — |
| visibility | hidden on phone | — |

### `context-label` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| fontSize | literal: 14px | — |

### `context-chevron` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| stroke | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| icon | literal: chevron-right | — |
| size | literal: 16px | — |

### `menu` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| itemSpacing | literal: 8px | — |
| paddingBottom | literal: 16px | — |

### `profil` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| stroke (top border) | `--klp-border-default` | `var(--klp-color-gray-400)` |
| paddingX | literal: 16px | — |
| paddingY | literal: 16px | — |
| itemSpacing | literal: 8px | — |
| height | literal: 72px | — |

### `avatar` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | literal: image | — |
| width | literal: 40px | — |
| height | literal: 40px | — |
| borderRadius | literal: 50% | — |

### `user-name` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| fontSize | literal: 16px | — |
| fontWeight | literal: 400 (Regular) | — |
| fontFamily | literal: Inter → `font-klp-label` utility | — |

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

- **Role**: `navigation` — the root element is a `<nav>` with `aria-label="Site navigation"`.
- **Keyboard support**: `Tab`, `Enter`, `Space`, `Escape`.
- **ARIA notes**: The notification/close button uses native `<button>` semantics via the Button klp component. `aria-label` is set to `'Notifications'` (desktop) or `'Close navigation'` (phone). The context-switcher `div` has `role="button"`, `tabIndex={0}`, and an `aria-label="Switch context"` with `onKeyDown` handling for `Enter`/`Space`. Menu items (`ItemSideBar`) handle their own collapsible keyboard interactions via `@radix-ui/react-collapsible`.

## Dependencies

### klp components
- [Button](./_index_button.md) — Composed as the notification/close button (`variant="tertiary"`, `size="icon"`).
- [Item Side Bar](./_index_item-side-bar.md) — Each menu navigation row is an `ItemSideBar` instance.

### External libraries
- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — Radix primitive declared in spec (used transitively via Button).
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — One `cva` block per anatomy layer.
- [lucide-react](https://www.npmjs.com/package/lucide-react) — Bell, X, ChevronRight, FolderOpen icons.

### Token groups
- [Colors](../tokens/colors.md) — `--klp-bg-default`, `--klp-bg-invisible`, `--klp-bg-decorative-orange`, `--klp-border-default`, `--klp-fg-default`, `--klp-fg-muted`.
- [Spacing](../tokens/spacing.md) — `--klp-size-xs` (notification button padding).
- [Radius](../tokens/radius.md) — `--klp-radius-l` (notification button corner radius).
- [Typography](../tokens/typography.md) — `font-klp-label` utility (context-label, user-name).

### Brands
- [klub](../brands/klub.md) — Reference screenshots captured under the klub brand.

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/sidebar/SideBar.tsx`](../../src/components/sidebar/SideBar.tsx)
- Example: [`src/components/sidebar/SideBar.example.tsx`](../../src/components/sidebar/SideBar.example.tsx)
- Playground: [`playground/routes/sidebar.tsx`](../../playground/routes/sidebar.tsx)
- Registry: [`registry/sidebar.json`](../../registry/sidebar.json)
- Figma spec: [`.klp/figma-refs/sidebar/spec.json`](../../.klp/figma-refs/sidebar/spec.json)
- Reference screenshots: [`.klp/figma-refs/sidebar/`](../../.klp/figma-refs/sidebar/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| logo | unmatched-instance | No 'brand-logo' component in klp-components.json. The Klub! brand logo is a custom SVG asset. | inlined-ad-hoc — slot prop `logo?: ReactNode` with text fallback 'KLUB' |
| avatar | new-primitive | No DS Avatar component registered. | inlined-ad-hoc — 40×40 rounded-full div accepting `ReactNode` or `img src` string |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
