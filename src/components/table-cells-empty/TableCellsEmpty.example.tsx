import { TableCellsEmpty } from './TableCellsEmpty'

export function TableCellsEmptyExample() {
  return (
    <table>
      <tbody>
        <tr>
          {/* height=1, width=default — compact spacer cell */}
          <TableCellsEmpty height="1" width="default" />

          {/* height=1, width=48 — fixed 48px spacer */}
          <TableCellsEmpty height="1" width="48" />

          {/* height=1, width=empty-switch — switch column spacer */}
          <TableCellsEmpty height="1" width="empty-switch" />

          {/* height=2, width=default — relaxed spacer cell */}
          <TableCellsEmpty height="2" width="default" />
        </tr>
      </tbody>
    </table>
  )
}
