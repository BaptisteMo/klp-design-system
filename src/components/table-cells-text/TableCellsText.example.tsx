import { TableCellsText } from './TableCellsText'

export function TableCellsTextExample() {
  return (
    <table className="border-collapse">
      <tbody>
        {/* Compact height, 200px width, label only */}
        <tr>
          <TableCellsText
            height="1"
            width="200"
            text="24/04/2023"
          />
        </tr>
        {/* Relaxed height, 300px width, with subtitle */}
        <tr>
          <TableCellsText
            height="2"
            width="300"
            text="24/04/2023"
            showSubtitle
            subtitleText="Additional info"
          />
        </tr>
        {/* Compact height with checkbox slot */}
        <tr>
          <TableCellsText
            height="1"
            width="200"
            text="24/04/2023"
            checkbox
            checkboxChecked={false}
          />
        </tr>
        {/* Compact height with badge slot */}
        <tr>
          <TableCellsText
            height="1"
            width="300"
            text="24/04/2023"
            badge
            badgeLabel="Active"
          />
        </tr>
      </tbody>
    </table>
  )
}
