import { useState } from 'react'
import { Pagination } from '@/components/pagination'

export function PaginationRoute() {
  const [short, setShort] = useState(1)
  const [middle, setMiddle] = useState(7)
  const [edge, setEdge] = useState(15)

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-xl font-semibold">Pagination</h1>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-klp-label font-klp-label-bold text-klp-fg-muted">
          Short list (5 pages, no ellipsis)
        </h2>
        <Pagination page={short} pageSize={10} total={50} onPageChange={setShort} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-klp-label font-klp-label-bold text-klp-fg-muted">
          Long list, middle page (ellipsis both sides)
        </h2>
        <Pagination page={middle} pageSize={8} total={114} onPageChange={setMiddle} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-klp-label font-klp-label-bold text-klp-fg-muted">
          Long list, last page (ellipsis on left only)
        </h2>
        <Pagination page={edge} pageSize={8} total={114} onPageChange={setEdge} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-klp-label font-klp-label-bold text-klp-fg-muted">
          Empty (total = 0)
        </h2>
        <Pagination page={1} pageSize={10} total={0} onPageChange={() => {}} />
      </section>
    </div>
  )
}
