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
  { id: '1', name: 'Les Halles',      country: 'France',  status: 'active' },
  { id: '2', name: 'La Part-Dieu',    country: 'France',  status: 'active' },
  { id: '3', name: 'Rive Etoile',     country: 'France',  status: 'pending' },
]

export function DataTableExample() {
  return <DataTable<Mall> columns={columns} data={data} />
}
