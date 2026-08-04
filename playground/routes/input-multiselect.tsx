import { useEffect } from 'react'
import { InputMultiselect } from '@/components/input-multiselect'
import type { InputMultiselectSection } from '@/components/input-multiselect'

// captureBrand from spec.captureBrand
const CAPTURE_BRAND = 'klub'

const SECTIONS: InputMultiselectSection[] = [
  {
    title: 'Titre de section',
    options: [
      { id: 'opt-1', label: 'Label' },
      { id: 'opt-2', label: 'Label' },
      { id: 'opt-3', label: 'Label' },
      { id: 'opt-4', label: 'Label' },
    ],
  },
  {
    title: 'Titre de section',
    options: [
      { id: 'opt-5', label: 'Label' },
      { id: 'opt-6', label: 'Label' },
    ],
  },
]

export function InputMultiselectRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? CAPTURE_BRAND
    }
  }, [])

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-xl font-semibold">Input Multiselect — captured in {CAPTURE_BRAND}</h1>

      <div className="grid grid-cols-3 gap-8 items-start">
        {/* filled-open: Content=Filled (2 selected), State=Open */}
        <div data-variant-id="filled-open" className="flex flex-col gap-2">
          <span className="text-xs text-klp-fg-muted font-klp-label">Content=Filled, State=Open</span>
          <InputMultiselect
            label="Label of the input"
            sections={SECTIONS}
            defaultValue={['opt-1', 'opt-2']}
            defaultOpen
          />
        </div>

        {/* filled-close: Content=Filled (2 selected), State=Close */}
        <div data-variant-id="filled-close" className="flex flex-col gap-2">
          <span className="text-xs text-klp-fg-muted font-klp-label">Content=Filled, State=Close</span>
          <InputMultiselect
            label="Label of the input"
            sections={SECTIONS}
            defaultValue={['opt-1', 'opt-2']}
            defaultOpen={false}
          />
        </div>

        {/* empty-close: Content=Empty (0 selected), State=Close */}
        <div data-variant-id="empty-close" className="flex flex-col gap-2">
          <span className="text-xs text-klp-fg-muted font-klp-label">Content=Empty, State=Close</span>
          <InputMultiselect
            label="Label of the input"
            placeholder="This is the placeholder or input content"
            sections={SECTIONS}
            defaultValue={[]}
            defaultOpen={false}
          />
        </div>

        {/* full-open: Content=Full (4 selected), State=Open */}
        <div data-variant-id="full-open" className="flex flex-col gap-2">
          <span className="text-xs text-klp-fg-muted font-klp-label">Content=Full, State=Open</span>
          <InputMultiselect
            label="Label of the input"
            sections={SECTIONS}
            defaultValue={['opt-1', 'opt-2', 'opt-3', 'opt-4']}
            defaultOpen
          />
        </div>

        {/* full-close: Content=Full (4 selected), State=Close */}
        <div data-variant-id="full-close" className="flex flex-col gap-2">
          <span className="text-xs text-klp-fg-muted font-klp-label">Content=Full, State=Close</span>
          <InputMultiselect
            label="Label of the input"
            sections={SECTIONS}
            defaultValue={['opt-1', 'opt-2', 'opt-3', 'opt-4']}
            defaultOpen={false}
          />
        </div>
      </div>
    </div>
  )
}
