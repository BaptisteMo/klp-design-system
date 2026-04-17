import { useEffect } from 'react'
import { TableCellsEmpty } from '@/components/table-cells-empty'

const CAPTURE_BRAND = 'wireframe'

export function TableCellsEmptyRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? CAPTURE_BRAND
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Table Cells / Empty — captured in {CAPTURE_BRAND}</h1>

      <div className="overflow-x-auto">
        <table className="border-collapse">
          <tbody>
            {/* Row 1: height=1 variants side by side */}
            <tr>
              <td className="pr-4 text-sm text-klp-fg-muted align-middle">height-1-width-48</td>
              <td className="p-2">
                <div data-variant-id="height-1-width-48" className="inline-flex items-center justify-center rounded-klp-m border border-klp-border-default p-2">
                  <table className="border-collapse">
                    <tbody>
                      <tr>
                        <TableCellsEmpty height="1" width="48" />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>

            <tr>
              <td className="pr-4 text-sm text-klp-fg-muted align-middle">height-1-width-empty-switch</td>
              <td className="p-2">
                <div data-variant-id="height-1-width-empty-switch" className="inline-flex items-center justify-center rounded-klp-m border border-klp-border-default p-2">
                  <table className="border-collapse">
                    <tbody>
                      <tr>
                        <TableCellsEmpty height="1" width="empty-switch" />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>

            <tr>
              <td className="pr-4 text-sm text-klp-fg-muted align-middle">height-2-width-default</td>
              <td className="p-2">
                <div data-variant-id="height-2-width-default" className="inline-flex items-center justify-center rounded-klp-m border border-klp-border-default p-2">
                  <table className="border-collapse">
                    <tbody>
                      <tr>
                        <TableCellsEmpty height="2" width="default" />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
