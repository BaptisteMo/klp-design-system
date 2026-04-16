import { useEffect } from 'react'
import { RadioGroup, RadioItem } from '@/components/radio'

// Brand in which Figma references were captured — must stay locked during visual verification
const CAPTURE_BRAND = 'klub'

export function RadioRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Radio — captured in {CAPTURE_BRAND}</h1>

      <RadioGroup defaultValue="clicked" aria-label="Radio playground">
        <div className="grid grid-cols-4 gap-4">
          {/* default-rest: unchecked, no hover */}
          <div
            data-variant-id="default-rest"
            className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
          >
            <RadioItem value="rest" aria-label="rest state" />
          </div>

          {/* default-hover: unchecked hovered — rendered identically to rest; hover is interactive-only */}
          <div
            data-variant-id="default-hover"
            className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
          >
            {/*
              The hover state is an interactive state that cannot be statically rendered.
              We render the same unchecked item; the visual-verifier screenshots with
              Playwright hover simulation for this variant.
            */}
            <RadioItem value="hover" aria-label="hover state" />
          </div>

          {/* default-clicked: checked/selected state */}
          <div
            data-variant-id="default-clicked"
            className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
          >
            <RadioItem value="clicked" aria-label="clicked state" />
          </div>

          {/* default-disable: disabled state */}
          <div
            data-variant-id="default-disable"
            className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
          >
            <RadioItem value="disable" aria-label="disable state" disabled />
          </div>
        </div>
      </RadioGroup>

      <div className="flex flex-col gap-1 text-sm text-klp-fg-muted">
        <span>rest — unchecked default</span>
        <span>hover — unchecked hovered (interactive, requires pointer)</span>
        <span>clicked — checked/selected</span>
        <span>disable — disabled</span>
      </div>
    </div>
  )
}
