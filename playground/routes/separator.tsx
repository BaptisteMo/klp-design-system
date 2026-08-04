import { useEffect } from 'react'
import { Separator } from '@/components/separator'

// Brand in which Figma references were captured
const CAPTURE_BRAND = 'klub'

export function SeparatorRoute() {
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
        Separator — captured in {CAPTURE_BRAND}
      </h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-klp-label text-klp-fg-muted">Horizontal</h2>
        <div className="grid grid-cols-4 gap-4">
          {(['none', 'small', 'medium', 'large'] as const).map((margin) => (
            <div
              key={`horizontal-${margin}`}
              data-variant-id={`${margin}-horizontal`}
              className="flex flex-col rounded-klp-m border border-klp-border-default p-4"
            >
              <span className="text-xs text-klp-fg-muted font-klp-label pb-2">{margin}</span>
              <span className="text-klp-text-small text-klp-fg-default">Section A</span>
              <Separator direction="horizontal" margin={margin} />
              <span className="text-klp-text-small text-klp-fg-default">Section B</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-klp-label text-klp-fg-muted">Vertical</h2>
        <div className="grid grid-cols-4 gap-4">
          {(['none', 'small', 'medium', 'large'] as const).map((margin) => (
            <div
              key={`vertical-${margin}`}
              data-variant-id={`${margin}-vertical`}
              className="flex flex-col rounded-klp-m border border-klp-border-default p-4"
            >
              <span className="text-xs text-klp-fg-muted font-klp-label pb-2">{margin}</span>
              <div className="flex h-[80px] items-stretch">
                <span className="text-klp-text-small text-klp-fg-default">A</span>
                <Separator direction="vertical" margin={margin} />
                <span className="text-klp-text-small text-klp-fg-default">B</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
