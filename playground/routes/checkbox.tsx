import { useEffect } from 'react'
import { Checkbox } from '@/components/checkbox'

// Brand in which Figma references were captured
const CAPTURE_BRAND = 'klub'

export function CheckboxRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? CAPTURE_BRAND
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">
        Checkbox — captured in {CAPTURE_BRAND}
      </h1>

      <div className="grid grid-cols-5 gap-4">
        {/* default-rest: unchecked at rest */}
        <div
          data-variant-id="default-rest"
          className="flex flex-col items-center gap-2 rounded-klp-m border border-klp-border-default p-4"
        >
          <span className="text-xs text-klp-fg-muted font-klp-label">rest</span>
          <Checkbox aria-label="Checkbox rest" />
        </div>

        {/* default-hover: unchecked hovered — simulated with className override */}
        <div
          data-variant-id="default-hover"
          className="flex flex-col items-center gap-2 rounded-klp-m border border-klp-border-default p-4"
        >
          <span className="text-xs text-klp-fg-muted font-klp-label">hover</span>
          {/*
            Hover state is a CSS :hover pseudo-class.
            We render the checkbox with the hover-state classes applied directly
            so the playground cell visually matches the Figma hover reference.
          */}
          <Checkbox
            aria-label="Checkbox hover"
            className="bg-klp-bg-brand-low border-klp-border-brand"
          />
        </div>

        {/* default-clicked: checked */}
        <div
          data-variant-id="default-clicked"
          className="flex flex-col items-center gap-2 rounded-klp-m border border-klp-border-default p-4"
        >
          <span className="text-xs text-klp-fg-muted font-klp-label">checked</span>
          <Checkbox checked aria-label="Checkbox checked" />
        </div>

        {/* default-mixed: indeterminate */}
        <div
          data-variant-id="default-mixed"
          className="flex flex-col items-center gap-2 rounded-klp-m border border-klp-border-default p-4"
        >
          <span className="text-xs text-klp-fg-muted font-klp-label">mixed</span>
          <Checkbox checked="indeterminate" aria-label="Checkbox indeterminate" />
        </div>

        {/* default-disable: disabled */}
        <div
          data-variant-id="default-disable"
          className="flex flex-col items-center gap-2 rounded-klp-m border border-klp-border-default p-4"
        >
          <span className="text-xs text-klp-fg-muted font-klp-label">disable</span>
          <Checkbox disabled aria-label="Checkbox disabled" />
        </div>
      </div>
    </div>
  )
}
