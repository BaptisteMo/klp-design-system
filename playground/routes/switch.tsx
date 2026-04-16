import { useEffect } from 'react'
import { Switch } from '@/components/switch'

// Brand the Figma references were captured in — must match spec.captureBrand
const CAPTURE_BRAND = 'wireframe'

export function SwitchRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Switch — captured in {CAPTURE_BRAND}</h1>

      <div className="grid grid-cols-2 gap-4">
        {/* toggle-on-default */}
        <div
          data-variant-id="toggle-on-default"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-6"
        >
          <Switch checked aria-label="Toggle on" onCheckedChange={() => undefined} />
        </div>

        {/* toggle-off-default */}
        <div
          data-variant-id="toggle-off-default"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-6"
        >
          <Switch checked={false} aria-label="Toggle off" onCheckedChange={() => undefined} />
        </div>
      </div>

      {/* Interactive demo */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-klp-fg-muted">Interactive</h2>
        <div className="flex items-center gap-3">
          <Switch defaultChecked id="switch-demo" aria-label="Toggle feature" />
          <label htmlFor="switch-demo" className="text-sm text-klp-fg-default font-klp-label cursor-pointer">
            Toggle feature
          </label>
        </div>
      </div>
    </div>
  )
}
