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
  components: ["button", "item-side-bar"]
  externals: ["class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "radius", "spacing", "typography"]
  brands: ["klub"]
usedBy: []
created: 2026-04-21
updated: 2026-04-22
---

# SideBar

Vertical navigation sidebar with a branded header (logo + notification button), a location/context switcher, a scrollable menu of item-side-bar instances, and a user profile footer. Two device variants: Desktop (247×640px) and Phone (320×568px — wider, close button replaces notification affordance).

## Anatomy

```
nav (root)                     — aria-label="Site navigation"; device-variant dimensions
└── content (div)              — flex-col, flex-1, gap-24px
    ├── header (div)           — bg-default, flex-col, gap-10px
    │   ├── logo-notif (div)   — space-between, h-40px
    │   │   ├── logo (div)     — 123×40px slot; defaults to "KLUB" text
    │   │   └── Button(tertiary/icon) — Bell (desktop) or X (phone)
    │   │       └── notification-dot (span) — 8px orange dot; hidden on phone
    │   └── context-switcher (div) — role=button, tabIndex=0, h-44px, space-between
    │       ├── context-label (span) — fg-default, 14px
    │       └── context-chevron (span) — ChevronRight, fg-muted
    └── menu (div)             — bg-invisible, flex-1, flex-col, gap-8px, pb-16px
        └── menu-item[*] (div) — w-full; one per SIDEBAR_MENU entry
            └── ItemSideBar    — feature=static|collapsible, state=rest|active
                └── ActionSheetItem[*] — child rows (collapsible items only)
└── profil (div)               — border-t, bg-default, px-16px py-16px, h-72px
    ├── avatar (div)           — 40×40px rounded-full; accepts ReactNode or img src
    └── user-name (span)       — fg-default, 16px
```

## Variants

> The `device` column below documents layout dimensions and button icon changes driven by the `device` prop.

| device |
|---|
| `desktop` (247×640px, Bell icon, notification dot visible) |
| `phone` (320×568px, X/close icon, notification dot hidden) |

## Props usage

Extends `React.HTMLAttributes<HTMLElement>`.

| Prop | Type | Default | Class | Description |
|---|---|---|---|---|
| `device` | `SideBarDevice` | `"desktop"` | optional | Desktop or phone layout |
| `logo` | `React.ReactNode` | — | optional | Logo node rendered in the header |
| `contextLabel` | `string` | `"Shopping Center"` | optional | Context/location label text |
| `onNotificationClick` | `React.MouseEventHandler<HTMLButtonElement>` | — | optional | Called when notification/close button is clicked |
| `onContextSwitcherClick` | `React.MouseEventHandler<HTMLDivElement>` | — | optional | Called when context-switcher is clicked |
| `activeKey` | `string` | — | **persistent** | Key of the currently active top-level menu entry. Drives row highlight and auto-expansion of the matching collapsible panel. |
| `activeChildKey` | `string` | — | **persistent** | Key of the currently active sub-item. Only honored when its parent matches `activeKey`. |
| `onNavigate` | `(key: string, parentKey?: string) => void` | — | optional | Called when a leaf row is clicked. `parentKey` is set for sub-rows. Parents with children toggle their panel instead. |
| `avatar` | `React.ReactNode` | — | optional | Avatar image node or src string |
| `userName` | `string` | `"User Name"` | optional | User display name |

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| stroke | `--klp-border-default` | `var(--klp-color-gray-400)` |
| paddingX | literal: 16px | — |
| paddingY | literal: 16px | — |
| width (desktop) | literal: 247px | — |
| height (desktop) | literal: 640px | — |
| width (phone) | literal: 320px | — |
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
| paddingX | `--klp-size-xs` | 8px |
| paddingY | `--klp-size-xs` | 8px |
| cornerRadius | `--klp-radius-l` | 8px |

### `notification-dot` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-decorative-orange` | `var(--klp-color-orange-300)` |
| width | literal: 8px | — |
| height | literal: 8px | — |

### `context-label` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| fontSize | literal: 14px | — |

### `context-chevron` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| stroke | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| icon | literal: chevron-right, 16px | — |

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
| stroke (top) | `--klp-border-default` | `var(--klp-color-gray-400)` |
| paddingX | literal: 16px | — |
| paddingY | literal: 16px | — |
| height | literal: 72px | — |

### `user-name` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| fontSize | literal: 16px | — |
| fontFamily | literal: Inter (`font-klp-label`) | — |

## Examples

```tsx
import { SideBar } from './SideBar'

export function SideBarExample() {
  return (
    <div className="flex gap-8 items-start p-6">
      {/* Default — no active item */}
      <SideBar
        contextLabel="Centre Commercial"
        userName="Baptiste M."
        onNavigate={(key, parentKey) =>
          console.log('navigate', { key, parentKey })
        }
      />

      {/* Active leaf */}
      <SideBar
        contextLabel="Centre Commercial"
        userName="Baptiste M."
        activeKey="my-documents"
        onNavigate={(key, parentKey) =>
          console.log('navigate', { key, parentKey })
        }
      />

      {/* Active sub-item — parent auto-expands */}
      <SideBar
        contextLabel="Centre Commercial"
        userName="Baptiste M."
        activeKey="my-shopping-center"
        activeChildKey="newsfeed"
        onNavigate={(key, parentKey) =>
          console.log('navigate', { key, parentKey })
        }
      />

      {/* Phone */}
      <SideBar
        device="phone"
        contextLabel="Centre Commercial"
        userName="Baptiste M."
        activeKey="customer-excellence"
        activeChildKey="ace"
      />
    </div>
  )
}
```

## Accessibility

- **Role**: `navigation` (native `<nav>` landmark with `aria-label="Site navigation"`)
- **Keyboard support**: `Tab`, `Enter`, `Space`, `Escape`
- **ARIA notes**: The sidebar is a `<nav>` landmark. The notification/close button uses native button semantics via the Button klp component — `aria-label` switches between `"Notifications"` (desktop) and `"Close navigation"` (phone). The context switcher uses `role="button"` with `tabIndex={0}` and keyboard handlers for Enter/Space. Menu items (`ItemSideBar`) handle their own collapsible keyboard interactions via `@radix-ui/react-collapsible`.

## Dependencies

### klp components

- [Button](./_index_button.md) — notification/close button renders as `<Button variant="tertiary" size="icon">` with Bell (desktop) or X (phone) icon.
- [Item Side Bar](./_index_item-side-bar.md) — each menu row renders as `<ItemSideBar feature=static|collapsible state=rest|active>`. Collapsible items expose `<ActionSheetItem>` children (re-exported from item-side-bar).

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — Radix primitive used by item-side-bar (transitive)
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — Bell, X, ChevronRight icons in the header; all menu icons (ShieldAlert, CalendarDays, Store, etc.) from `menu.ts`

### Token groups

- [Colors](../tokens/colors.md)
- [Radius](../tokens/radius.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

### Brands

- [klub](../brands/klub.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/sidebar/SideBar.tsx`](../../src/components/sidebar/SideBar.tsx)
- Menu tree: [`src/components/sidebar/menu.ts`](../../src/components/sidebar/menu.ts)
- Example: [`src/components/sidebar/SideBar.example.tsx`](../../src/components/sidebar/SideBar.example.tsx)
- Playground: [`playground/routes/sidebar.tsx`](../../playground/routes/sidebar.tsx)
- Registry: [`registry/sidebar.json`](../../registry/sidebar.json)
- Figma spec: [`.klp/figma-refs/sidebar/spec.json`](../../.klp/figma-refs/sidebar/spec.json)
- Reference screenshots: [`.klp/figma-refs/sidebar/`](../../.klp/figma-refs/sidebar/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| logo | unmatched-instance | No 'brand-logo' component in klp-components.json. Logo is a slot prop accepting any ReactNode, with a text fallback 'KLUB'. | inlined-ad-hoc |
| context-label | token-gap | Font size is literal `14px` — no `--klp-text-*` alias covers this value exactly. | accepted-literal |
| user-name | token-gap | Font size is literal `16px` — no `--klp-text-*` alias covers this value exactly. | accepted-literal |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
