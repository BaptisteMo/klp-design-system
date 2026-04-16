import { useEffect } from 'react'
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/tooltip'

const CAPTURE_BRAND = 'klub'

export function TooltipRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Tooltip — captured in {CAPTURE_BRAND}</h1>

      <TooltipProvider delayDuration={0}>
        <div className="grid grid-cols-2 gap-24 pt-16 pb-16">

          <div
            data-variant-id="bottom-left"
            className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
          >
            <TooltipRoot defaultOpen>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default"
                >
                  Trigger
                </button>
              </TooltipTrigger>
              <TooltipContent arrowOrientation="bottom-left">Label</TooltipContent>
            </TooltipRoot>
          </div>

          <div
            data-variant-id="bottom-right"
            className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
          >
            <TooltipRoot defaultOpen>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default"
                >
                  Trigger
                </button>
              </TooltipTrigger>
              <TooltipContent arrowOrientation="bottom-right">Label</TooltipContent>
            </TooltipRoot>
          </div>

          <div
            data-variant-id="top-left"
            className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
          >
            <TooltipRoot defaultOpen>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default"
                >
                  Trigger
                </button>
              </TooltipTrigger>
              <TooltipContent arrowOrientation="top-left">Label</TooltipContent>
            </TooltipRoot>
          </div>

          <div
            data-variant-id="top-right"
            className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
          >
            <TooltipRoot defaultOpen>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default"
                >
                  Trigger
                </button>
              </TooltipTrigger>
              <TooltipContent arrowOrientation="top-right">Label</TooltipContent>
            </TooltipRoot>
          </div>

        </div>
      </TooltipProvider>
    </div>
  )
}
