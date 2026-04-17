import { Settings, Share, Trash2, ChevronRight } from 'lucide-react'
import {
  ActionSheetMenu,
  ActionSheetMenuRoot,
  ActionSheetMenuTrigger,
  ActionSheetMenuPortal,
  ActionSheetMenuContent,
} from '@/components/action-sheet-menu'

// --- Standalone (default type) ---
export function ActionSheetMenuDefaultExample() {
  return (
    <ActionSheetMenu
      type="default"
      sections={[
        {
          title: 'Titre de section',
          items: [
            {
              id: 'settings',
              label: 'Paramètres',
              leftIcon: <Settings strokeWidth={1.5} />,
              rightIcon: <ChevronRight strokeWidth={1.5} />,
              onSelect: () => {},
            },
            {
              id: 'share',
              label: 'Partager',
              leftIcon: <Share strokeWidth={1.5} />,
              onSelect: () => {},
            },
            {
              id: 'delete',
              label: 'Supprimer',
              leftIcon: <Trash2 strokeWidth={1.5} />,
              state: 'destructive',
              onSelect: () => {},
            },
          ],
        },
      ]}
    />
  )
}

// --- Checkbox type ---
export function ActionSheetMenuCheckboxExample() {
  return (
    <ActionSheetMenu
      type="checkbox"
      sections={[
        {
          title: 'Titre de section',
          items: [
            { id: 'opt-a', label: 'Option A', checked: true },
            { id: 'opt-b', label: 'Option B', checked: false },
            { id: 'opt-c', label: 'Option C', checked: 'indeterminate' },
          ],
        },
      ]}
    />
  )
}

// --- Flat type (no section titles, no separators between single section) ---
export function ActionSheetMenuFlatExample() {
  return (
    <ActionSheetMenu
      type="flat"
      sections={[
        {
          items: [
            {
              id: 'item-1',
              label: 'Label',
              leftIcon: <Settings strokeWidth={1.5} />,
              rightIcon: <ChevronRight strokeWidth={1.5} />,
            },
            {
              id: 'item-2',
              label: 'Label',
              leftIcon: <Share strokeWidth={1.5} />,
            },
          ],
        },
      ]}
    />
  )
}

// --- Popover-wrapped usage ---
export function ActionSheetMenuPopoverExample() {
  return (
    <ActionSheetMenuRoot>
      <ActionSheetMenuTrigger asChild>
        <button type="button">Open menu</button>
      </ActionSheetMenuTrigger>
      <ActionSheetMenuPortal>
        <ActionSheetMenuContent
          type="default"
          align="end"
          sections={[
            {
              title: 'Actions',
              items: [
                { id: 'edit', label: 'Modifier', leftIcon: <Settings strokeWidth={1.5} /> },
                { id: 'share', label: 'Partager', leftIcon: <Share strokeWidth={1.5} /> },
                { id: 'delete', label: 'Supprimer', leftIcon: <Trash2 strokeWidth={1.5} />, state: 'destructive' },
              ],
            },
          ]}
        />
      </ActionSheetMenuPortal>
    </ActionSheetMenuRoot>
  )
}
