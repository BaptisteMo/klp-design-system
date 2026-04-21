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
  components: ["pagination", "table"]
  externals: ["@tanstack/react-table", "class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "typography"]
  brands: ["wireframe"]
usedBy: []
created: 2026-04-17
updated: 2026-04-21
---

# Data Table

Generic data-driven table built on @tanstack/react-table. Accepts columns[] + data and renders sort + pagination + custom cells. Uses `<Table>` primitives internally.

## Anatomy

```
div (container)
├── toolbar    (slot) — Optional node rendered above the table
├── Table.Root (table)
│   ├── Table.Header — Sort-enabled th buttons
│   └── Table.Body  — Rows from data[], or emptyState row
└── Pagination (nav)  — Only when pagination prop is set and pageCount > 1
```

## Variants

No variant axes — this is a data-driven utility component.

## Props usage

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `columns` | **required** | `ColumnDef<TData>[]` | — | Column definitions |
| `data` | **required** | `TData[]` | — | Row data |
| `pagination` | optional | `{ pageSize: number } \| false` | `false` | Enables pagination when given an object. Default false. |
| `initialSorting` | optional | `{ id: string; desc: boolean }[]` | `[]` | Initial sort state (uncontrolled). |
| `onSortingChange` | optional | `(sorting: SortingState) => void` | — | Controlled sort callback (optional). |
| `toolbar` | optional | `React.ReactNode` | — | Toolbar slot rendered above the table. |
| `emptyState` | optional | `React.ReactNode \| string` | `"No data."` | Content when data is empty. Default "No data." |
| `caption` | optional | `React.ReactNode` | — | Accessible caption forwarded to `<table>`. |
| `className` | optional | `string` | — | Passed to the outer container div. |
| `tableClassName` | optional | `string` | — | Passed to `<Table.Root>`. |

## Examples

```tsx
import { Pencil } from 'lucide-react'
import { DataTable, type ColumnDef } from './DataTable'
import { Badge } from '@/components/badges'
import { Button } from '@/components/button'

type Mall = { id: string; name: string; country: string; status: 'active' | 'pending' }

const columns: ColumnDef<Mall>[] = [
  { accessorKey: 'name',    header: 'Name',    sortable: true },
  { accessorKey: 'country', header: 'Country', sortable: true },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge badgeType={row.original.status === 'active' ? 'success' : 'warning'} size="small">
        {row.original.status}
      </Badge>
    ),
  },
]

export function DataTableExample() {
  const data: Mall[] = [
    { id: '1', name: 'Mall A', country: 'France', status: 'active' },
    { id: '2', name: 'Mall B', country: 'Spain',  status: 'pending' },
  ]
  return <DataTable columns={columns} data={data} pagination={{ pageSize: 10 }} />
}
```

## Accessibility

- **Role**: Standard `<table>` semantics via Table primitives.
- **Keyboard support**: Sortable column headers are `<button>` elements — `Enter`/`Space` toggles sort direction.
- **ARIA notes**: Sortable `<th>` elements carry `aria-sort`. Sort toggle buttons have descriptive `aria-label` (e.g. "Sort by Name, currently unsorted. Activate to sort ascending.").

## Dependencies

### klp components

- [Pagination](./_index_pagination.md) — Used when `pagination` prop is set and page count exceeds 1.
- [Table (primitives)](./_index_table.md) — All table layout uses Table.Root/Header/Body/Row/Head/Cell primitives.

### External libraries

- [@tanstack/react-table](https://www.npmjs.com/package/@tanstack/react-table) — Core table engine (sorting, pagination, filtering)
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — (available via peer imports)
- [lucide-react](https://www.npmjs.com/package/lucide-react) — ChevronUp, ChevronDown, ChevronsUpDown sort icons

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

### Brands

- [wireframe](../brands/wireframe.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/data-table/DataTable.tsx`](../../src/components/data-table/DataTable.tsx)
- Example: [`src/components/data-table/DataTable.example.tsx`](../../src/components/data-table/DataTable.example.tsx)
- Playground: [`playground/routes/data-table.tsx`](../../playground/routes/data-table.tsx)
- Registry: [`registry/data-table.json`](../../registry/data-table.json)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
