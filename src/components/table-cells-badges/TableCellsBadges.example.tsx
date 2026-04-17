import { TableCellsBadges } from '@/components/table-cells-badges'

export function TableCellsBadgesExample() {
  return (
    <table>
      <tbody>
        <tr>
          {/* type=badge: branded text pill */}
          <TableCellsBadges type="badge" width="200" height="1" label="In Progress" />
          {/* type=status: info icon-only pill */}
          <TableCellsBadges type="status" width="200" height="1" />
        </tr>
      </tbody>
    </table>
  )
}
