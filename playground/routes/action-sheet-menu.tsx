import { useEffect } from 'react'
import { Settings, Share, Trash2, ChevronRight, Star } from 'lucide-react'
import { ActionSheetMenu } from '@/components/action-sheet-menu'

// captureBrand from spec.captureBrand
const CAPTURE_BRAND = 'wireframe'

const DEFAULT_SECTIONS = [
  {
    title: 'Titre de section',
    items: [
      {
        id: 'item-1',
        label: 'Label',
        leftIcon: <Star strokeWidth={1.5} />,
        rightIcon: <ChevronRight strokeWidth={1.5} />,
      },
      {
        id: 'item-2',
        label: 'Label',
        leftIcon: <Settings strokeWidth={1.5} />,
        rightIcon: <ChevronRight strokeWidth={1.5} />,
      },
      {
        id: 'item-3',
        label: 'Label',
        leftIcon: <Share strokeWidth={1.5} />,
        rightIcon: <ChevronRight strokeWidth={1.5} />,
      },
      {
        id: 'item-4',
        label: 'Label',
        leftIcon: <Trash2 strokeWidth={1.5} />,
        rightIcon: <ChevronRight strokeWidth={1.5} />,
        state: 'destructive' as const,
      },
    ],
  },
  {
    title: 'Titre de section',
    items: [
      {
        id: 'item-5',
        label: 'Label',
        leftIcon: <Star strokeWidth={1.5} />,
        rightIcon: <ChevronRight strokeWidth={1.5} />,
      },
      {
        id: 'item-6',
        label: 'Label',
        leftIcon: <Settings strokeWidth={1.5} />,
        rightIcon: <ChevronRight strokeWidth={1.5} />,
      },
    ],
  },
]

const CHECKBOX_SECTIONS = [
  {
    title: 'Titre de section',
    items: [
      { id: 'cb-1', label: 'Label', checked: true as const },
      { id: 'cb-2', label: 'Label', checked: false as const },
      { id: 'cb-3', label: 'Label', checked: 'indeterminate' as const },
      { id: 'cb-4', label: 'Label', checked: false as const },
    ],
  },
  {
    title: 'Titre de section',
    items: [
      { id: 'cb-5', label: 'Label', checked: true as const },
      { id: 'cb-6', label: 'Label', checked: false as const },
    ],
  },
]

const FLAT_SECTIONS = [
  {
    items: [
      {
        id: 'flat-1',
        label: 'Label',
        leftIcon: <Star strokeWidth={1.5} />,
        rightIcon: <ChevronRight strokeWidth={1.5} />,
      },
      {
        id: 'flat-2',
        label: 'Label',
        leftIcon: <Settings strokeWidth={1.5} />,
        rightIcon: <ChevronRight strokeWidth={1.5} />,
      },
      {
        id: 'flat-3',
        label: 'Label',
        leftIcon: <Share strokeWidth={1.5} />,
        rightIcon: <ChevronRight strokeWidth={1.5} />,
      },
      {
        id: 'flat-4',
        label: 'Label',
        leftIcon: <Trash2 strokeWidth={1.5} />,
        rightIcon: <ChevronRight strokeWidth={1.5} />,
        state: 'destructive' as const,
      },
    ],
  },
]

export function ActionSheetMenuRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? CAPTURE_BRAND
    }
  }, [])

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-xl font-semibold">ActionSheet Menu — captured in {CAPTURE_BRAND}</h1>

      <div className="grid grid-cols-3 gap-8 items-start">
        {/* default-default */}
        <div
          data-variant-id="default-default"
          className="flex flex-col gap-2"
        >
          <span className="text-xs text-klp-fg-muted font-klp-label">Type=Default</span>
          <ActionSheetMenu type="default" sections={DEFAULT_SECTIONS} />
        </div>

        {/* checkbox-default */}
        <div
          data-variant-id="checkbox-default"
          className="flex flex-col gap-2"
        >
          <span className="text-xs text-klp-fg-muted font-klp-label">Type=Checkbox</span>
          <ActionSheetMenu type="checkbox" sections={CHECKBOX_SECTIONS} />
        </div>

        {/* flat-default */}
        <div
          data-variant-id="flat-default"
          className="flex flex-col gap-2"
        >
          <span className="text-xs text-klp-fg-muted font-klp-label">Type=Flat</span>
          <ActionSheetMenu type="flat" sections={FLAT_SECTIONS} />
        </div>
      </div>
    </div>
  )
}
