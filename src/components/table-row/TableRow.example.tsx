import { TableRow } from './TableRow'

export function TableRowExample() {
  return (
    <table className="w-full border-collapse">
      <tbody>
        {/* Default row */}
        <TableRow
          variant="default"
          badgeLabel="Pending"
          primaryText="John Doe"
          secondaryText="john@example.com"
        />

        {/* Hover state */}
        <TableRow
          variant="default-hover"
          badgeLabel="Active"
          primaryText="Jane Smith"
          secondaryText="jane@example.com"
        />

        {/* Floating action on */}
        <TableRow
          variant="floating-action-on"
          badgeLabel="Active"
          primaryText="Alex Johnson"
          secondaryText="alex@example.com"
        />

        {/* Empty state */}
        <TableRow
          variant="empty"
          emptyMessage="No records found."
          colSpan={4}
        />
      </tbody>
    </table>
  )
}
