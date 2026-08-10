import { useEffect } from 'react'
import { DataField } from '@/components/data-field'

// Brand this component was designed against
const CAPTURE_BRAND = 'klub'

const LONG_VALUE =
  'Id ultricies a ullamcorper condimentum a id facilisi nec a suspendisse lobortis egestas sit vestibulum vestibulum adipiscing parturient dolor fringilla vestibulum a magna posuere volutpat.'

const EMPHASES = ['default', 'strong'] as const

export function DataFieldRoute() {
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
        Data Field — captured in {CAPTURE_BRAND}
      </h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-klp-label text-klp-fg-muted">Emphasis × content length</h2>
        <div className="grid grid-cols-2 gap-4">
          {EMPHASES.map((emphasis) => (
            <div
              key={`short-${emphasis}`}
              data-variant-id={`${emphasis}-short`}
              className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
            >
              <span className="text-xs text-klp-fg-muted font-klp-label">{emphasis} · short</span>
              <DataField label="Order reference" value="KLP-2026-00418" emphasis={emphasis} />
            </div>
          ))}
          {EMPHASES.map((emphasis) => (
            <div
              key={`long-${emphasis}`}
              data-variant-id={`${emphasis}-long`}
              className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
            >
              <span className="text-xs text-klp-fg-muted font-klp-label">{emphasis} · long</span>
              <DataField label="Personalized message" value={LONG_VALUE} emphasis={emphasis} />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-klp-label text-klp-fg-muted">Empty value</h2>
        <div className="grid grid-cols-2 gap-4">
          <div
            data-variant-id="default-empty"
            className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
          >
            <span className="text-xs text-klp-fg-muted font-klp-label">default emptyText</span>
            <DataField label="Delivery note" value={null} />
          </div>
          <div
            data-variant-id="default-empty-custom"
            className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
          >
            <span className="text-xs text-klp-fg-muted font-klp-label">custom emptyText</span>
            <DataField label="Delivery note" value="" emptyText="Non renseigné" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-klp-label text-klp-fg-muted">Stacked (read-only form)</h2>
        <div className="flex w-[420px] flex-col gap-klp-size-m rounded-klp-m border border-klp-border-default p-4">
          <DataField label="Full name" value="Camille Durand" emphasis="strong" />
          <DataField label="Email" value="camille.durand@example.com" />
          <DataField label="Personalized message" value={LONG_VALUE} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-klp-label text-klp-fg-muted">Across brands</h2>
        <div className="grid grid-cols-4 gap-4">
          {(['wireframe', 'klub', 'atlas', 'showup'] as const).map((brand) => (
            <div
              key={brand}
              data-brand={brand}
              className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default bg-klp-bg-default p-4"
            >
              <span className="text-xs text-klp-fg-muted font-klp-label">{brand}</span>
              <DataField label="Order reference" value="KLP-2026-00418" />
              <DataField label="Total" value="1 240,00 €" emphasis="strong" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
