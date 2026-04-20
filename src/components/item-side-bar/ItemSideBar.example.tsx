import { FolderOpen } from 'lucide-react'
import { ItemSideBar, ActionSheetItem } from '@/components/item-side-bar'

export function ItemSideBarExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Static — rest */}
      <ItemSideBar
        feature="static"
        state="rest"
        icon={<FolderOpen strokeWidth={1.5} />}
        label="Projects"
      />

      {/* Static — active */}
      <ItemSideBar
        feature="static"
        state="active"
        icon={<FolderOpen strokeWidth={1.5} />}
        label="Projects"
      />

      {/* Collapsible — rest (collapsed) */}
      <ItemSideBar
        feature="collapsible"
        state="rest"
        icon={<FolderOpen strokeWidth={1.5} />}
        label="Projects"
      >
        <ActionSheetItem state="default">Sub-item A</ActionSheetItem>
        <ActionSheetItem state="default">Sub-item B</ActionSheetItem>
      </ItemSideBar>

      {/* Collapsible — active (expanded) */}
      <ItemSideBar
        feature="collapsible"
        state="active"
        icon={<FolderOpen strokeWidth={1.5} />}
        label="Projects"
        defaultOpen
      >
        <ActionSheetItem state="default">Sub-item A</ActionSheetItem>
        <ActionSheetItem state="default">Sub-item B</ActionSheetItem>
      </ItemSideBar>
    </div>
  )
}
