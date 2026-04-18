# Design: Table redesign — primitives + DataTable + Pagination

**Date:** 2026-04-18
**Status:** Approved by user, ready for implementation plan
**Author:** Claude + Baptiste (brainstorming session)

---

## Context

The first table integration in the klp followed a Figma-atomic model: each cell shape in Figma (`table_cells/text`, `/badges`, `/actions`, `/empty`, `/checkbox`) was extracted into a dedicated React component (`<TableCellsText>`, `<TableCellsBadges>`, etc.), and rows were composed by gluing those together inside a `<TableRow>` shell.

This mirrored Figma 1-for-1 but is the wrong shape for a React design system. Tables in the real world are **data-driven** (schema + rows), not layout-driven (cells + styling). Modern React design systems (shadcn/ui, Radix Themes, Mantine) ship a pair: thin HTML primitives (`<Table>`, `<TableRow>`, `<TableCell>`) and an opinionated higher-level component that wires a headless data library (TanStack Table v8) on top.

The user's Figma file gained a **Table Template** section (node `115193:78915`) showing a realistic composite: search bar, tabs, filter button, column headers, rows with badges + dates + icon actions, and pagination `1-8 of 114 | 1 2 3 ... 6 >`. That template is the reference for this redesign.

## Goals

1. **Replace the atomic cells/row model with a data-driven model.** Consumers describe columns (schema) + pass rows, not glue cell components together.
2. **Ship two layers.** Thin primitives (`<Table.*>`) for power users who compose manually, plus a `<DataTable>` that pre-wires TanStack Table for sort + pagination + empty state + cell renderers.
3. **Split `<Pagination>` out** so it can be reused outside tables (listings, cards, search results).
4. **Match the Figma Template's visible features** on day 1: sort, pagination with ellipsis algorithm, custom cell rendering, toolbar slot, empty state.
5. **Delete the 6 Figma-atomic components** as part of the same commit. No transitional period.

## Non-goals (V1)

- Row selection (checkbox column + bulk action bar)
- Column visibility toggle
- Column resize / reorder
- Per-column filters
- Expandable rows
- Row virtualization
- Internal handling of the toolbar (search, tabs, filter button) — these are app-composed via the toolbar slot.

---

## File structure

### New

| Path | Responsibility |
|---|---|
| `src/components/table/Table.tsx` | Compound primitives: `Table.Root`, `Table.Header`, `Table.Body`, `Table.Footer`, `Table.Row`, `Table.Head`, `Table.Cell`, `Table.Caption`. Thin HTML wrappers with klp token classes. |
| `src/components/table/Table.example.tsx` | Manual composition example (static data). |
| `src/components/table/index.ts` | Re-exports compound. |
| `src/components/data-table/DataTable.tsx` | Typed generic `<DataTable<TData>>` using `@tanstack/react-table` internally. |
| `src/components/data-table/DataTable.example.tsx` | Example with mock data + sort + pagination. |
| `src/components/data-table/index.ts` | Re-exports + re-export of `ColumnDef` type. |
| `src/components/pagination/Pagination.tsx` | Standalone pagination component with ellipsis algorithm. |
| `src/components/pagination/Pagination.example.tsx` | Multiple examples (short list, long list, edge pages). |
| `src/components/pagination/index.ts` | Re-exports. |
| `playground/routes/table.tsx` | Playground route for primitives. |
| `playground/routes/data-table.tsx` | Playground route for DataTable with ~50-row mock dataset. |
| `playground/routes/pagination.tsx` | Playground route for Pagination. |
| `registry/{table,data-table,pagination}.json` | CLI distribution stubs (same shape as existing components). |

### Modified

| Path | Nature |
|---|---|
| `package.json` | Add `@tanstack/react-table` to `dependencies`. |
| `playground/App.tsx` | Register 3 new routes. Remove 6 old routes (`/table-row`, `/table-cells-*`). |
| `playground/routes/_index.tsx` | Same nav-link updates. |

### Deleted

| Path | Reason |
|---|---|
| `src/components/table-row/` | Replaced by `Table.Row` primitive + DataTable. |
| `src/components/table-cells-text/` | Replaced by the default cell renderer in DataTable; custom patterns go in `columns[].cell`. |
| `src/components/table-cells-badges/` | Replaced by users dropping `<Badge>` inside `columns[].cell`. |
| `src/components/table-cells-actions/` | Replaced by users dropping `<Button>` instances inside `columns[].cell`. |
| `src/components/table-cells-empty/` | Replaced by the empty-row rendered by DataTable when `data.length === 0`. |
| `src/components/table-cells-checkbox/` | Row selection is V2. If needed immediately, consumer drops `<Checkbox>` inside `columns[].cell`. |
| `playground/routes/{table-row,table-cells-*}.tsx` | Matching playground cleanup. |
| `registry/{table-row,table-cells-*}.json` | Registry cleanup. |
| `.klp/figma-refs/{table-row,table-cells-*}/` | **Kept** as historical Figma-reference artefacts. Not deleted. |

The corresponding entries in `klp-components.json` and `docs/components/_index_<name>.md` files are removed by a final documentalist SYNC pass.

---

## Section 1 — Primitives: `<Table>` compound

### Shape

```tsx
import { Table } from '@/components/table'

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Status</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>John</Table.Cell>
      <Table.Cell><Badge badgeType="success">Active</Badge></Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

### Sub-components

| Sub-component | Renders | Notes |
|---|---|---|
| `Table.Root` | `<table>` | `w-full border-collapse`. Forwards `<table>` attrs. |
| `Table.Header` | `<thead>` | Group for header rows. |
| `Table.Body` | `<tbody>` | Group for data rows. |
| `Table.Footer` | `<tfoot>` | Optional group for totals. |
| `Table.Row` | `<tr>` | `border-b border-klp-border-default transition-colors` + variant prop (`default` = `hover:bg-klp-bg-subtle`; `selected` = `bg-klp-bg-secondary-brand-low`; `muted` = `bg-klp-bg-subtle`). |
| `Table.Head` | `<th>` | `pt-klp-size-s pb-klp-size-s pl-klp-size-s pr-klp-size-s text-left font-klp-label font-klp-label-bold text-klp-fg-muted text-klp-text-medium`. |
| `Table.Cell` | `<td>` | `pt-klp-size-m pb-klp-size-m pl-klp-size-s pr-klp-size-s font-klp-body text-klp-fg-default text-klp-text-medium`. |
| `Table.Caption` | `<caption>` | Optional, mostly for a11y. |

All sub-components accept `className`, native HTML attrs, and `forwardRef`. Each is implemented as a tiny `forwardRef` function + (for Row) a single-axis `cva`.

### Token strategy

All styling uses klp `--klp-*` alias utilities — no hex, no hardcoded px other than border widths. No new tokens introduced.

---

## Section 2 — `<DataTable>` (opinionated layer)

### API

```tsx
import { DataTable, type ColumnDef } from '@/components/data-table'
import { Badge } from '@/components/badges'
import { Button } from '@/components/button'
import { Pencil } from 'lucide-react'

type Mall = { id: string; name: string; country: string; status: 'active' | 'pending' }

const columns: ColumnDef<Mall>[] = [
  { accessorKey: 'name',    header: 'Mall name', sortable: true },
  { accessorKey: 'country', header: 'Country',   sortable: true },
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
    cell: ({ row }) => (
      <Button variant="tertiary" size="icon" onClick={() => edit(row.original.id)}>
        <Pencil />
      </Button>
    ),
  },
]

<DataTable
  columns={columns}
  data={malls}
  pagination={{ pageSize: 8 }}
  toolbar={<MyToolbarWithSearchTabsFilter />}
  emptyState="No malls match your filters."
/>
```

### `ColumnDef<TData>` shape

A light wrapper around TanStack's own `ColumnDef` with a few klp ergonomics:

```ts
export interface ColumnDef<TData> {
  /** Key on the data object (shorthand to extract the cell value). */
  accessorKey?: keyof TData & string
  /** Explicit id — required when accessorKey is absent (e.g. action columns). */
  id?: string
  /** Column header: string or render function. */
  header?: string | ((ctx: HeaderContext<TData>) => ReactNode)
  /** Cell renderer. Default: renders the accessor value as text. */
  cell?: (ctx: CellContext<TData>) => ReactNode
  /** Make this column sortable. Click header to cycle asc → desc → none. */
  sortable?: boolean
  /** Custom sorting comparator (falls back to TanStack default). */
  sortingFn?: SortingFn<TData>
  /** Column width (CSS value or number → px). Applied inline on the th/td. */
  width?: string | number
}
```

Internally, `DataTable` converts our `ColumnDef<TData>[]` to TanStack's native `ColumnDef` shape by adding `enableSorting: col.sortable ?? false`.

### `DataTable<TData>` props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `columns` | `ColumnDef<TData>[]` | — | Required |
| `data` | `TData[]` | — | Required |
| `pagination` | `{ pageSize: number } \| false` | `false` | If an object, enables pagination with that page size |
| `initialSorting` | `{ id: string; desc: boolean }[]` | `[]` | Initial sort state (uncontrolled) |
| `onSortingChange` | `(state) => void` | — | Controlled sort (optional) |
| `toolbar` | `ReactNode` | — | Slot rendered above the table |
| `emptyState` | `ReactNode \| string` | `"No data."` | Rendered when `data.length === 0` |
| `caption` | `ReactNode` | — | Accessible caption for the `<table>` |
| `className` | `string` | — | Passed to the outer container div |
| `tableClassName` | `string` | — | Passed to `<Table.Root>` |

### Rendered structure

```
<div> (DataTable root, flex flex-col gap-klp-size-m)
  ├─ {toolbar}                                       ← only if provided
  ├─ <Table.Root>
  │   ├─ <Table.Header>                              ← table.getHeaderGroups()
  │   │   └─ <Table.Row> + <Table.Head>×N            ← sort button when column.sortable
  │   └─ <Table.Body>
  │       ├─ data.length === 0
  │       │   └─ <Table.Row><Table.Cell colSpan={columns.length}>{emptyState}</Table.Cell></Table.Row>
  │       └─ data.length > 0
  │           └─ table.getRowModel().rows.map(row => (
  │                <Table.Row>
  │                  row.getVisibleCells().map(cell => (
  │                    <Table.Cell>{flexRender(col.cell, cellContext)}</Table.Cell>
  │                  ))
  │                </Table.Row>
  │             ))
  └─ <Pagination>                                    ← only if pagination !== false, total > pageSize
```

### Sort UI (on sortable columns)

The `<Table.Head>` content becomes a `<button type="button">` that calls `column.toggleSorting()` on click. A sort indicator icon is appended:

- unsorted → `ChevronsUpDown` (muted)
- asc → `ChevronUp`
- desc → `ChevronDown`

Icons from `lucide-react`, color follows `text-klp-fg-muted` for unsorted and `text-klp-fg-default` for active directions.

### Empty state

Rendered as a single row spanning all columns, centered, with `text-klp-fg-muted text-klp-text-medium`. If `emptyState` is a string, wrap in a `<span>`. If ReactNode, render as-is.

### Internals

- `useReactTable({ data, columns: mappedColumns, state, getCoreRowModel, getSortedRowModel?, getPaginationRowModel? })`
- `getSortedRowModel` included only when at least one column has `sortable: true`
- `getPaginationRowModel` included only when `pagination` prop is truthy
- `flexRender` used for all cell + header rendering
- Internal state via `useState` for `sorting` (if uncontrolled) and `pagination`
- No external state management dep, no Context

### Typing

`DataTable` is a generic function component. Usage:

```tsx
<DataTable<Mall> columns={columns} data={malls} ... />
```

Type inference works from `data` prop in most real-world cases, so `<DataTable columns={...} data={malls} />` is usually enough.

---

## Section 3 — `<Pagination>` (standalone)

### API

```tsx
<Pagination
  page={1}
  pageSize={8}
  total={114}
  onPageChange={(p) => setPage(p)}
  siblingCount={1}
  showLabel
/>
```

### Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `page` | `number` | — | 1-indexed current page (required) |
| `pageSize` | `number` | — | Items per page (required, used for the label) |
| `total` | `number` | — | Total items across all pages (required) |
| `onPageChange` | `(page: number) => void` | — | Required |
| `siblingCount` | `number` | `1` | Pages shown each side of the current page |
| `showLabel` | `boolean` | `true` | Toggles the "X-Y of Z" label |
| `className` | `string` | — | |

### Page-list algorithm

Pure function `buildPageList(page, pageCount, siblingCount): (number | 'dots')[]`.

Cases:

- `pageCount <= 7` (or `siblingCount * 2 + 5`) → return `[1, 2, ..., pageCount]` (no ellipsis needed)
- Current page close to start (page ≤ siblingCount + 3) → `[1, 2, ..., page + siblingCount, 'dots', pageCount]`
- Current page close to end → `[1, 'dots', pageCount - siblingCount - 2, ..., pageCount]`
- Current page in middle → `[1, 'dots', page - siblingCount, ..., page + siblingCount, 'dots', pageCount]`

### Rendered structure

```
<nav role="navigation" aria-label="Pagination" className="flex items-center gap-klp-size-xs">
  {showLabel && <span className="text-klp-text-small text-klp-fg-muted">{start}-{end} of {total}</span>}
  <Button variant="tertiary" size="icon" disabled={page === 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page"><ChevronLeft /></Button>
  {pageList.map(item =>
    item === 'dots'
      ? <span aria-hidden className="text-klp-fg-muted px-klp-size-xs">…</span>
      : <Button
          variant="tertiary"
          size="icon"
          aria-current={item === page ? 'page' : undefined}
          className={item === page ? 'bg-klp-bg-inset border-klp-border-brand' : ''}
          onClick={() => onPageChange(item)}
        >{item}</Button>
  )}
  <Button variant="tertiary" size="icon" disabled={page === pageCount} onClick={() => onPageChange(page + 1)} aria-label="Next page"><ChevronRight /></Button>
</nav>
```

Start / end of label are derived as `start = (page - 1) * pageSize + 1`, `end = Math.min(page * pageSize, total)`.

### A11y

- `role="navigation"` + `aria-label="Pagination"` on the wrapper
- `aria-current="page"` on the active page button
- Prev/next buttons have `aria-label` + are `disabled` at the edges

---

## Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-table": "^8.x"
  }
}
```

Pinned to a caret range on the latest v8. ~15 KB gzip. TypeScript types are first-class (no `@types/*` needed).

---

## Token validation

Since these 3 components are not produced via `/klp-build-component`, there's no `.klp/figma-refs/<name>/spec.json`. The token validator (`scripts/validate-tokens.mjs`) requires a spec to run — so:

- Skip spec-based validation for these components.
- The validator is still useful for regression: run `pnpm validate:tokens:all`. It will iterate the entries in `klp-components.json`; entries with `spec: null` are skipped gracefully by the script (add this early-return if not already present).

Add to the script (if needed):

```js
if (!spec) {
  return { component: componentName, passed: true, radixPrimitive: null,
           checks: { tokens: { passed: true, ... }, reuse: { passed: true, ... }, icons: { passed: true, ... } },
           mismatches: [], warnings: [] }
}
```

(This defensive skip may already exist; if so, no change needed.)

---

## Documentation

After implementation:

1. Dispatch `documentalist` with `operation: SYNC` (full recompute).
2. Expected outcome:
   - `klp-components.json` entries added for `table`, `data-table`, `pagination` (with `spec: null`, `radixPrimitive: null`, `externals` containing `@tanstack/react-table` for data-table).
   - Entries for `table-row`, `table-cells-*` removed.
   - `docs/components/_index_{table,data-table,pagination}.md` created.
   - `docs/components/_index_{table-row,table-cells-*}.md` removed.
   - `docs/gaps.md` regenerated — the table-cells-* gaps (min-height / padding literals) disappear; the 2 pre-existing gaps on action-sheet-menu + list remain.
   - `docs/index.md` updated.

---

## Verification

1. **Typecheck:** `pnpm typecheck` clean.
2. **Playground smoke:** open `http://localhost:5173/data-table`. Verify: mock dataset of ~50 rows renders; clicking a sortable header toggles sort (asc → desc → unsorted with visual indicator); pagination pager shows correct label + correct page-list with ellipsis; clicking page 3 navigates; prev/next work; empty state shows when filter narrows to 0 rows.
3. **Primitives:** open `http://localhost:5173/table`. Verify a static manual composition renders correctly (headers, rows, hover style).
4. **Pagination:** open `http://localhost:5173/pagination`. Verify short-list (no ellipsis), long-list middle (ellipsis both sides), long-list edges (one ellipsis).
5. **Old routes gone:** `/table-row`, `/table-cells-*` return to playground index (no orphan nav links).
6. **Token validator:** `pnpm validate:tokens:all` passes across all current components. New ones are skipped gracefully (no spec).
7. **Docs:** `docs/components/_index_data-table.md` exists and references `@tanstack/react-table` as external. `docs/gaps.md` has fewer entries than before (table-cells-* entries gone).

### Acceptance criteria

- 3 new components importable and typed; `<DataTable<Mall>>` inference works end-to-end.
- Figma Template's visible features (sort headers, pagination with ellipsis, custom cell renderers, toolbar slot, empty state) work in the playground.
- 6 old components completely removed from source, playground, registry, klp-components.json, and docs.
- `@tanstack/react-table` added as a direct dep.
- All existing components still compile + pass validator.

---

## Out of scope (V2 ideas)

1. **Row selection** — TanStack has `getSelectedRowModel` / `rowSelection` state; would require a checkbox column renderer + a `selectable` prop on DataTable + optional `onSelectionChange` callback. Non-trivial UI work for the bulk-action bar.
2. **Column visibility toggle** — standard TanStack feature; just an opt-in prop + a dropdown menu UI (would need a `DropdownMenu` primitive which we don't have yet).
3. **Per-column filters** — TanStack `getFilteredRowModel` + filter-input slot per column. Requires header-cell API to accept a filter renderer.
4. **Resizable / reorderable columns** — TanStack column sizing feature. Nice-to-have but pulls in drag-drop, out of scope.
5. **Virtualized rows** — for very long lists, plug in `@tanstack/react-virtual`. Only matters at 1000+ rows.
6. **Expandable rows** — `getExpandedRowModel` + expand column + sub-row rendering.
7. **Controlled pagination from the outside** — currently `pagination` prop is `{ pageSize }` (uncontrolled). Could add `state.pagination` + `onPaginationChange` for server-side pagination.

---

## Critical files (paths)

- `/Users/morillonbaptiste/klp-design-system/src/components/table/Table.tsx` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/src/components/table/index.ts` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/src/components/table/Table.example.tsx` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/src/components/data-table/DataTable.tsx` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/src/components/data-table/index.ts` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/src/components/data-table/DataTable.example.tsx` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/src/components/pagination/Pagination.tsx` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/src/components/pagination/index.ts` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/src/components/pagination/Pagination.example.tsx` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/playground/routes/table.tsx` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/playground/routes/data-table.tsx` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/playground/routes/pagination.tsx` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/registry/{table,data-table,pagination}.json` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/package.json` (MODIFY — add `@tanstack/react-table`)
- `/Users/morillonbaptiste/klp-design-system/playground/App.tsx` (MODIFY)
- `/Users/morillonbaptiste/klp-design-system/playground/routes/_index.tsx` (MODIFY)
- `/Users/morillonbaptiste/klp-design-system/src/components/table-row/` (DELETE recursively)
- `/Users/morillonbaptiste/klp-design-system/src/components/table-cells-{text,badges,actions,empty,checkbox}/` (DELETE recursively)
- `/Users/morillonbaptiste/klp-design-system/playground/routes/{table-row,table-cells-*}.tsx` (DELETE)
- `/Users/morillonbaptiste/klp-design-system/registry/{table-row,table-cells-*}.json` (DELETE)

The documentalist SYNC pass rewrites `klp-components.json`, `docs/components/_index_*.md`, `docs/index.md`, `docs/gaps.md`, and `docs/log.md` — same paths and conventions as usual.
