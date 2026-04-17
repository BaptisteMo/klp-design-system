import { useEffect } from 'react'
import { Plus } from 'lucide-react'
import { ListContent } from '@/components/list-content'

const CAPTURE_BRAND = 'wireframe'

export function ListContentRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? CAPTURE_BRAND
    }
  }, [])

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-xl font-semibold">List Content — captured in {CAPTURE_BRAND}</h1>

      {/* Small */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-klp-fg-muted uppercase tracking-wide">Small</h2>
        <div className="flex flex-col gap-3">
          <div data-variant-id="small-default" className="rounded-klp-m border border-klp-border-default p-4 flex items-center justify-center">
            <ListContent size="small" state="default" label="Label of the list" sublabel="Sublabel"
              decorativeIcon={<Plus strokeWidth={1.5} />}
            />
          </div>
          <div data-variant-id="small-hover" className="rounded-klp-m border border-klp-border-default p-4 flex items-center justify-center">
            <ListContent size="small" state="hover" label="Label of the list" sublabel="Sublabel"
              decorativeIcon={<Plus strokeWidth={1.5} />}
            />
          </div>
          <div data-variant-id="small-active" className="rounded-klp-m border border-klp-border-default p-4 flex items-center justify-center">
            <ListContent size="small" state="active" label="Label of the list" sublabel="Sublabel"
              decorativeIcon={<Plus strokeWidth={1.5} />}
            />
          </div>
        </div>
      </section>

      {/* Medium */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-klp-fg-muted uppercase tracking-wide">Medium</h2>
        <div className="flex flex-col gap-3">
          <div data-variant-id="medium-default" className="rounded-klp-m border border-klp-border-default p-4 flex items-center justify-center">
            <ListContent size="medium" state="default" label="Label of the list" sublabel="Sublabel"
              decorativeIcon={<Plus strokeWidth={1.5} />}
            />
          </div>
          <div data-variant-id="medium-hover" className="rounded-klp-m border border-klp-border-default p-4 flex items-center justify-center">
            <ListContent size="medium" state="hover" label="Label of the list" sublabel="Sublabel"
              decorativeIcon={<Plus strokeWidth={1.5} />}
            />
          </div>
          <div data-variant-id="medium-active" className="rounded-klp-m border border-klp-border-default p-4 flex items-center justify-center">
            <ListContent size="medium" state="active" label="Label of the list" sublabel="Sublabel"
              decorativeIcon={<Plus strokeWidth={1.5} />}
            />
          </div>
        </div>
      </section>

      {/* Large */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-klp-fg-muted uppercase tracking-wide">Large</h2>
        <div className="flex flex-col gap-3">
          <div data-variant-id="large-default" className="rounded-klp-m border border-klp-border-default p-4 flex items-center justify-center">
            <ListContent size="large" state="default" label="Label of the list" sublabel="Sublabel"
              decorativeIcon={<Plus strokeWidth={1.5} />}
            />
          </div>
          <div data-variant-id="large-hover" className="rounded-klp-m border border-klp-border-default p-4 flex items-center justify-center">
            <ListContent size="large" state="hover" label="Label of the list" sublabel="Sublabel"
              decorativeIcon={<Plus strokeWidth={1.5} />}
            />
          </div>
          <div data-variant-id="large-active" className="rounded-klp-m border border-klp-border-default p-4 flex items-center justify-center">
            <ListContent size="large" state="active" label="Label of the list" sublabel="Sublabel"
              decorativeIcon={<Plus strokeWidth={1.5} />}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
