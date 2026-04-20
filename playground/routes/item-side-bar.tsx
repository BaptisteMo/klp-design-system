import { useEffect } from 'react'
import { FolderOpen } from 'lucide-react'
import { ItemSideBar, ActionSheetItem } from '@/components/item-side-bar'

const CAPTURE_BRAND = 'klub' // from spec.captureBrand

export function ItemSideBarRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Item Side Bar — captured in {CAPTURE_BRAND}</h1>

      <div className="grid grid-cols-2 gap-6 max-w-2xl">

        {/* active-collapsible */}
        <div
          data-variant-id="active-collapsible"
          className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
        >
          <p className="text-klp-text-small text-klp-fg-muted mb-2">active / collapsible</p>
          <ItemSideBar
            feature="collapsible"
            state="active"
            icon={<FolderOpen strokeWidth={1.5} />}
            label="Label"
            defaultOpen
          >
            <ActionSheetItem state="default">Sub-item</ActionSheetItem>
            <ActionSheetItem state="default">Sub-item</ActionSheetItem>
          </ItemSideBar>
        </div>

        {/* hover-collapsible */}
        <div
          data-variant-id="hover-collapsible"
          className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
        >
          <p className="text-klp-text-small text-klp-fg-muted mb-2">hover / collapsible</p>
          <ItemSideBar
            feature="collapsible"
            state="hover"
            icon={<FolderOpen strokeWidth={1.5} />}
            label="Label"
          >
            <ActionSheetItem state="default">Sub-item</ActionSheetItem>
            <ActionSheetItem state="default">Sub-item</ActionSheetItem>
          </ItemSideBar>
        </div>

        {/* hover-static */}
        <div
          data-variant-id="hover-static"
          className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
        >
          <p className="text-klp-text-small text-klp-fg-muted mb-2">hover / static</p>
          <ItemSideBar
            feature="static"
            state="hover"
            icon={<FolderOpen strokeWidth={1.5} />}
            label="Label"
          />
        </div>

        {/* active-static */}
        <div
          data-variant-id="active-static"
          className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
        >
          <p className="text-klp-text-small text-klp-fg-muted mb-2">active / static</p>
          <ItemSideBar
            feature="static"
            state="active"
            icon={<FolderOpen strokeWidth={1.5} />}
            label="Label"
          />
        </div>

        {/* rest-collapsible */}
        <div
          data-variant-id="rest-collapsible"
          className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
        >
          <p className="text-klp-text-small text-klp-fg-muted mb-2">rest / collapsible</p>
          <ItemSideBar
            feature="collapsible"
            state="rest"
            icon={<FolderOpen strokeWidth={1.5} />}
            label="Label"
          >
            <ActionSheetItem state="default">Sub-item</ActionSheetItem>
            <ActionSheetItem state="default">Sub-item</ActionSheetItem>
          </ItemSideBar>
        </div>

        {/* rest-static */}
        <div
          data-variant-id="rest-static"
          className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
        >
          <p className="text-klp-text-small text-klp-fg-muted mb-2">rest / static</p>
          <ItemSideBar
            feature="static"
            state="rest"
            icon={<FolderOpen strokeWidth={1.5} />}
            label="Label"
          />
        </div>

      </div>
    </div>
  )
}
