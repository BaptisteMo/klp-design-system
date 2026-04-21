import { useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Collapsible } from '@/components/collapsible'

const CAPTURE_BRAND = 'wireframe'

export function CollapsibleRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? CAPTURE_BRAND
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Collapsible — captured in {CAPTURE_BRAND}</h1>

      <div className="flex flex-col gap-8 max-w-md">
        {/* close-default */}
        <div
          data-variant-id="close-default"
          className="flex flex-col gap-2"
        >
          <p className="text-sm text-klp-fg-muted font-klp-label">close-default</p>
          <Collapsible
            icon={<ShoppingCart strokeWidth={1.5} />}
            title="Section title"
            defaultOpen={false}
          >
            <p>Content goes here. Replace this with your own children.</p>
          </Collapsible>
        </div>

        {/* open-default */}
        <div
          data-variant-id="open-default"
          className="flex flex-col gap-2"
        >
          <p className="text-sm text-klp-fg-muted font-klp-label">open-default</p>
          <Collapsible
            icon={<ShoppingCart strokeWidth={1.5} />}
            title="Section title"
            defaultOpen={true}
          >
            <p>Content goes here. Replace this with your own children.</p>
          </Collapsible>
        </div>
      </div>
    </div>
  )
}
