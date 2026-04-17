import { useEffect } from 'react'
import { TableCellsCheckbox } from '@/components/table-cells-checkbox'

// Spec: .klp/figma-refs/table-cells-checkbox/spec.json
// captureBrand: 'klub'
const CAPTURE_BRAND = 'klub'

export function TableCellsCheckboxRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">
        Table Cells / Checkbox — captured in {CAPTURE_BRAND}
      </h1>

      <p className="text-sm text-klp-fg-muted">
        Token gaps (informational — Figma bindings not yet variable-bound):
        paddingLeft/Right 12px (expected --klp-size-s),
        paddingTop/Bottom 8px height=1 (expected --klp-size-xs),
        paddingTop/Bottom 12px height=2 (expected --klp-size-s),
        minHeight 36px (no --klp-size-* alias).
      </p>

      <table className="border-collapse">
        <tbody>
          {/* variant: height-1-width-48 */}
          <tr>
            <td
              className="border border-klp-border-default p-4 text-xs text-klp-fg-muted align-middle"
              style={{ width: 200 }}
            >
              height=1 / width=48
            </td>
            <td
              data-variant-id="height-1-width-48"
              className="border border-klp-border-default p-4"
            >
              <TableCellsCheckbox
                height="1"
                width="48"
                checkboxDefaultChecked={false}
                checkboxAriaLabel="Select row"
              />
            </td>
          </tr>

          {/* variant: height-2-width-default */}
          <tr>
            <td
              className="border border-klp-border-default p-4 text-xs text-klp-fg-muted align-middle"
              style={{ width: 200 }}
            >
              height=2 / width=default
            </td>
            <td
              data-variant-id="height-2-width-default"
              className="border border-klp-border-default p-4"
            >
              <TableCellsCheckbox
                height="2"
                width="default"
                checkboxDefaultChecked={false}
                checkboxAriaLabel="Select row"
              />
            </td>
          </tr>

          {/* variant: height-2-width-default-b (duplicate of height-2-width-default per spec note) */}
          <tr>
            <td
              className="border border-klp-border-default p-4 text-xs text-klp-fg-muted align-middle"
              style={{ width: 200 }}
            >
              height=2 / width=default-b
            </td>
            <td
              data-variant-id="height-2-width-default-b"
              className="border border-klp-border-default p-4"
            >
              <TableCellsCheckbox
                height="2"
                width="default"
                checkboxDefaultChecked={false}
                checkboxAriaLabel="Select row"
              />
            </td>
          </tr>

          {/* Interactive demo row — pre-checked and indeterminate */}
          <tr>
            <td
              className="border border-klp-border-default p-4 text-xs text-klp-fg-muted align-middle"
              style={{ width: 200 }}
            >
              checked (interactive)
            </td>
            <td className="border border-klp-border-default p-4">
              <TableCellsCheckbox
                height="2"
                width="default"
                checkboxDefaultChecked
                checkboxAriaLabel="Select row — checked"
              />
            </td>
          </tr>

          <tr>
            <td
              className="border border-klp-border-default p-4 text-xs text-klp-fg-muted align-middle"
              style={{ width: 200 }}
            >
              indeterminate (interactive)
            </td>
            <td className="border border-klp-border-default p-4">
              <TableCellsCheckbox
                height="2"
                width="default"
                checked="indeterminate"
                checkboxAriaLabel="Select all rows — indeterminate"
              />
            </td>
          </tr>

          <tr>
            <td
              className="border border-klp-border-default p-4 text-xs text-klp-fg-muted align-middle"
              style={{ width: 200 }}
            >
              disabled
            </td>
            <td className="border border-klp-border-default p-4">
              <TableCellsCheckbox
                height="2"
                width="default"
                disabled
                checkboxAriaLabel="Select row — disabled"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
