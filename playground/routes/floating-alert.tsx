import { useEffect } from 'react'
import { FloatingAlert } from '@/components/floating-alert'

const CAPTURE_BRAND = 'wireframe'

export function FloatingAlertRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">
        Floating Alert — captured in {CAPTURE_BRAND}
      </h1>

      <div className="grid grid-cols-1 gap-4 max-w-2xl">
        {/* danger */}
        <div
          data-variant-id="danger-sm"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <FloatingAlert state="danger" size="sm" onDismiss={() => undefined}>
            Alert message
          </FloatingAlert>
        </div>

        <div
          data-variant-id="danger-md"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <FloatingAlert state="danger" size="md" onDismiss={() => undefined}>
            Alert message
          </FloatingAlert>
        </div>

        <div
          data-variant-id="danger-lg"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <FloatingAlert state="danger" size="lg" onDismiss={() => undefined}>
            Alert message
          </FloatingAlert>
        </div>

        {/* warning */}
        <div
          data-variant-id="warning-sm"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <FloatingAlert state="warning" size="sm" onDismiss={() => undefined}>
            Alert message
          </FloatingAlert>
        </div>

        <div
          data-variant-id="warning-md"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <FloatingAlert state="warning" size="md" onDismiss={() => undefined}>
            Alert message
          </FloatingAlert>
        </div>

        <div
          data-variant-id="warning-lg"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <FloatingAlert state="warning" size="lg" onDismiss={() => undefined}>
            Alert message
          </FloatingAlert>
        </div>

        {/* information */}
        <div
          data-variant-id="information-sm"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <FloatingAlert state="information" size="sm" onDismiss={() => undefined}>
            Alert message
          </FloatingAlert>
        </div>

        <div
          data-variant-id="information-md"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <FloatingAlert state="information" size="md" onDismiss={() => undefined}>
            Alert message
          </FloatingAlert>
        </div>

        <div
          data-variant-id="information-lg"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <FloatingAlert state="information" size="lg" onDismiss={() => undefined}>
            Alert message
          </FloatingAlert>
        </div>

        {/* success */}
        <div
          data-variant-id="success-sm"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <FloatingAlert state="success" size="sm" onDismiss={() => undefined}>
            Alert message
          </FloatingAlert>
        </div>

        <div
          data-variant-id="success-md"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <FloatingAlert state="success" size="md" onDismiss={() => undefined}>
            Alert message
          </FloatingAlert>
        </div>

        <div
          data-variant-id="success-lg"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <FloatingAlert state="success" size="lg" onDismiss={() => undefined}>
            Alert message
          </FloatingAlert>
        </div>
      </div>
    </div>
  )
}
