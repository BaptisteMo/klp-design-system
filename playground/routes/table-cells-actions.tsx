import { useEffect } from 'react'
import { Check } from 'lucide-react'
import { TableCellsActions } from '@/components/table-cells-actions'

const CAPTURE_BRAND = 'wireframe'

export function TableCellsActionsRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Table Cells / Actions — captured in {CAPTURE_BRAND}</h1>

      <div className="flex flex-col gap-4">

        {/* height=2 × actions=4 */}
        <div
          data-variant-id="height-2-actions-4"
          className="flex items-center justify-start rounded-klp-m border border-klp-border-default bg-klp-bg-subtle p-2"
        >
          <TableCellsActions
            height="2"
            actions={4}
            button1Icon={<Check aria-hidden="true" />}
            button1Label="Action 1"
            button2Icon={<Check aria-hidden="true" />}
            button2Label="Action 2"
            button3Icon={<Check aria-hidden="true" />}
            button3Label="Action 3"
            primaryLabel="Action"
            primaryRightIcon={<Check aria-hidden="true" />}
          />
        </div>

        {/* height=2 × actions=3 */}
        <div
          data-variant-id="height-2-actions-3"
          className="flex items-center justify-start rounded-klp-m border border-klp-border-default bg-klp-bg-subtle p-2"
        >
          <TableCellsActions
            height="2"
            actions={3}
            button1Icon={<Check aria-hidden="true" />}
            button1Label="Action 1"
            button2Icon={<Check aria-hidden="true" />}
            button2Label="Action 2"
            primaryLabel="Action"
            primaryRightIcon={<Check aria-hidden="true" />}
          />
        </div>

        {/* height=2 × actions=2 */}
        <div
          data-variant-id="height-2-actions-2"
          className="flex items-center justify-start rounded-klp-m border border-klp-border-default bg-klp-bg-subtle p-2"
        >
          <TableCellsActions
            height="2"
            actions={2}
            button1Icon={<Check aria-hidden="true" />}
            button1Label="Action 1"
            primaryLabel="Action"
            primaryRightIcon={<Check aria-hidden="true" />}
          />
        </div>

        {/* height=2 × actions=1 */}
        <div
          data-variant-id="height-2-actions-1"
          className="flex items-center justify-start rounded-klp-m border border-klp-border-default bg-klp-bg-subtle p-2"
        >
          <TableCellsActions
            height="2"
            actions={1}
            button1Icon={<Check aria-hidden="true" />}
            button1Label="Action 1"
          />
        </div>

        {/* height=1 × actions=4 */}
        <div
          data-variant-id="height-1-actions-4"
          className="flex items-center justify-start rounded-klp-m border border-klp-border-default bg-klp-bg-subtle p-2"
        >
          <TableCellsActions
            height="1"
            actions={4}
            button1Icon={<Check aria-hidden="true" />}
            button1Label="Action 1"
            button2Icon={<Check aria-hidden="true" />}
            button2Label="Action 2"
            button3Icon={<Check aria-hidden="true" />}
            button3Label="Action 3"
            primaryLabel="Action"
            primaryRightIcon={<Check aria-hidden="true" />}
          />
        </div>

        {/* height=1 × actions=3 */}
        <div
          data-variant-id="height-1-actions-3"
          className="flex items-center justify-start rounded-klp-m border border-klp-border-default bg-klp-bg-subtle p-2"
        >
          <TableCellsActions
            height="1"
            actions={3}
            button1Icon={<Check aria-hidden="true" />}
            button1Label="Action 1"
            button2Icon={<Check aria-hidden="true" />}
            button2Label="Action 2"
            primaryLabel="Action"
            primaryRightIcon={<Check aria-hidden="true" />}
          />
        </div>

        {/* height=1 × actions=2 */}
        <div
          data-variant-id="height-1-actions-2"
          className="flex items-center justify-start rounded-klp-m border border-klp-border-default bg-klp-bg-subtle p-2"
        >
          <TableCellsActions
            height="1"
            actions={2}
            button1Icon={<Check aria-hidden="true" />}
            button1Label="Action 1"
            primaryLabel="Action"
            primaryRightIcon={<Check aria-hidden="true" />}
          />
        </div>

        {/* height=1 × actions=1 */}
        <div
          data-variant-id="height-1-actions-1"
          className="flex items-center justify-start rounded-klp-m border border-klp-border-default bg-klp-bg-subtle p-2"
        >
          <TableCellsActions
            height="1"
            actions={1}
            button1Icon={<Check aria-hidden="true" />}
            button1Label="Action 1"
          />
        </div>

      </div>
    </div>
  )
}
