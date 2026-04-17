import { Check } from 'lucide-react'
import { TableCellsActions } from './TableCellsActions'

export function TableCellsActionsExample() {
  return (
    <div className="flex flex-col gap-4">
      {/* Height 2 — 4 actions */}
      <TableCellsActions
        height="2"
        actions={4}
        button1Icon={<Check />}
        button1Label="Confirm"
        button2Icon={<Check />}
        button2Label="Approve"
        button3Icon={<Check />}
        button3Label="Verify"
        primaryLabel="Action"
        primaryRightIcon={<Check />}
      />

      {/* Height 1 — 2 actions */}
      <TableCellsActions
        height="1"
        actions={2}
        button1Icon={<Check />}
        button1Label="Confirm"
        primaryLabel="Action"
        primaryRightIcon={<Check />}
      />

      {/* Height 1 — 1 action (icon-only) */}
      <TableCellsActions
        height="1"
        actions={1}
        button1Icon={<Check />}
        button1Label="Confirm"
      />
    </div>
  )
}
