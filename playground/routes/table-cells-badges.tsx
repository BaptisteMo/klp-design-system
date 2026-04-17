import { useEffect } from 'react'
import { TableCellsBadges } from '@/components/table-cells-badges'

const CAPTURE_BRAND = 'klub'

export function TableCellsBadgesRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Table Cells / Badges — captured in {CAPTURE_BRAND}</h1>

      {/* type=badge, height=2 */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-klp-fg-muted">type=badge, height=2</h2>
        <table className="border-collapse">
          <tbody>
            <tr>
              <td
                data-variant-id="height-2-width-150-badge"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="badge" width="150-auto" height="2" label="Label" />
              </td>
              <td
                data-variant-id="height-2-width-100-badge"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="badge" width="100" height="2" label="Label" />
              </td>
              <td
                data-variant-id="height-2-width-200-badge"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="badge" width="200" height="2" label="Label" />
              </td>
              <td
                data-variant-id="height-2-width-300-badge"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="badge" width="300" height="2" label="Label" />
              </td>
              <td
                data-variant-id="height-2-width-400-badge"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="badge" width="400" height="2" label="Label" />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* type=badge, height=1 */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-klp-fg-muted">type=badge, height=1</h2>
        <table className="border-collapse">
          <tbody>
            <tr>
              <td
                data-variant-id="height-1-width-150-badge"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="badge" width="150-auto" height="1" label="Label" />
              </td>
              <td
                data-variant-id="height-1-width-100-badge"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="badge" width="100" height="1" label="Label" />
              </td>
              <td
                data-variant-id="height-1-width-200-badge"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="badge" width="200" height="1" label="Label" />
              </td>
              <td
                data-variant-id="height-1-width-300-badge"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="badge" width="300" height="1" label="Label" />
              </td>
              <td
                data-variant-id="height-1-width-400-badge"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="badge" width="400" height="1" label="Label" />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* type=status, height=1 */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-klp-fg-muted">type=status, height=1</h2>
        <table className="border-collapse">
          <tbody>
            <tr>
              <td
                data-variant-id="height-1-width-150-status"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="status" width="150-auto" height="1" />
              </td>
              <td
                data-variant-id="height-1-width-100-status"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="status" width="100" height="1" />
              </td>
              <td
                data-variant-id="height-1-width-square-status"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="status" width="square" height="1" />
              </td>
              <td
                data-variant-id="height-1-width-200-status"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="status" width="200" height="1" />
              </td>
              <td
                data-variant-id="height-1-width-300-status"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="status" width="300" height="1" />
              </td>
              <td
                data-variant-id="height-1-width-400-status"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="status" width="400" height="1" />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* type=status, height=2 */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-klp-fg-muted">type=status, height=2</h2>
        <table className="border-collapse">
          <tbody>
            <tr>
              <td
                data-variant-id="height-2-width-150-status"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="status" width="150-auto" height="2" />
              </td>
              <td
                data-variant-id="height-2-width-100-status"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="status" width="100" height="2" />
              </td>
              <td
                data-variant-id="height-2-width-square-status"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="status" width="square" height="2" />
              </td>
              <td
                data-variant-id="height-2-width-200-status"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="status" width="200" height="2" />
              </td>
              <td
                data-variant-id="height-2-width-300-status"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="status" width="300" height="2" />
              </td>
              <td
                data-variant-id="height-2-width-400-status"
                className="border border-klp-border-default p-0"
              >
                <TableCellsBadges type="status" width="400" height="2" />
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}
