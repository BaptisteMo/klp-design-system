import { useEffect } from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { TabulationCell } from '@/components/tabulation-cells/TabulationCells'

const CAPTURE_BRAND = 'klub'

export function TabulationCellsRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold text-klp-fg-default">
        Tabulation Cells — captured in {CAPTURE_BRAND}
      </h1>

      <TabsPrimitive.Root defaultValue="active-default">
        <TabsPrimitive.List className="flex gap-1">

          {/* rest-default */}
          <div
            data-variant-id="rest-default"
            className="flex items-center justify-center"
          >
            <TabulationCell value="rest-default" state="rest" badge={3}>
              Label
            </TabulationCell>
          </div>

          {/* active-default */}
          <div
            data-variant-id="active-default"
            className="flex items-center justify-center"
          >
            <TabulationCell value="active-default" state="active" badge={3}>
              Label
            </TabulationCell>
          </div>

        </TabsPrimitive.List>
      </TabsPrimitive.Root>

      <div className="mt-4 text-sm text-klp-fg-muted">
        <p>State=Rest: neutral transparent background, regular label weight, muted badge.</p>
        <p>State=Active: brand-low fill, bold label, brand-accented badge.</p>
      </div>
    </div>
  )
}
