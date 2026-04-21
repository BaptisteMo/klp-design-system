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
  components: ["breadcrumbs", "button"]
  externals: ["@radix-ui/react-slot", "class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "radius", "spacing", "typography"]
  brands: ["klub"]
usedBy: []
created: 2026-04-20
updated: 2026-04-21
---

# Header Phone

Mobile phone header bar with a top row (hamburger menu button, brand logo, notification button with dot indicator) and a second row (page title + search button), followed by a breadcrumb trail. Single variant — no variant axes.

## Anatomy

```
header (root)
└── content (div)
    ├── top-bar (div)
    │   ├── menu-button           (Button/tertiary/icon) — Menu/hamburger icon; triggers onMenuClick
    │   ├── logo                  (div)  — Brand logo slot; accepts any ReactNode; defaults to "K!" text fallback
    │   └── notification-button   (div)  — Relative wrapper (36×36px)
    │       ├── notification-btn  (Button/tertiary/icon) — Bell icon; aria-label includes unread count
    │       └── notification-dot  (span) — Orange dot (6×6px, absolute); hidden when hasNotification=false
    └── title-bar (div)
        ├── title         (h1)    — Page title; fg/brand-contrasted color, Heading/H1 font
        └── search-button (Button/tertiary/icon) — Search icon; hidden when showSearch=false
└── breadcrumbs (BreadCrumbs) — Rendered only when breadcrumbs prop is a non-empty array
```

## Variants

No variant axes — single layout. (source: spec.json:variantAxes)

## Props usage

Extends `React.HTMLAttributes<HTMLElement>`. All extra props are forwarded to the root `<header>` element.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `title` | optional | `string` | `"Page Title"` | Page title rendered in the title bar |
| `hasNotification` | optional | `boolean` | `true` | Whether to show the notification dot on the bell button |
| `notificationCount` | optional | `number` | `1` | Unread count label for the notification button (for screen readers) |
| `breadcrumbs` | optional | `BreadCrumbStep[] \| false` | — | Breadcrumb steps forwarded to `<BreadCrumbs>`. Omit or pass `false` to hide the row entirely. |
| `showSearch` | optional | `boolean` | `true` | Show the search button in the title bar. |
| `logo` | optional | `React.ReactNode` | — | Logo slot — accepts any React node (brand asset, img, svg component, etc.) |
| `onMenuClick` | optional | `() => void` | — | Handler for menu button click |
| `onNotificationClick` | optional | `() => void` | — | Handler for notification button click |
| `onSearchClick` | optional | `() => void` | — | Handler for search button click. Only invoked when showSearch is true. |

## Tokens
### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| stroke (border-bottom) | `--klp-border-default` | `var(--klp-color-gray-400)` |
| fill | literal: `rgba(255,255,255,0.9)` | — (no alias; see DS gaps) |
| backdrop-filter | literal: `blur(8px)` | — |

### `menu-button` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` |
| paddingTop/Right/Bottom/Left | `--klp-size-xs` | `var(--klp-spacing-2)` |

### `notification-btn` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` |
| paddingTop/Right/Bottom/Left | `--klp-size-xs` | `var(--klp-spacing-2)` |

### `notification-dot` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-decorative-orange` | `var(--klp-color-orange-300)` |

### `logo` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-brand-contrasted` | `var(--klp-color-emerald-700)` |

### `search-button` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` |
| paddingTop/Right/Bottom/Left | `--klp-size-xs` | `var(--klp-spacing-2)` |

### `title` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-brand-contrasted` | `var(--klp-color-emerald-700)` |
| fontSize | `--klp-font-size-heading-h1` | `30px` |
| fontFamily | `--klp-font-family-title` | `'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-title` | `600` |

## Examples

### Full: breadcrumbs + search + notification

```tsx
import { HeaderPhone } from '@/components/header-phone'

export function HeaderPhoneFull() {
  return (
    <HeaderPhone
      title="Dashboard"
      hasNotification={true}
      notificationCount={3}
      breadcrumbs={[
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

### Minimal: no breadcrumbs, no search

```tsx
export function HeaderPhoneMinimal() {
  return (
    <HeaderPhone
      title="Dashboard"
      hasNotification={false}
      showSearch={false}
    />
  )
}
```

### Breadcrumbs only, no search

```tsx
export function HeaderPhoneBreadcrumbsOnly() {
  return (
    <HeaderPhone
      title="Turnover Collection"
      showSearch={false}
      breadcrumbs={[{ label: 'Home' }, { label: 'Turnover Collection' }]}
    />
  )
}
```

## Accessibility

- **Role**: `banner` — root `<header>` element has `role="banner"`.
- **Keyboard support**: `Tab`, `Enter`, `Space` — all interactive elements are native `<button>` elements; tab order follows DOM order.
- **ARIA notes**: Notification button `aria-label` includes unread count when `hasNotification` is true (e.g. "Notifications, 3 unread"). BreadCrumbs provides its own `<nav>` with `aria-label`. Logo `<div>` fallback has `aria-label="Brand logo"`. (source: spec.json:a11y)

## Dependencies

### klp components

- [Button](./_index_button.md) — menu-button, notification-btn, and search-button each render as `<Button variant="tertiary" size="icon">`.
- [BreadCrumbs](./_index_breadcrumbs.md) — breadcrumbs renders as `<BreadCrumbs steps={...} stepsVariant="1">` when breadcrumbs prop is a non-empty array.

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — asChild pattern (via Button)
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `Menu`, `Bell`, `Search` icons

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Radius](../tokens/radius.md)
- [Typography](../tokens/typography.md)

### Brands

- [klub](../brands/klub.md)

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
| logo | unmatched-instance | No 'brand-logo' component in klp-components.json. The Klub! brand logo is a custom SVG asset, not a lucide icon. Inlined as a slot prop accepting any ReactNode, with a text fallback 'K!'. | inlined-ad-hoc |
| root | literal-gap | Root fill is `rgba(255,255,255,0.9)` with backdrop-blur — no `--klp-*` alias exists for semi-transparent white. Uses `bg-white/90 backdrop-blur-sm` in Tailwind. | accepted-literal |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
