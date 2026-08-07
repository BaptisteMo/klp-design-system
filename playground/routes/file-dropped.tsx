import { useEffect } from 'react'
import { FileDropped } from '@/components/file-dropped'

const CAPTURE_BRAND = 'klub'

export function FileDroppedRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-xl font-semibold">File Dropped — captured in {CAPTURE_BRAND}</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">States</h2>
        <div className="flex flex-col gap-4 max-w-[560px]">
          <div data-variant-id="default" className="flex flex-col gap-2">
            <span className="font-klp-label text-klp-text-smaller text-klp-fg-muted">default</span>
            <FileDropped name="contract_ready_signed.pdf" size="442kb" state="default" />
          </div>
          <div data-variant-id="uploading" className="flex flex-col gap-2">
            <span className="font-klp-label text-klp-text-smaller text-klp-fg-muted">uploading</span>
            <FileDropped name="contract_ready_signed.pdf" size="442kb" state="uploading" progress={42} />
          </div>
          <div data-variant-id="done" className="flex flex-col gap-2">
            <span className="font-klp-label text-klp-text-smaller text-klp-fg-muted">done</span>
            <FileDropped name="contract_ready_signed.pdf" size="442kb" state="done" />
          </div>
        </div>
      </section>
    </div>
  )
}
