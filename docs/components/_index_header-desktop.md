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
  components:
    - breadcrumbs
    - button
    - input
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

# Header Desktop

Desktop page header with a title, breadcrumb trail, and contextual action row. Two feature variants: Default (icon-only tertiary action buttons + a primary secondary button) and Search active (title + a small search input replacing the action row).

## Anatomy

```
header-desktop
├── root               (header)  — Vertical flex stack (title+action row on top, breadcrumbs below). Transparent background — inherits from page.
├── title-action-row   (div)     — Horizontal flex row: title text on the left, actions on the right.
│   ├── title          (h1)      — Page title text. Heading/H1 size, Title family & weight. Color = fg/brand-contrasted (emerald-700 in klub).
│   ├── actions        (div)     — Horizontal row of action buttons. Default variant: 4 tertiary icon buttons + 1 secondary labeled button. Hidden in search-active variant.
│   │   ├── action-button-tertiary (button) — Icon-only tertiary action button (check, search, pen-line, folder-plus). Transparent fill, transparent border. Rendered via <Button variant="tertiary" size="icon">.
│   │   └── action-button-secondary (button) — Secondary labeled button with right icon (file-plus). bg/default fill, bd/brand stroke. Rendered via <Button variant="secondary" size="md">.
│   └── search-input   (div)     — Small search input replacing the actions row in the search-active variant. Rendered via <Input size="small" state="default">. Hidden in default variant.
└── breadcrumbs        (nav)     — Breadcrumb trail below the title row. Two steps visible: home/store icon step (fg/muted, chevron-right separator) and the current page step (fg/default, chevron-down dropdown affordance). Rendered via <BreadCrumbs>.
```

## Variants

One variant axis: **features** (default / search-active). 2 documented variants.

| features | Screenshot |
|---|---|
| `default` | [✓](.klp/figma-refs/header-desktop/features-default.png) |
| `search-active` | [✓](.klp/figma-refs/header-desktop/features-search-active.png) |

**Notes on variants:**
- `default` — title + 4 tertiary icon buttons (check, search, pen-line, folder-plus) + 1 secondary "New" button (file-plus icon). Breadcrumbs always visible below.
- `search-active` — title + search Input (small, default state) replaces the action row. Breadcrumbs remain visible below.

## API

`HeaderDesktop` extends `React.HTMLAttributes<HTMLElement>` (passes all remaining HTML attributes to the root `<header>` element).

| Prop | Type | Default | Description |
|---|---|---|---|
| `features` | `'default' \| 'search-active'` | `'default'` | Feature variant controlling which action row is shown. |
| `title` | `string` | `'Page title'` | Page title text rendered in the `<h1>`. |
| `breadcrumbSteps` | `BreadCrumbStep[]` | `[{label:'Home'},{label:'Current page'}]` | Breadcrumb steps array — forwarded to `<BreadCrumbs>`. |
| `onActionClick` | `(action: 'check' \| 'search' \| 'pen-line' \| 'folder-plus') => void` | — | Callback when a tertiary icon button is clicked (receives the icon name). |
| `onNewClick` | `() => void` | — | Callback when the secondary "New" button is clicked. |
| `onSearchChange` | `(value: string) => void` | — | Callback on search input change (search-active variant only). |
| `searchPlaceholder` | `string` | `'Search…'` | Placeholder text for the search input. |
| `className` | `string` | — | Additional CSS classes applied to the root `<header>` element. |

## Tokens

### `title` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-brand-contrasted` | `var(--klp-color-emerald-700)` |
| fontSize | `--klp-font-size-heading-h1` | `30px` |
| fontFamily | `--klp-font-family-title` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-title` | `600` |
| lineHeight | literal: `36px` | — |

### `action-button-tertiary` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` |
| paddingX | `--klp-size-s` | `var(--klp-spacing-3)` |
| paddingY | `--klp-size-xs` | `var(--klp-spacing-2)` |

### `action-button-secondary` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| stroke | `--klp-border-brand` | `var(--klp-color-emerald-500)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` |
| paddingX | `--klp-size-m` | `var(--klp-spacing-4)` |
| paddingY | `--klp-size-xs` | `var(--klp-spacing-2)` |
| itemSpacing | `--klp-size-2xs` | `var(--klp-spacing-1-5)` |
| color | `--klp-fg-brand` | `var(--klp-color-emerald-500)` |

### `search-input` layer (search-active variant only)

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| stroke | `--klp-border-default` | `var(--klp-color-gray-400)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` |
| paddingX | `--klp-size-xs` | `var(--klp-spacing-2)` |
| paddingY | `--klp-size-xs` | `var(--klp-spacing-2)` |
| itemSpacing | `--klp-size-m` | `var(--klp-spacing-4)` |
| color-placeholder | `--klp-fg-subtle` | `var(--klp-color-gray-600)` |
| color-icon | `--klp-fg-subtle` | `var(--klp-color-gray-600)` |

### `breadcrumbs` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color-step-muted | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| color-step-active | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| color-separator | `--klp-fg-muted` | `var(--klp-color-gray-700)` |

## Examples

```tsx
import { HeaderDesktop } from '@/components/header-desktop'

export default function HeaderDesktopExample() {
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Default — icon buttons + secondary action */}
      <HeaderDesktop
        features="default"
        title="My Page"
        breadcrumbSteps={[
          { label: 'Home' },
          { label: 'My Page' },
        ]}
        onNewClick={() => console.log('new')}
        onActionClick={(a) => console.log(a)}
      />

      {/* Search active — search input replaces action row */}
      <HeaderDesktop
        features="search-active"
        title="My Page"
        breadcrumbSteps={[
          { label: 'Home' },
          { label: 'My Page' },
        ]}
        searchPlaceholder="Search items…"
        onSearchChange={(v) => console.log(v)}
      />
    </div>
  )
}
```

## Accessibility

- **Role**: `banner` — the root `<header>` element renders with `role="banner"` (source: spec.json:a11y).
- **Keyboard support**: `Tab`, `Enter`, `Space` — Tab moves focus through all action buttons and search input; Enter/Space activates focused button.
- **ARIA notes**: Root is `<header role="banner">`. Title is `<h1>`. Action row uses `aria-label="Page actions"`. Each tertiary icon button carries an explicit `aria-label` (Check, Search, Edit, New folder). Breadcrumb nav uses `<nav>` via the `<BreadCrumbs>` component. Search input uses `<input type="search">`. (source: spec.json:a11y)

## Dependencies

### klp components

- [BreadCrumbs](./_index_breadcrumbs.md) — imported from `@/components/breadcrumbs`; renders the breadcrumb trail below the title row with `showDropdownAffordance` (source: spec.json:composition.instances[3]).
- [Button](./_index_button.md) — imported from `@/components/button`; renders the tertiary icon buttons (`variant="tertiary" size="icon"`) and the secondary action button (`variant="secondary" size="md"`) in the default variant (source: spec.json:composition.instances[0,1]).
- [Input](./_index_input.md) — imported from `@/components/input`; renders the search field (`size="small" state="default"`) in the search-active variant (source: spec.json:composition.instances[2]).

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — radixPrimitive declared in spec; consumed transitively via Button and Input.
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `cva` for all layer variant maps (root, title-action-row, title, actions, search-input).
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `Check`, `Search`, `PenLine`, `FolderPlus`, `FilePlus` icons for action buttons.

### Token groups

- [Colors](../tokens/colors.md) — `fg-*`, `bg-*`, `border-*` aliases for title color, button fills/strokes, search-input fill/stroke/text, breadcrumb step colors.
- [Radius](../tokens/radius.md) — `--klp-radius-l` on action-button-tertiary, action-button-secondary, and search-input.
- [Spacing](../tokens/spacing.md) — `--klp-size-*` aliases for button padding (`s`, `xs`, `m`, `2xs`) and search-input padding/gap.
- [Typography](../tokens/typography.md) — `--klp-font-size-heading-h1`, `--klp-font-family-title`, `--klp-font-weight-title` on the title layer.

### Brands

- [klub](../brands/klub.md) — captureBrand; all reference screenshots captured under the klub brand.

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
