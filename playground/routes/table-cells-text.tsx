import { useEffect } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { TableCellsText } from '@/components/table-cells-text'

const CAPTURE_BRAND = 'wireframe'

export function TableCellsTextRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">
        Table Cells / Text — captured in {CAPTURE_BRAND}
      </h1>

      {/* ------------------------------------------------------------------ */}
      {/* height=1 variants */}
      {/* ------------------------------------------------------------------ */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-klp-label font-klp-label-bold text-klp-fg-muted">
          height=1 (compact / 36px)
        </h2>
        <table className="border-collapse">
          <tbody>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-20">w-100</td>
              <td
                data-variant-id="height-1-w100-start"
                className="border border-klp-border-default"
              >
                <TableCellsText height="1" width="100" text="24/04/2023" />
              </td>
            </tr>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-20">w-150</td>
              <td
                data-variant-id="height-1-w150-start"
                className="border border-klp-border-default"
              >
                <TableCellsText height="1" width="150" text="24/04/2023" />
              </td>
            </tr>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-20">w-200</td>
              <td
                data-variant-id="height-1-w200-start"
                className="border border-klp-border-default"
              >
                <TableCellsText height="1" width="200" text="24/04/2023" />
              </td>
            </tr>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-20">w-300</td>
              <td
                data-variant-id="height-1-w300-start"
                className="border border-klp-border-default"
              >
                <TableCellsText height="1" width="300" text="24/04/2023" />
              </td>
            </tr>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-20">w-400</td>
              <td
                data-variant-id="height-1-w400-start"
                className="border border-klp-border-default"
              >
                <TableCellsText height="1" width="400" text="24/04/2023" />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* height=2 variants */}
      {/* ------------------------------------------------------------------ */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-klp-label font-klp-label-bold text-klp-fg-muted">
          height=2 (relaxed / 44px)
        </h2>
        <table className="border-collapse">
          <tbody>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-20">w-100</td>
              <td
                data-variant-id="height-2-w100-start"
                className="border border-klp-border-default"
              >
                <TableCellsText height="2" width="100" text="24/04/2023" />
              </td>
            </tr>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-20">w-150</td>
              <td
                data-variant-id="height-2-w150-start"
                className="border border-klp-border-default"
              >
                <TableCellsText height="2" width="150" text="24/04/2023" />
              </td>
            </tr>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-20">w-200</td>
              <td
                data-variant-id="height-2-w200-start"
                className="border border-klp-border-default"
              >
                <TableCellsText height="2" width="200" text="24/04/2023" />
              </td>
            </tr>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-20">w-300</td>
              <td
                data-variant-id="height-2-w300-start"
                className="border border-klp-border-default"
              >
                <TableCellsText height="2" width="300" text="24/04/2023" />
              </td>
            </tr>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-20">w-400</td>
              <td
                data-variant-id="height-2-w400-start"
                className="border border-klp-border-default"
              >
                <TableCellsText height="2" width="400" text="24/04/2023" />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Slot demonstrations */}
      {/* ------------------------------------------------------------------ */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-klp-label font-klp-label-bold text-klp-fg-muted">
          Optional slots
        </h2>
        <table className="border-collapse">
          <tbody>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-32">checkbox</td>
              <td className="border border-klp-border-default">
                <TableCellsText
                  height="1"
                  width="300"
                  text="24/04/2023"
                  checkbox
                  checkboxChecked={false}
                />
              </td>
            </tr>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-32">checkbox checked</td>
              <td className="border border-klp-border-default">
                <TableCellsText
                  height="1"
                  width="300"
                  text="24/04/2023"
                  checkbox
                  checkboxChecked={true}
                />
              </td>
            </tr>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-32">badge</td>
              <td className="border border-klp-border-default">
                <TableCellsText
                  height="1"
                  width="300"
                  text="24/04/2023"
                  badge
                  badgeLabel="Badge"
                />
              </td>
            </tr>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-32">icon-button</td>
              <td className="border border-klp-border-default">
                <TableCellsText
                  height="1"
                  width="300"
                  text="24/04/2023"
                  iconButton
                  iconButtonIcon={<MoreHorizontal className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />}
                />
              </td>
            </tr>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-32">subtitle</td>
              <td className="border border-klp-border-default">
                <TableCellsText
                  height="2"
                  width="300"
                  text="24/04/2023"
                  showSubtitle
                  subtitleText="Subtitle"
                />
              </td>
            </tr>
            <tr>
              <td className="p-2 text-xs text-klp-fg-subtle w-32">all slots</td>
              <td className="border border-klp-border-default">
                <TableCellsText
                  height="2"
                  width="400"
                  text="24/04/2023"
                  showSubtitle
                  subtitleText="Subtitle"
                  checkbox
                  checkboxChecked={false}
                  badge
                  badgeLabel="Active"
                  iconButton
                  iconButtonIcon={<MoreHorizontal className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}
