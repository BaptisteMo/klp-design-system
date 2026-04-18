---
title: Pagination
type: component
status: stable
category: navigation
captureBrand: wireframe
radixPrimitive: null
sources:
  - src/components/pagination/Pagination.tsx
dependencies:
  components: [button]
  externals: [class-variance-authority, lucide-react]
  tokenGroups: [colors, spacing, typography]
  brands: [wireframe]
usedBy: [data-table]
created: 2026-04-17
updated: 2026-04-17
---

# Pagination

Standalone page navigator with ellipsis algorithm. Renders a label showing the current range ("X–Y of Z"), prev/next chevron buttons, and a page number strip with smart ellipsis (`…`) when there are many pages. Reusable outside tables.

> No Figma spec — this component was introduced as part of the table refactor and has no spec.json. Documentation is derived from source only.

## Anatomy

```
nav  (<nav> role="navigation" aria-label="Pagination")
├── label  (<span>)    — "X–Y of Z" range label. Hidden when showLabel=false.
├── prev   (<Button>)  — Prev-page icon button (tertiary/icon, ChevronLeft). Disabled on page 1.
├── pages  (fragment)  — Page buttons and ellipsis spans
│   ├── page-button  (<Button>)  — Per page number; aria-current="page" on active page.
│   └── dots         (<span aria-hidden="true">) — Ellipsis marker between page ranges.
└── next   (<Button>)  — Next-page icon button (tertiary/icon, ChevronRight). Disabled on last page.
```

## Variants

No variant axis. The only configurable behaviors are controlled via props (`siblingCount`, `showLabel`). Visual state is reflected by the active page button receiving `bg-klp-bg-inset border-klp-border-brand` classes.

## API

`PaginationProps` extends `React.HTMLAttributes<HTMLElement>`. All native `<nav>` attributes are forwarded.

| Prop | Type | Default | Description |
|---|---|---|---|
| `page` | `number` | — | Current 1-indexed page number. |
| `pageSize` | `number` | — | Items per page — used to compute the "X–Y of Z" label. |
| `total` | `number` | — | Total item count across all pages. |
| `onPageChange` | `(page: number) => void` | — | Callback called with the new 1-indexed page number. |
| `siblingCount` | `number` | `1` | Number of page buttons shown on each side of the current page. |
| `showLabel` | `boolean` | `true` | Whether to show the "X–Y of Z" range label on the left. |
| `className` | `string` | — | Additional classes merged via `cn()` on the `<nav>`. |

### Exported utility

`buildPageList(page, pageCount, siblingCount): (number | 'dots')[]` — the ellipsis algorithm is exported for testing and custom pagination UI. It returns an array of page numbers interspersed with `'dots'` markers.

(source: src/components/pagination/Pagination.tsx)

## Tokens

Tokens are applied via the `Button` sub-component for prev/next/page controls, and via inline Tailwind utilities for the active-page highlight and the label.

| Element | Property | Token | Resolved (wireframe) |
|---|---|---|---|
| label | color | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| label | margin-right | `--klp-size-s` | `12px` |
| nav | gap | `--klp-size-xs` | `8px` |
| active page button | background | `--klp-bg-inset` | `var(--klp-color-gray-200)` |
| active page button | border-color | `--klp-border-brand` | `var(--klp-color-gray-500)` |
| dots | color | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| dots | padding-x | `--klp-size-xs` | `8px` |

(source: src/components/pagination/Pagination.tsx)

## Examples

```tsx
import { useState } from 'react'
import { Pagination } from './Pagination'

export function PaginationExample() {
  const [page, setPage] = useState(1)
  return (
    <div className="flex flex-col gap-4">
      <Pagination page={page} pageSize={8} total={114} onPageChange={setPage} />
    </div>
  )
}
```

(source: src/components/pagination/Pagination.example.tsx)

## Accessibility

- **Role:** `navigation` via `<nav role="navigation" aria-label="Pagination">`.
- **Keyboard support:** All interactive controls are `<Button>` instances — fully keyboard-navigable via Tab/Enter/Space.
- **ARIA notes:** The prev button carries `aria-label="Previous page"` and the next button `aria-label="Next page"`. The active page button carries `aria-current="page"`. Ellipsis spans are `aria-hidden="true"`.

## Dependencies

### klp components

- [Button](./_index_button.md) — renders the prev, next, and per-page-number interactive controls as `variant="tertiary" size="icon"` buttons.

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — (indirect, via Button).
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `ChevronLeft` and `ChevronRight` icons for the prev/next buttons.

### Token groups

- [Colors](../tokens/colors.md) — `fg-muted`, `bg-inset`, `border-brand` for label, active page, and ellipsis.
- [Spacing](../tokens/spacing.md) — `size-xs`, `size-s` for gaps, padding, and margin.
- [Typography](../tokens/typography.md) — `text-klp-text-small` on the range label.

### Brands

- [wireframe](../brands/wireframe.md) — default brand; no Figma spec captured yet.

## Used by

- [Data Table](./_index_data-table.md) — embedded in the DataTable footer when `pagination` prop is set; driven by TanStack's `paginationState`.

## Files

- Source: [`src/components/pagination/Pagination.tsx`](../../src/components/pagination/Pagination.tsx)
- Example: [`src/components/pagination/Pagination.example.tsx`](../../src/components/pagination/Pagination.example.tsx)
- Playground: [`playground/routes/pagination.tsx`](../../playground/routes/pagination.tsx)
- Registry: [`registry/pagination.json`](../../registry/pagination.json)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->

<!-- KLP:GAPS:BEGIN -->
## Gaps

No gaps recorded.
<!-- KLP:GAPS:END -->
