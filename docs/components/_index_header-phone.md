---
title: Header Phone
type: component
status: stable
category: containers
captureBrand: klub
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/header-phone/spec.json
  - src/components/header-phone/HeaderPhone.tsx
dependencies:
  components: [breadcrumbs, button]
  externals: ["@radix-ui/react-slot", class-variance-authority, lucide-react]
  tokenGroups: [colors, radius, spacing, typography]
  brands: [klub]
usedBy: []
created: 2026-04-20
updated: 2026-04-20
---

# Header Phone

Mobile phone header bar with a top row (hamburger menu button, brand logo, notification button with dot indicator) and a second row (page title + search button), followed by a breadcrumb trail. Single variant — no variant axes.

## Anatomy

```
header (root)
└── div (content) — Full-width vertical container
    ├── div (top-bar) — Horizontal row, space-between, height 36px
    │   ├── button (menu-button) — Tertiary icon button (lucide: Menu); bound via Button instance
    │   ├── div (logo) — Brand logo slot; accepts any ReactNode; fg/brand-contrasted fill
    │   └── div (notification-button) — Relative wrapper, 36×36px
    │       ├── button (notification-btn) — Tertiary icon button (lucide: Bell); bound via Button instance
    │       └── span (notification-dot) — Orange dot badge, 6×6px, absolute top-[4px] right-[4px]; hidden when hasNotification=false
    └── div (title-bar) — Horizontal row, space-between, height 36px
        ├── h1 (title) — Page title; fg/brand-contrasted, Heading/H1 font
        └── button (search-button) — Tertiary icon button (lucide: Search); bound via Button instance
nav (breadcrumbs) — BreadCrumbs component instance (Steps=1)
```

## Variants

Single variant — no variant axes (source: spec.json:variantAxes).

| Variant | Screenshot |
|---|---|
| default | [`.klp/figma-refs/header-phone/default.png`](../../.klp/figma-refs/header-phone/default.png) |

## API

Extends `React.HTMLAttributes<HTMLElement>`. Native HTML attributes are forwarded to the root `<header>` element.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `'Page Title'` | Page title rendered in the title bar. |
| `hasNotification` | `boolean` | `true` | Whether to show the notification dot on the bell button. |
| `notificationCount` | `number` | `1` | Unread count label for the notification button (screen reader only). |
| `breadcrumbSteps` | `BreadCrumbStep[]` | `[{ label: 'Home' }, { label: 'Section' }]` | Breadcrumb steps passed to `<BreadCrumbs>`. |
| `logo` | `React.ReactNode` | `undefined` | Logo slot — accepts any React node (brand asset, img, svg component, etc.). Falls back to a `K!` text placeholder when omitted. |
| `onMenuClick` | `() => void` | `undefined` | Handler for menu button click. |
| `onNotificationClick` | `() => void` | `undefined` | Handler for notification button click. |
| `onSearchClick` | `() => void` | `undefined` | Handler for search button click. |

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| stroke (border-bottom) | `--klp-border-default` | `var(--klp-color-gray-400)` |
| fill | literal: `rgba(255,255,255,0.9)` | — (no `--klp-*` alias; see DS gaps) |
| backdropFilter | literal: `blur(8px)` | — |
| paddingTop | literal: `24px` | — |
| paddingBottom | literal: `16px` | — |
| paddingLeft / paddingRight | literal: `16px` | — |
| itemSpacing | literal: `8px` | — |
| width | literal: `320px` | — |

### `menu-button` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` = `8px` |
| paddingAll | `--klp-size-xs` | `var(--klp-spacing-2)` = `8px` |

### `logo` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-brand-contrasted` | `var(--klp-color-emerald-700)` = `#0F6F7C` |
| width / height | literal: `28px` | — |

### `notification-btn` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` = `8px` |
| paddingAll | `--klp-size-xs` | `var(--klp-spacing-2)` = `8px` |

### `notification-dot` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-decorative-orange` | `var(--klp-color-orange-300)` |
| width / height | literal: `6px` | — |

### `title` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-brand-contrasted` | `var(--klp-color-emerald-700)` = `#0F6F7C` |
| fontSize | `--klp-font-size-heading-h1` | `30px` |
| fontFamily | `--klp-font-family-title` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-title` | `600` |
| lineHeight | literal: `36px` | — |

### `search-button` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` = `8px` |
| paddingAll | `--klp-size-xs` | `var(--klp-spacing-2)` = `8px` |

## Examples

```tsx
import { HeaderPhone } from '@/components/header-phone'

export function HeaderPhoneExample() {
  return (
    <HeaderPhone
      title="Dashboard"
      hasNotification={true}
      notificationCount={3}
      breadcrumbSteps={[
        { label: 'Home', onClick: () => {} },
        { label: 'Dashboard' },
      ]}
      onMenuClick={() => {}}
      onNotificationClick={() => {}}
      onSearchClick={() => {}}
    />
  )
}
```

## Accessibility

- **Role**: `banner` (implicit from `<header>` element; explicit `role="banner"` is set).
- **Keyboard support**: `Tab`, `Enter`, `Space`.
- **ARIA notes**: Menu, notification, and search buttons are native `<button>` elements rendered via the `Button` primitive — keyboard focus and activation are handled by the browser. The notification dot has `aria-hidden="true"` and the notification count is surfaced via the button's `aria-label` (e.g. `"Notifications, 3 unread"`). `BreadCrumbs` provides its own `<nav>` with an `aria-label`. (source: spec.json:a11y)

## Dependencies

### klp components
- [BreadCrumbs](./_index_breadcrumbs.md) — breadcrumb trail rendered via `<BreadCrumbs steps={...} stepsVariant="1">`.
- [Button](./_index_button.md) — menu-button, notification-btn, and search-button each render as `<Button variant="tertiary" size="icon">`.

### External libraries
- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — Radix Slot primitive (spec.json:radixPrimitive).
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — CVA for variant class management.
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `Menu`, `Bell`, `Search` icons.

### Token groups
- [Colors](../tokens/colors.md) — `--klp-border-default`, `--klp-bg-invisible`, `--klp-border-invisible`, `--klp-fg-brand-contrasted`, `--klp-bg-decorative-orange`.
- [Radius](../tokens/radius.md) — `--klp-radius-l` on button layers.
- [Spacing](../tokens/spacing.md) — `--klp-size-xs` on button padding layers.
- [Typography](../tokens/typography.md) — `--klp-font-size-heading-h1`, `--klp-font-family-title`, `--klp-font-weight-title` on title layer.

### Brands
- [klub](../brands/klub.md) — spec captured under the `klub` brand (source: spec.json:captureBrand).

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/header-phone/HeaderPhone.tsx`](../../src/components/header-phone/HeaderPhone.tsx)
- Example: [`src/components/header-phone/HeaderPhone.example.tsx`](../../src/components/header-phone/HeaderPhone.example.tsx)
- Playground: [`playground/routes/header-phone.tsx`](../../playground/routes/header-phone.tsx)
- Registry: [`registry/header-phone.json`](../../registry/header-phone.json)
- Figma spec: [`.klp/figma-refs/header-phone/spec.json`](../../.klp/figma-refs/header-phone/spec.json)
- Reference screenshots: [`.klp/figma-refs/header-phone/`](../../.klp/figma-refs/header-phone/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| logo | unmatched-instance | No `brand-logo` component in klp-components.json. The Klub! brand logo is a custom SVG asset, not a lucide icon. | Inlined as a slot prop (`logo?: ReactNode`) accepting any ReactNode, with a text fallback `K!`. |

<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
