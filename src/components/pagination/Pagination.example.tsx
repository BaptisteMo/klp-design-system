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
