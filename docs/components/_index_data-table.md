---
title: Data Table
type: component
status: stable
category: data-display
captureBrand: wireframe
radixPrimitive: null
sources:
  - src/components/data-table/DataTable.tsx
dependencies:
  components: [pagination, table]
  externals: ["@tanstack/react-table", class-variance-authority, lucide-react]
  tokenGroups: [colors, spacing, typography]
  brands: [wireframe]
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# Data Table

Generic data-driven table built on `@tanstack/react-table`. Accepts a `columns[]` definition and a `data[]` array; renders column headers with optional sort controls, a body with custom cell renderers, an optional empty state, and optional pagination via the `<Pagination>` component.

> No Figma spec — this component was introduced as part of the table refactor and has no spec.json. Documentation is derived from source only.

## Anatomy

```
container  (<div> flex-col)
├── toolbar   (React.ReactNode slot) — Optional toolbar rendered above the table.
├── table     (<Table.Root>)          — Full-width table; delegates to Table primitives.
│   ├── caption  (<Table.Caption>)    — Optional accessible caption.
│   ├── header   (<Table.Header>)
│   │   └── row  (<Table.Row>)
│   │       └── head  (<Table.Head>) — Plain label, or sortable button with sort icon.
│   └── body     (<Table.Body>)
│       └── row  (<Table.Row>)        — variant="muted" for empty-state row.
│           └── cell  (<Table.Cell>) — flexRender output or empty-state span.
└── pagination (<Pagination>)         — Rendered only when pagination prop is set and pageCount > 1.
```

## Variants

No Figma variant axis. Behavioral modes are controlled via props:

| Behavior | Activated by |
|---|---|
| Sorting | Any column with `sortable: true` in `columns[]` |
| Pagination | `pagination={{ pageSize: N }}` prop |
| Custom cell rendering | `cell` function in column definition |
| Empty state | `emptyState` prop (default `"No data."`) |
| Toolbar slot | `toolbar` prop |

## API

### `DataTableProps<TData>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `ColumnDef<TData>[]` | — | Column definitions. See `ColumnDef` table below. |
| `data` | `TData[]` | — | Row data array. |
| `pagination` | `{ pageSize: number } \| false` | `false` | Enables pagination when set to an object. |
| `initialSorting` | `{ id: string; desc: boolean }[]` | `[]` | Initial sort state (uncontrolled). |
| `onSortingChange` | `(sorting: SortingState) => void` | — | Optional controlled sort callback. |
| `toolbar` | `React.ReactNode` | — | Content rendered above the table (search bar, filters, etc.). |
| `emptyState` | `React.ReactNode \| string` | `'No data.'` | Content shown when `data` is empty. |
| `caption` | `React.ReactNode` | — | Accessible caption forwarded to `<Table.Caption>`. |
| `className` | `string` | — | Classes applied to the outer container `<div>`. |
| `tableClassName` | `string` | — | Classes applied to `<Table.Root>`. |

### `ColumnDef<TData>`

| Field | Type | Default | Description |
|---|---|---|---|
| `accessorKey` | `Extract<keyof TData, string>` | — | Key on the data object to extract the cell value. |
| `id` | `string` | — | Explicit column id — required when `accessorKey` is absent (e.g. action columns). |
| `header` | `string \| ((ctx: HeaderContext) => ReactNode)` | — | Header content. |
| `cell` | `(ctx: CellContext) => ReactNode` | — | Cell renderer. |
| `sortable` | `boolean` | `false` | Enables click-to-sort on this column. |
| `sortingFn` | `SortingFn<TData>` | — | Custom sort comparator. Falls back to TanStack's default. |
| `width` | `string \| number` | — | Column width (CSS value or number → px). Applied inline on `th`/`td`. |

(source: src/components/data-table/DataTable.tsx)

## Tokens

Tokens are applied via the `Table` and `Pagination` sub-components. Direct tokens on the container:

| Element | Property | Token | Resolved (wireframe) |
|---|---|---|---|
| container | gap | `--klp-size-m` | `16px` |
| sort icon (active) | color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| sort icon (inactive) | color | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| sort button hover | color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| empty-state cell | color | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| empty-state cell | padding-y | `--klp-size-2xl` | `48px` |

All table-level tokens (row borders, cell padding, head styling) are inherited from `<Table>`. All pagination tokens are inherited from `<Pagination>`.

(source: src/components/data-table/DataTable.tsx)

## Examples

```tsx
import { Pencil } from 'lucide-react'
import { DataTable, type ColumnDef } from './DataTable'
import { Badge } from '@/components/badges'
import { Button } from '@/components/button'

type Mall = {
  id: string
  name: string
  country: string
  status: 'active' | 'pending'
}

const columns: ColumnDef<Mall>[] = [
  { accessorKey: 'name',    header: 'Name',    sortable: true },
  { accessorKey: 'country', header: 'Country', sortable: true },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        badgeType={row.original.status === 'active' ? 'success' : 'warning'}
        size="small"
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: () => (
      <Button variant="tertiary" size="icon" aria-label="Edit">
        <Pencil strokeWidth={1.5} />
      </Button>
    ),
  },
]

const data: Mall[] = [
  { id: '1', name: 'Les Halles',   country: 'France', status: 'active' },
  { id: '2', name: 'La Part-Dieu', country: 'France', status: 'active' },
  { id: '3', name: 'Rive Etoile',  country: 'France', status: 'pending' },
]

export function DataTableExample() {
  return <DataTable<Mall> columns={columns} data={data} />
}
```

(source: src/components/data-table/DataTable.example.tsx)

## Accessibility

- **Role:** Inherits from `<Table>` — semantic HTML `<table>` with `<thead>`, `<tbody>`, `<th>`, `<td>`.
- **Keyboard support:** Sortable column headers render as `<button type="button">` with descriptive `aria-label` (e.g. "Sort by Name, currently unsorted. Activate to sort ascending."). Sortable `<th>` elements carry `aria-sort="ascending | descending | none"`. Pagination controls are keyboard-navigable via `<Button>` + `<Pagination>` (see each component's a11y section).
- **ARIA notes:** Pass `caption` prop to provide an accessible table name. `emptyState` content is placed in a `<Table.Cell colSpan={columns.length}>` with `text-center`.

## Dependencies

### klp components

- [Table](./_index_table.md) — provides all HTML table primitive sub-components (`Table.Root`, `Table.Header`, `Table.Body`, `Table.Row`, `Table.Head`, `Table.Cell`, `Table.Caption`).
- [Pagination](./_index_pagination.md) — rendered in the footer when `pagination` prop is set and `pageCount > 1`.

### External libraries

- [@tanstack/react-table](https://www.npmjs.com/package/@tanstack/react-table) — headless table engine; provides `useReactTable`, row models, sorting, pagination state.
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — (indirect, via Table and Pagination sub-components).
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `ChevronUp`, `ChevronDown`, `ChevronsUpDown` icons for the sortable column header.

### Token groups

- [Colors](../tokens/colors.md) — `fg-default`, `fg-muted` for sort icon states and empty-state text.
- [Spacing](../tokens/spacing.md) — `size-m`, `size-2xl`, `size-2xs` for container gap and cell padding.
- [Typography](../tokens/typography.md) — inherited from Table and Pagination sub-components.

### Brands

- [wireframe](../brands/wireframe.md) — default brand; no Figma spec captured yet.

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/data-table/DataTable.tsx`](../../src/components/data-table/DataTable.tsx)
- Example: [`src/components/data-table/DataTable.example.tsx`](../../src/components/data-table/DataTable.example.tsx)
- Playground: [`playground/routes/data-table.tsx`](../../playground/routes/data-table.tsx)
- Registry: [`registry/data-table.json`](../../registry/data-table.json)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->

<!-- KLP:GAPS:BEGIN -->
## Gaps

No gaps recorded.
<!-- KLP:GAPS:END -->
