import * as React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef as TanstackColumnDef,
  type SortingState,
  type CellContext,
  type HeaderContext,
  type SortingFn,
  type PaginationState,
  type OnChangeFn,
} from '@tanstack/react-table'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Table } from '@/components/table'
import { Pagination } from '@/components/pagination'

// ---------------------------------------------------------------------------
// klp ColumnDef — a small ergonomic wrapper over TanStack's native shape.
// ---------------------------------------------------------------------------
export interface ColumnDef<TData> {
  /** Key on the data object used to extract the cell value. */
  accessorKey?: Extract<keyof TData, string>
  /** Explicit id — required when accessorKey is absent (e.g. action columns). */
  id?: string
  /** Header content — string or render function with TanStack header context. */
  header?: string | ((ctx: HeaderContext<TData, unknown>) => React.ReactNode)
  /** Cell renderer — receives TanStack cell context (row, getValue, etc.). */
  cell?: (ctx: CellContext<TData, unknown>) => React.ReactNode
  /** Click-header-to-sort. Default false. */
  sortable?: boolean
  /** Custom sorting comparator. Falls back to TanStack's default. */
  sortingFn?: SortingFn<TData>
  /** Column width (CSS value or number → px). Applied inline on th/td. */
  width?: string | number
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  /** Enables pagination when given an object. Default false. */
  pagination?: { pageSize: number } | false
  /** Initial sort state (uncontrolled). */
  initialSorting?: { id: string; desc: boolean }[]
  /** Controlled sort callback (optional). */
  onSortingChange?: (sorting: SortingState) => void
  /** Toolbar slot rendered above the table. */
  toolbar?: React.ReactNode
  /** Content when data is empty. Default "No data." */
  emptyState?: React.ReactNode | string
  /** Accessible caption forwarded to <table>. */
  caption?: React.ReactNode
  /** Passed to the outer container div. */
  className?: string
  /** Passed to <Table.Root>. */
  tableClassName?: string
}

export function DataTable<TData>({
  columns,
  data,
  pagination = false,
  initialSorting = [],
  onSortingChange,
  toolbar,
  emptyState = 'No data.',
  caption,
  className,
  tableClassName,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [paginationState, setPaginationState] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: pagination !== false ? pagination.pageSize : 10,
  })

  // Map our ColumnDef to TanStack's ColumnDef. Memoize hasSortable alongside.
  const { tanstackColumns, hasSortable } = React.useMemo(() => {
    const mapped = columns.map((col) => ({
      accessorKey: col.accessorKey,
      id: col.id,
      header: col.header,
      cell: col.cell,
      enableSorting: col.sortable ?? false,
      sortingFn: col.sortingFn,
      meta: { width: col.width },
    } as TanstackColumnDef<TData>))
    const sortable = columns.some((c) => c.sortable)
    return { tanstackColumns: mapped, hasSortable: sortable }
  }, [columns])

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      onSortingChange?.(next)
      return next
    })
  }

  const table = useReactTable({
    data,
    columns: tanstackColumns,
    state: {
      ...(hasSortable && { sorting }),
      ...(pagination !== false && { pagination: paginationState }),
    },
    ...(hasSortable && { onSortingChange: handleSortingChange }),
    ...(pagination !== false && { onPaginationChange: setPaginationState }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(hasSortable && { getSortedRowModel: getSortedRowModel() }),
    ...(pagination !== false && { getPaginationRowModel: getPaginationRowModel() }),
  })

  const rows = table.getRowModel().rows
  const hasRows = rows.length > 0

  return (
    <div className={cn('flex flex-col gap-klp-size-m', className)}>
      {toolbar}
      <Table.Root className={tableClassName}>
        {caption && <Table.Caption>{caption}</Table.Caption>}
        <Table.Header>
          {table.getHeaderGroups().map((hg) => (
            <Table.Row key={hg.id}>
              {hg.headers.map((header) => {
                const meta = header.column.columnDef.meta as
                  | { width?: string | number }
                  | undefined
                const style = meta?.width !== undefined ? { width: meta.width } : undefined
                const canSort = header.column.getCanSort()
                if (!canSort) {
                  return (
                    <Table.Head key={header.id} style={style}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.Head>
                  )
                }
                const sortState = header.column.getIsSorted()
                const SortIcon =
                  sortState === 'asc'
                    ? ChevronUp
                    : sortState === 'desc'
                    ? ChevronDown
                    : ChevronsUpDown
                const headerLabel =
                  typeof header.column.columnDef.header === 'string'
                    ? header.column.columnDef.header
                    : header.column.id
                const ariaSort: 'ascending' | 'descending' | 'none' =
                  sortState === 'asc' ? 'ascending' : sortState === 'desc' ? 'descending' : 'none'
                const nextDirection =
                  sortState === 'asc' ? 'descending' : sortState === 'desc' ? 'unsorted' : 'ascending'
                const ariaLabel = `Sort by ${headerLabel}, currently ${
                  sortState === 'asc' ? 'ascending' : sortState === 'desc' ? 'descending' : 'unsorted'
                }. Activate to sort ${nextDirection}.`
                return (
                  <Table.Head key={header.id} style={style} aria-sort={ariaSort}>
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      aria-label={ariaLabel}
                      className="flex items-center gap-klp-size-2xs hover:text-klp-fg-default transition-colors"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <SortIcon
                        strokeWidth={1.5}
                        className={cn(
                          'h-[14px] w-[14px]',
                          sortState ? 'text-klp-fg-default' : 'text-klp-fg-muted'
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  </Table.Head>
                )
              })}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {hasRows ? (
            rows.map((row) => (
              <Table.Row key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as
                    | { width?: string | number }
                    | undefined
                  const style = meta?.width !== undefined ? { width: meta.width } : undefined
                  return (
                    <Table.Cell key={cell.id} style={style}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            ))
          ) : (
            <Table.Row variant="muted">
              <Table.Cell
                colSpan={columns.length}
                className="text-center text-klp-fg-muted py-klp-size-2xl"
              >
                {emptyState}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
      {pagination !== false && table.getPageCount() > 1 && (
        <Pagination
          page={paginationState.pageIndex + 1}
          pageSize={paginationState.pageSize}
          total={table.getFilteredRowModel().rows.length}
          onPageChange={(p) => setPaginationState((prev) => ({ ...prev, pageIndex: p - 1 }))}
        />
      )}
    </div>
  )
}
