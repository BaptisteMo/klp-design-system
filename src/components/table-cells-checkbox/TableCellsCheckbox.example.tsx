import { TableCellsCheckbox } from '@/components/table-cells-checkbox'

/**
 * Basic usage — uncontrolled checkbox inside a table row.
 * The checkbox is interactive by default (checkboxDefaultChecked).
 */
export function TableCellsCheckboxExample() {
  return (
    <table>
      <tbody>
        {/* Height=2 (default), fluid width — uncontrolled, starts checked */}
        <tr>
          <TableCellsCheckbox
            height="2"
            width="default"
            checkboxDefaultChecked
            checkboxAriaLabel="Select row"
          />
        </tr>
        {/* Height=1 (compact), fixed 48px width — uncontrolled, unchecked */}
        <tr>
          <TableCellsCheckbox
            height="1"
            width="48"
            checkboxAriaLabel="Select row"
          />
        </tr>
      </tbody>
    </table>
  )
}
