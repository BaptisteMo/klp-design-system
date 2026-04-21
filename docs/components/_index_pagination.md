---
title: Pagination
type: component
status: stable
category: navigation
captureBrand: klub
radixPrimitive: null
sources:
  - .klp/figma-refs/pagination/spec.json
  - src/components/pagination/Pagination.tsx
dependencies:
  components: ["button"]
  externals: ["lucide-react"]
  tokenGroups: ["colors", "spacing", "typography"]
  brands: ["klub"]
usedBy: []
created: 2026-04-20
updated: 2026-04-21
---

# Pagination

A page navigation bar with prev/next buttons, numbered page buttons, ellipsis markers, and an optional "X-Y of Z" count label. Page list is computed from `page`, `total`, `pageSize`, and `siblingCount`.

## Anatomy

```
nav (root)         — role=navigation, aria-label="Pagination"
├── label (span)   — "X-Y of Z" text; hidden when showLabel=false
├── prev-button (Button/tertiary/icon) — ChevronLeft; disabled at page 1
├── page-button[*] (Button/tertiary/icon) — One per visible page number
├── dots[*] (span) — Ellipsis marker between non-contiguous page ranges
└── next-button (Button/tertiary/icon) — ChevronRight; disabled at last page
```

## Variants

No variant axes — single layout. Page list shape adapts based on total pages and sibling count.

## Props usage

Extends `React.HTMLAttributes<HTMLElement>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `page` | **required** | `number` | — | 1-indexed current page |
| `pageSize` | **required** | `number` | — | Items per page (used for the "X-Y of Z" label) |
| `total` | **required** | `number` | — | Total number of items across all pages |
| `onPageChange` | **required** | `(page: number) => void` | — | Called with the new 1-indexed page number |
| `siblingCount` | optional | `number` | `1` | Number of pages shown on each side of the current page |
| `showLabel` | optional | `boolean` | `true` | Toggle the "X-Y of Z" label on the left |

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

## Accessibility

- **Role**: `navigation` (native `<nav>` with `aria-label="Pagination"`)
- **Keyboard support**: All buttons are focusable. Tab order: label → prev → page buttons → next.
- **ARIA notes**: Current page button has `aria-current="page"`. Prev/Next have `aria-label`. Dots markers are `aria-hidden`.

## Dependencies

### klp components

- [Button](./_index_button.md) — prev/next and numbered page buttons render as `<Button variant="tertiary" size="icon">`.

### External libraries

- [lucide-react](https://www.npmjs.com/package/lucide-react) — ChevronLeft, ChevronRight icons

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

### Brands

- [klub](../brands/klub.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/pagination/Pagination.tsx`](../../src/components/pagination/Pagination.tsx)
- Example: [`src/components/pagination/Pagination.example.tsx`](../../src/components/pagination/Pagination.example.tsx)
- Playground: [`playground/routes/pagination.tsx`](../../playground/routes/pagination.tsx)
- Registry: [`registry/pagination.json`](../../registry/pagination.json)
- Figma spec: [`.klp/figma-refs/pagination/spec.json`](../../.klp/figma-refs/pagination/spec.json)
- Reference screenshots: [`.klp/figma-refs/pagination/`](../../.klp/figma-refs/pagination/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
