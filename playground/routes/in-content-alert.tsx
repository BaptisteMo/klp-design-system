import { useEffect } from 'react'
import { InContentAlert } from '@/components/in-content-alert'

const CAPTURE_BRAND = 'klub' // from spec.captureBrand

export function InContentAlertRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">InContent Alert — captured in {CAPTURE_BRAND}</h1>

      {/* Info row */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-klp-fg-muted">Info</h2>
        <div className="grid grid-cols-1 gap-4">
          <div data-variant-id="info-lg-default" className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4">
            <InContentAlert content="info" size="lg" title="Title" body="Body text below the header row." />
          </div>
          <div data-variant-id="info-md-default" className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4">
            <InContentAlert content="info" size="md" title="Title" body="Body text below the header row." />
          </div>
          <div data-variant-id="info-sm-default" className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4">
            <InContentAlert content="info" size="sm" title="Title" body="Body text below the header row." />
          </div>
        </div>
      </div>

      {/* Success row */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-klp-fg-muted">Success</h2>
        <div className="grid grid-cols-1 gap-4">
          <div data-variant-id="success-lg-default" className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4">
            <InContentAlert content="success" size="lg" title="Title" body="Body text below the header row." />
          </div>
          <div data-variant-id="success-md-default" className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4">
            <InContentAlert content="success" size="md" title="Title" body="Body text below the header row." />
          </div>
          <div data-variant-id="success-sm-default" className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4">
            <InContentAlert content="success" size="sm" title="Title" body="Body text below the header row." />
          </div>
        </div>
      </div>

      {/* Danger row */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-klp-fg-muted">Danger</h2>
        <div className="grid grid-cols-1 gap-4">
          <div data-variant-id="danger-lg-default" className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4">
            <InContentAlert content="danger" size="lg" title="Title" body="Body text below the header row." />
          </div>
          <div data-variant-id="danger-md-default" className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4">
            <InContentAlert content="danger" size="md" title="Title" body="Body text below the header row." />
          </div>
          <div data-variant-id="danger-sm-default" className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4">
            <InContentAlert content="danger" size="sm" title="Title" body="Body text below the header row." />
          </div>
        </div>
      </div>

      {/* Warning row */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-klp-fg-muted">Warning</h2>
        <div className="grid grid-cols-1 gap-4">
          <div data-variant-id="warning-lg-default" className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4">
            <InContentAlert content="warning" size="lg" title="Title" body="Body text below the header row." />
          </div>
          <div data-variant-id="warning-md-default" className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4">
            <InContentAlert content="warning" size="md" title="Title" body="Body text below the header row." />
          </div>
          <div data-variant-id="warning-sm-default" className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4">
            <InContentAlert content="warning" size="sm" title="Title" body="Body text below the header row." />
          </div>
        </div>
      </div>
    </div>
  )
}
