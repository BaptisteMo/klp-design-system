---
title: Header Desktop
type: component
status: stable
category: navigation
captureBrand: klub
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/header-desktop/spec.json
  - src/components/header-desktop/HeaderDesktop.tsx
dependencies:
  components: ["breadcrumbs", "button", "input"]
  externals: ["@radix-ui/react-slot", "class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "radius", "spacing", "typography"]
  brands: ["klub"]
usedBy: []
created: 2026-04-20
updated: 2026-04-21
---

# Header Desktop

Desktop page header with a title, breadcrumb trail, and contextual action row. Two feature variants: Default (icon-only tertiary action buttons + a primary secondary button) and Search active (title + a small search input replacing the action row).

## Anatomy

```
header (root)
├── title-action-row (div)
│   ├── title           (h1)     — Page title text
│   ├── actions         (div)    — Default: 4 tertiary icon buttons + 1 secondary button
│   └── search-input    (div)    — Search active: Input DS component (hidden in default)
└── breadcrumbs (BreadCrumbs)
```

## Variants

| features |
|---|
| default |
| search-active |

## Props usage

Extends `React.HTMLAttributes<HTMLElement>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `features` | optional | `HeaderDesktopFeatures` | `"default"` | Feature variant controlling which action row is shown |
| `title` | optional | `string` | `"Page title"` | Page title text |
| `breadcrumbSteps` | optional | `BreadCrumbStep[]` | — | Breadcrumb steps array — forwarded to BreadCrumbs |
| `onActionClick` | optional | `(action: 'check' \| 'search' \| 'pen-line' \| 'folder-plus') => void` | — | Callback when a tertiary icon button is clicked (receives icon name) |
| `onNewClick` | optional | `() => void` | — | Callback when the secondary "New" button is clicked |
| `onSearchChange` | optional | `(value: string) => void` | — | Callback on search input change (search-active variant) |
| `searchPlaceholder` | optional | `string` | `"Search…"` | Placeholder text for the search input |

## Examples

```tsx
import { HeaderDesktop } from '@/components/header-desktop'

export default function HeaderDesktopExample() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <HeaderDesktop
        features="default"
        title="My Page"
        breadcrumbSteps={[{ label: 'Home' }, { label: 'My Page' }]}
        onNewClick={() => console.log('new')}
        onActionClick={(a) => console.log(a)}
      />
      <HeaderDesktop
        features="search-active"
        title="My Page"
        breadcrumbSteps={[{ label: 'Home' }, { label: 'My Page' }]}
        searchPlaceholder="Search items…"
        onSearchChange={(v) => console.log(v)}
      />
    </div>
  )
}
```

## Accessibility

- **Role**: `banner` (native `<header>` with `role="banner"`)
- **Keyboard support**: All action buttons are focusable; Tab order follows DOM order.
- **ARIA notes**: Action buttons carry descriptive `aria-label` attributes (Check, Search, Edit, New folder).

## Dependencies

### klp components

- [BreadCrumbs](./_index_breadcrumbs.md) — Breadcrumb trail rendered via `<BreadCrumbs>` with showDropdownAffordance.
- [Button](./_index_button.md) — action-button-tertiary renders as `<Button variant="tertiary" size="icon">`; action-button-secondary renders as `<Button variant="secondary" size="md">`.
- [Input](./_index_input.md) — search-input renders as `<Input size="small" state="default">` in the search-active variant.

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — asChild pattern
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — Check, Search, PenLine, FolderPlus, FilePlus icons

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

- Source: [`src/components/header-desktop/HeaderDesktop.tsx`](../../src/components/header-desktop/HeaderDesktop.tsx)
- Example: [`src/components/header-desktop/HeaderDesktop.example.tsx`](../../src/components/header-desktop/HeaderDesktop.example.tsx)
- Playground: [`playground/routes/header-desktop.tsx`](../../playground/routes/header-desktop.tsx)
- Registry: [`registry/header-desktop.json`](../../registry/header-desktop.json)
- Figma spec: [`.klp/figma-refs/header-desktop/spec.json`](../../.klp/figma-refs/header-desktop/spec.json)
- Reference screenshots: [`.klp/figma-refs/header-desktop/`](../../.klp/figma-refs/header-desktop/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
