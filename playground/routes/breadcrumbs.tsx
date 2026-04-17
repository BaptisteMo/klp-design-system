import { useEffect } from 'react'
import { BreadCrumbs } from '@/components/breadcrumbs'

const CAPTURE_BRAND = 'wireframe'

export function BreadCrumbsRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">BreadCrumbs — captured in {CAPTURE_BRAND}</h1>
      <div className="flex flex-col gap-4">
        {/* steps-0: single step — home icon + label + chevron-down */}
        <div
          data-variant-id="steps-0"
          className="flex items-center rounded-klp-m border border-klp-border-default p-4"
        >
          <BreadCrumbs
            steps={[
              { label: 'Home', onClick: () => {} },
            ]}
            showDropdownAffordance={true}
          />
        </div>

        {/* steps-1: two steps — ancestor (home icon + label + chevron-right) + current (label + chevron-down) */}
        <div
          data-variant-id="steps-1"
          className="flex items-center rounded-klp-m border border-klp-border-default p-4"
        >
          <BreadCrumbs
            steps={[
              { label: 'Home', onClick: () => {} },
              { label: 'Category' },
            ]}
            showDropdownAffordance={true}
          />
        </div>

        {/* steps-2: three steps — two ancestors + one current */}
        <div
          data-variant-id="steps-2"
          className="flex items-center rounded-klp-m border border-klp-border-default p-4"
        >
          <BreadCrumbs
            steps={[
              { label: 'Home', onClick: () => {} },
              { label: 'Category', onClick: () => {} },
              { label: 'Sub-category' },
            ]}
            showDropdownAffordance={true}
          />
        </div>

        {/* steps-3: four steps — three ancestors + one current */}
        <div
          data-variant-id="steps-3"
          className="flex items-center rounded-klp-m border border-klp-border-default p-4"
        >
          <BreadCrumbs
            steps={[
              { label: 'Home', onClick: () => {} },
              { label: 'Category', onClick: () => {} },
              { label: 'Sub-category', onClick: () => {} },
              { label: 'Current Page' },
            ]}
            showDropdownAffordance={true}
          />
        </div>
      </div>
    </div>
  )
}
