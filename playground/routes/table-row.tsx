import { useEffect } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { TableRow } from '@/components/table-row'

const CAPTURE_BRAND = 'klub'

export function TableRowRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Table Row — captured in {CAPTURE_BRAND}</h1>

      <div className="flex flex-col gap-8">

        {/* default-none */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-klp-label font-klp-label-bold text-klp-fg-muted">default / floating-action: none</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr data-variant-id="default-none">
                <td colSpan={1}>
                  <TableRow
                    variant="default"
                    badgeLabel="Pending"
                    primaryText="Primary text"
                    secondaryText="Secondary text"
                    actions={
                      <button
                        type="button"
                        aria-label="More actions"
                        className="inline-flex items-center justify-center rounded-klp-l border border-klp-border-invisible bg-klp-bg-invisible pt-klp-size-xs pr-klp-size-xs pb-klp-size-xs pl-klp-size-xs text-klp-fg-muted"
                      >
                        <MoreHorizontal className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
                      </button>
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* default-hover-none */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-klp-label font-klp-label-bold text-klp-fg-muted">default-hover / floating-action: none</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr data-variant-id="default-hover-none">
                <td colSpan={1}>
                  <TableRow
                    variant="default-hover"
                    badgeLabel="Pending"
                    primaryText="Primary text"
                    secondaryText="Secondary text"
                    actions={
                      <button
                        type="button"
                        aria-label="More actions"
                        className="inline-flex items-center justify-center rounded-klp-l border border-klp-border-invisible bg-klp-bg-invisible pt-klp-size-xs pr-klp-size-xs pb-klp-size-xs pl-klp-size-xs text-klp-fg-muted"
                      >
                        <MoreHorizontal className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
                      </button>
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* floating-action-on */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-klp-label font-klp-label-bold text-klp-fg-muted">floating-action / on</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr data-variant-id="floating-action-on">
                <td colSpan={1}>
                  <TableRow
                    variant="floating-action-on"
                    badgeLabel="Active"
                    primaryText="Primary text"
                    secondaryText="Secondary text"
                    actions={
                      <button
                        type="button"
                        aria-label="More actions"
                        className="inline-flex items-center justify-center rounded-klp-l border border-klp-border-invisible bg-klp-bg-invisible pt-klp-size-xs pr-klp-size-xs pb-klp-size-xs pl-klp-size-xs text-klp-fg-muted"
                      >
                        <MoreHorizontal className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
                      </button>
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* floating-action-off */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-klp-label font-klp-label-bold text-klp-fg-muted">floating-action / off (actions panel collapsed)</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr data-variant-id="floating-action-off">
                <td colSpan={1}>
                  <TableRow
                    variant="floating-action-off"
                    badgeLabel="Pending"
                    primaryText="Primary text"
                    secondaryText="Secondary text"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* empty-off */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-klp-label font-klp-label-bold text-klp-fg-muted">empty / floating-action: off</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr data-variant-id="empty-off">
                <TableRow
                  variant="empty"
                  emptyMessage="No records found."
                  emptyIllustration={
                    <div className="h-[120px] w-[160px] rounded-klp-m bg-klp-bg-inset flex items-center justify-center text-klp-fg-subtle text-sm">
                      Illustration
                    </div>
                  }
                  colSpan={4}
                />
              </tr>
            </tbody>
          </table>
        </section>

      </div>
    </div>
  )
}
