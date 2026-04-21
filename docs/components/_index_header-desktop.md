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
├── title-action-row (div)    — Horizontal flex row: title left, actions right
│   ├── title           (h1)  — Page title; fg/brand-contrasted; Heading/H1; Title family & weight
│   ├── actions         (div) — Default: tertiary icon buttons + secondary button; hidden in search-active
│   │   ├── action-button-tertiary (button) — Icon-only, transparent fill + border; klpComponent: button
│   │   └── action-button-secondary (button) — Labeled + right icon, bg/default fill, bd/brand stroke; klpComponent: button
│   └── search-input    (div) — Search-active only; klpComponent: input; hidden in default
└── breadcrumbs (nav)         — Breadcrumb trail; klpComponent: breadcrumbs
```

## Variants

| features | Screenshot |
|---|---|
| `default` | [features-default.png](../../.klp/figma-refs/header-desktop/features-default.png) |
| `search-active` | [features-search-active.png](../../.klp/figma-refs/header-desktop/features-search-active.png) |

## API

The root element is a native `<header>` element (forwarded ref to `HTMLElement`). No native HTML attribute spread is declared beyond `ref` and `className`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `"Page title"` | Page title rendered as `<h1>` in the title row. |
| `features` | `'default' \| 'search-active'` | `"default"` | Mode selector: `default` renders the actions row; `search-active` replaces it with a search input. |
| `actions` | `HeaderAction[]` | — | Action buttons rendered left-to-right in the title row when `features='default'`. Ignored in `search-active`. |
| `breadcrumbs` | `BreadCrumbStep[] \| false` | — | Breadcrumb steps forwarded to `<BreadCrumbs>`. Omit or pass `false` to hide the row entirely. |
| `searchPlaceholder` | `string` | `"Search…"` | Placeholder for the search input. Only used when `features='search-active'`. |
| `onSearchChange` | `(value: string) => void` | — | Called on every search input change. Only used when `features='search-active'`. |
| `className` | `string` | — | Additional className applied to the root `<header>` element. |

**`HeaderAction` shape** (each element of the `actions` array):

| Field | Type | Description |
|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'destructive' \| 'validation'` | Button variant forwarded to `<Button>`. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'icon'` | Button size forwarded to `<Button>`. |
| `children` | `React.ReactNode` | Label (sm/md/lg) or icon node (size=`'icon'`). Required. |
| `leftIcon` | `React.ReactNode` | Left icon slot. |
| `rightIcon` | `React.ReactNode` | Right icon slot. |
| `onClick` | `() => void` | Click handler. |
| `aria-label` | `string` | Recommended when `size='icon'` (no visible label). |
| `key` | `string` | Stable React key. Falls back to array index if omitted. |

## Props usage

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `title` | optional | `string` | `"Page title"` | Page title rendered as `<h1>` in the title row. |
| `features` | optional | `'default' \| 'search-active'` | `"default"` | Mode selector: `default` renders the actions row; `search-active` replaces it with a search input. |
| `actions` | optional | `HeaderAction[]` | — | Action buttons rendered left-to-right in the title row when `features='default'`. Ignored in `search-active`. |
| `breadcrumbs` | optional | `BreadCrumbStep[] \| false` | — | Breadcrumb steps forwarded to `<BreadCrumbs>`. Omit or pass `false` to hide the row. |
| `searchPlaceholder` | optional | `string` | `"Search…"` | Placeholder for the search input. Only used when `features='search-active'`. |
| `onSearchChange` | optional | `(value: string) => void` | — | Called on every search input change. Only used when `features='search-active'`. |
| `className` | optional | `string` | — | Additional className applied to the root `<header>` element. |

## Tokens
### `title` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-brand-contrasted` | `var(--klp-color-emerald-700)` |
| font-size | `--klp-font-size-heading-h1` | `30px` |
| font-family | `--klp-font-family-title` | `'Test Calibre', system-ui, sans-serif` |
| font-weight | `--klp-font-weight-title` | `600` |
| line-height | literal: `36px` | — |

### `action-button-tertiary` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` (transparent) |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` (transparent) |
| corner-radius | `--klp-radius-l` | `var(--klp-radius-lg)` |
| padding-x | `--klp-size-s` | `var(--klp-spacing-3)` |
| padding-y | `--klp-size-xs` | `var(--klp-spacing-2)` |

### `action-button-secondary` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| stroke | `--klp-border-brand` | `var(--klp-color-emerald-500)` |
| corner-radius | `--klp-radius-l` | `var(--klp-radius-lg)` |
| padding-x | `--klp-size-m` | `var(--klp-spacing-4)` |
| padding-y | `--klp-size-xs` | `var(--klp-spacing-2)` |
| item-spacing | `--klp-size-2xs` | `var(--klp-spacing-1-5)` |
| color | `--klp-fg-brand` | `var(--klp-color-emerald-500)` |

### `search-input` layer (search-active variant only)

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| stroke | `--klp-border-default` | `var(--klp-color-gray-400)` |
| corner-radius | `--klp-radius-l` | `var(--klp-radius-lg)` |
| padding-x | `--klp-size-xs` | `var(--klp-spacing-2)` |
| padding-y | `--klp-size-xs` | `var(--klp-spacing-2)` |
| item-spacing | `--klp-size-m` | `var(--klp-spacing-4)` |
| color-placeholder | `--klp-fg-subtle` | `var(--klp-color-gray-600)` |
| color-icon | `--klp-fg-subtle` | `var(--klp-color-gray-600)` |

### `breadcrumbs` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color-step-muted | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| color-step-active | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| color-separator | `--klp-fg-muted` | `var(--klp-color-gray-700)` |

> Token note: `--klp-fg-brand-contrasted` maps to a cross-file Figma variable (`VariableID:40b7e1fa462c3d2aeb9d0a5a3a52800ffe0c01ad/515:488`). Resolved to emerald-700 in klub. Adapter uses `--klp-fg-brand-contrasted` directly. (source: spec.json:tokenGaps[0])

## Examples

### Default mode — mixed actions with breadcrumbs

```tsx
import { Check, FilePlus, PenLine, Search } from 'lucide-react'
import { HeaderDesktop } from './HeaderDesktop'

/**
 * Example 1 — Default mode, mixed actions, breadcrumbs.
 * Demonstrates icon-only tertiary buttons + a secondary label button.
 */
export function HeaderDesktopDefault() {
  return (
    <HeaderDesktop
      title="Turnover Collection"
      actions={[
        { variant: 'tertiary', size: 'icon', children: <Check aria-hidden="true" />, 'aria-label': 'Validate', onClick: () => {} },
        { variant: 'tertiary', size: 'icon', children: <Search aria-hidden="true" />, 'aria-label': 'Search', onClick: () => {} },
        { variant: 'tertiary', size: 'icon', children: <PenLine aria-hidden="true" />, 'aria-label': 'Edit', onClick: () => {} },
        { variant: 'secondary', size: 'md', children: 'New', rightIcon: <FilePlus aria-hidden="true" />, onClick: () => {} },
      ]}
      breadcrumbs={[{ label: 'Home' }, { label: 'Turnover Collection' }]}
    />
  )
}
```

### Search-active mode

```tsx
/**
 * Example 2 — Search-active mode with custom placeholder.
 * Actions are ignored in this mode.
 */
export function HeaderDesktopSearch() {
  return (
    <HeaderDesktop
      features="search-active"
      title="Turnover Collection"
      searchPlaceholder="Input placeholder texte custom"
      breadcrumbs={[{ label: 'Home' }, { label: 'Turnover Collection' }]}
      onSearchChange={(value) => console.log('search:', value)}
    />
  )
}
```

### Minimal — title only

```tsx
/**
 * Example 3 — Title-only. No breadcrumbs, no actions.
 */
export function HeaderDesktopMinimal() {
  return <HeaderDesktop title="Dashboard" />
}
```

## Accessibility

- **Role**: `banner` — rendered as a native `<header>` element (implicit `role="banner"` per HTML spec). (source: spec.json:a11y.role)
- **Keyboard support**: `Tab`, `Enter`, `Space` — all action buttons are native `<button>` elements, focusable in DOM order. (source: spec.json:a11y.keyboardSupport)
- **ARIA notes**: Title is an `<h1>`. Breadcrumb trail renders as `<nav aria-label="Breadcrumb">`. Icon-only action buttons should carry an `aria-label` prop. Search input uses `aria-label="Search"`. (source: spec.json:a11y.notes)

## Dependencies

### klp components

- [BreadCrumbs](./_index_breadcrumbs.md) — `breadcrumbs` anatomy part: rendered via `<BreadCrumbs steps={...} showDropdownAffordance />`.
- [Button](./_index_button.md) — `action-button-tertiary` renders as `<Button variant="tertiary" size="icon">`; `action-button-secondary` renders as `<Button variant="secondary" size="md">`.
- [Input](./_index_input.md) — `search-input` renders as `<Input iconLeft={<Search />} placeholder={...} />` in the `search-active` variant.

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — asChild pattern (radixPrimitive, source: spec.json)
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition for all five layer variants
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `Search` icon used in the search input slot

### Token groups

- [Colors](../tokens/colors.md) — `--klp-fg-brand-contrasted`, `--klp-bg-invisible`, `--klp-border-invisible`, `--klp-bg-default`, `--klp-border-brand`, `--klp-fg-brand`, `--klp-border-default`, `--klp-fg-subtle`, `--klp-fg-muted`, `--klp-fg-default`
- [Radius](../tokens/radius.md) — `--klp-radius-l`
- [Spacing](../tokens/spacing.md) — `--klp-size-s`, `--klp-size-xs`, `--klp-size-m`, `--klp-size-2xs`
- [Typography](../tokens/typography.md) — `--klp-font-size-heading-h1`, `--klp-font-family-title`, `--klp-font-weight-title`

### Brands

- [klub](../brands/klub.md) — captureBrand; all reference screenshots captured under klub brand

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
