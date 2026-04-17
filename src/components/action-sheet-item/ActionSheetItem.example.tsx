import { Plus } from 'lucide-react'
import { ActionSheetItem } from './ActionSheetItem'

export function ActionSheetItemExample() {
  return (
    <div className="flex w-80 flex-col gap-2">
      <ActionSheetItem
        state="default"
        size="lg"
        firstIcon={<Plus strokeWidth={1.5} />}
        secondAction={<Plus strokeWidth={1.5} />}
      >
        Label action
      </ActionSheetItem>

      <ActionSheetItem
        state="destructive"
        size="lg"
        firstIcon={<Plus strokeWidth={1.5} />}
      >
        Delete item
      </ActionSheetItem>

      <ActionSheetItem
        state="creation"
        size="md"
        firstIcon={<Plus strokeWidth={1.5} />}
      >
        Create new
      </ActionSheetItem>

      <ActionSheetItem state="disabled" size="md" disabled>
        Unavailable action
      </ActionSheetItem>
    </div>
  )
}
