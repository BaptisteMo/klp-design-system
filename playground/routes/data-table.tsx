import { useMemo, useState } from 'react'
import { Pencil, Search, Filter } from 'lucide-react'
import { DataTable, type ColumnDef } from '@/components/data-table'
import { Badge } from '@/components/badges'
import { Button } from '@/components/button'

type Mall = {
  id: string
  name: string
  country: string
  status: 'active' | 'pending'
  openedAt: string
}

const COUNTRIES = ['France', 'Spain', 'Italy', 'Belgium', 'Germany']
const STATUSES: Mall['status'][] = ['active', 'pending']

function makeMalls(n: number): Mall[] {
  return Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    name: `Mall ${String(i + 1).padStart(3, '0')}`,
    country: COUNTRIES[i % COUNTRIES.length],
    status: STATUSES[i % STATUSES.length],
    openedAt: `24/04/${2000 + (i % 25)}`,
  }))
}

export function DataTableRoute() {
  const [query, setQuery] = useState('')
  const allMalls = useMemo(() => makeMalls(50), [])
  const filtered = useMemo(
    () =>
      query.trim() === ''
        ? allMalls
        : allMalls.filter((m) =>
            m.name.toLowerCase().includes(query.trim().toLowerCase()) ||
            m.country.toLowerCase().includes(query.trim().toLowerCase())
          ),
    [allMalls, query]
  )

  const columns: ColumnDef<Mall>[] = [
    { accessorKey: 'name',     header: 'Name',      sortable: true, width: 200 },
    { accessorKey: 'country',  header: 'Country',   sortable: true, width: 150 },
    {
      accessorKey: 'status',
      header: 'Status',
      sortable: true,
      width: 120,
      cell: ({ row }) => (
        <Badge
          badgeType={row.original.status === 'active' ? 'success' : 'warning'}
          size="small"
        >
          {row.original.status}
        </Badge>
      ),
    },
    { accessorKey: 'openedAt', header: 'Opened at', sortable: true, width: 140 },
    {
      id: 'actions',
      header: '',
      width: 60,
      cell: () => (
        <Button variant="tertiary" size="icon" aria-label="Edit">
          <Pencil strokeWidth={1.5} />
        </Button>
      ),
    },
  ]

  const toolbar = (
    <div className="flex flex-row items-center gap-klp-size-s">
      <div className="flex items-center gap-klp-size-xs bg-klp-bg-subtle rounded-klp-l pl-klp-size-s pr-klp-size-s pt-klp-size-xs pb-klp-size-xs flex-1">
        <Search strokeWidth={1.5} className="h-[16px] w-[16px] text-klp-fg-muted" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or country"
          className="bg-transparent outline-none border-none text-klp-text-medium text-klp-fg-default flex-1"
        />
      </div>
      <Button variant="tertiary" size="md" rightIcon={<Filter strokeWidth={1.5} />}>
        Filters
      </Button>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Data Table — 50-row mock dataset</h1>
      <DataTable<Mall>
        columns={columns}
        data={filtered}
        pagination={{ pageSize: 8 }}
        toolbar={toolbar}
        emptyState={query ? `No malls match "${query}".` : 'No malls yet.'}
      />
    </div>
  )
}
