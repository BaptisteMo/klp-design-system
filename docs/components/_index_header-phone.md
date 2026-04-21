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
  components: ["button", "breadcrumbs"]
  externals: ["@radix-ui/react-slot", "class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "radius", "typography"]
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
    │   ├── menu-button           (Button/tertiary/icon) — Menu/hamburger
    │   ├── logo                  (div)  — Brand logo slot; defaults to "K!" text fallback
    │   └── notification-button   (div)  — relative wrapper
    │       ├── notification-btn  (Button/tertiary/icon) — Bell icon
    │       └── notification-dot  (span) — Orange dot; hidden when hasNotification=false
    └── title-bar (div)
        ├── title         (h1)
        └── search-button (Button/tertiary/icon) — Search icon
└── breadcrumbs (BreadCrumbs)
```

## Variants

No variant axes — single layout.

## Props usage

Extends `React.HTMLAttributes<HTMLElement>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `title` | optional | `string` | `"Page Title"` | Page title rendered in the title bar |
| `hasNotification` | optional | `boolean` | `true` | Whether to show the notification dot on the bell button |
| `notificationCount` | optional | `number` | `1` | Unread count label for the notification button (for screen readers) |
| `breadcrumbSteps` | optional | `BreadCrumbStep[]` | — | Breadcrumb steps passed to BreadCrumbs |
| `logo` | optional | `React.ReactNode` | — | Logo slot — accepts any React node (brand asset, img, svg component, etc.) |
| `onMenuClick` | optional | `() => void` | — | Handler for menu button click |
| `onNotificationClick` | optional | `() => void` | — | Handler for notification button click |
| `onSearchClick` | optional | `() => void` | — | Handler for search button click |

## Examples

```tsx
import { HeaderPhone } from '@/components/header-phone'

export function HeaderPhoneExample() {
  return (
    <HeaderPhone
      title="Dashboard"
      hasNotification={true}
      notificationCount={3}
      breadcrumbSteps={[{ label: 'Home', onClick: () => {} }, { label: 'Dashboard' }]}
      onMenuClick={() => {}}
      onNotificationClick={() => {}}
      onSearchClick={() => {}}
    />
  )
}
```

## Accessibility

- **Role**: `banner` (native `<header>` with `role="banner"`)
- **Keyboard support**: All buttons are focusable; Tab order follows DOM order.
- **ARIA notes**: Notification button `aria-label` includes unread count when `hasNotification` is true (e.g. "Notifications, 3 unread").

## Dependencies

### klp components

- [Button](./_index_button.md) — menu-button, notification-btn, and search-button each render as `<Button variant="tertiary" size="icon">`.
- [BreadCrumbs](./_index_breadcrumbs.md) — breadcrumbs renders as `<BreadCrumbs steps={...} stepsVariant="1">`.

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — asChild pattern
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — Menu, Bell, Search icons

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
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
