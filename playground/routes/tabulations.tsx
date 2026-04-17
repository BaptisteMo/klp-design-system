import { useEffect } from 'react'
import { Tabulations, TabulationsContent } from '@/components/tabulations'

const CAPTURE_BRAND = 'klub'

export function TabulationsRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Tabulations — captured in {CAPTURE_BRAND}</h1>

      <div className="flex flex-col gap-4">
        {/* scroll-type-none-default — the single variant from spec */}
        <div
          data-variant-id="scroll-type-none-default"
          className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-8"
        >
          <Tabulations
            defaultValue="tab1"
            tabs={[
              { value: 'tab1', label: 'Label', badge: 3 },
              { value: 'tab2', label: 'Label', badge: 12 },
              { value: 'tab3', label: 'Label' },
            ]}
          >
            <TabulationsContent value="tab1" />
            <TabulationsContent value="tab2" />
            <TabulationsContent value="tab3" />
          </Tabulations>
        </div>

        {/* Additional showcase: no badges */}
        <div className="flex items-center justify-center rounded-klp-m border border-klp-border-default p-8">
          <Tabulations
            defaultValue="a"
            tabs={[
              { value: 'a', label: 'Label' },
              { value: 'b', label: 'Label' },
              { value: 'c', label: 'Label' },
              { value: 'd', label: 'Label' },
            ]}
          >
            <TabulationsContent value="a" />
            <TabulationsContent value="b" />
            <TabulationsContent value="c" />
            <TabulationsContent value="d" />
          </Tabulations>
        </div>
      </div>
    </div>
  )
}
