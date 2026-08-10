import { useEffect } from 'react'
import { Card } from '@/components/cards'

const CAPTURE_BRAND = 'klub'

export function CardsRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Card — captured in {CAPTURE_BRAND}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div
          data-variant-id="padding-8"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <Card paddingSize="8px">
            <p className="text-klp-text-small text-klp-fg-default">Card content</p>
          </Card>
        </div>
        <div
          data-variant-id="padding-16"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <Card paddingSize="16px">
            <p className="text-klp-text-small text-klp-fg-default">Card content</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
