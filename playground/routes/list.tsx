import { useEffect } from 'react'
import { List } from '@/components/list'
import { ListContent } from '@/components/list-content'

const CAPTURE_BRAND = 'wireframe'

const DEMO_ITEMS = [
  { key: 'row-1', label: 'Label of the list', sublabel: 'Sublabel' },
  { key: 'row-2', label: 'Label of the list', sublabel: 'Sublabel' },
  { key: 'row-3', label: 'Label of the list', sublabel: 'Sublabel' },
]

export function ListRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev
    }
  }, [])

  return (
    <div className="flex flex-col gap-10 p-6">
      <h1 className="text-xl font-semibold">List — captured in {CAPTURE_BRAND}</h1>

      <div className="grid grid-cols-1 gap-8 max-w-lg">

        {/* condensed */}
        <div
          data-variant-id="condensed"
          className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
        >
          <p className="text-xs text-klp-fg-muted mb-2">condensed</p>
          <List
            listStyle="condensed"
            listTitle="List title"
            buttonLabel="See all"
            itemSize="small"
          >
            <ListContent size="small" state="default" label="Label of the list" sublabel="Sublabel" />
            <ListContent size="small" state="default" label="Label of the list" sublabel="Sublabel" />
            <ListContent size="small" state="default" label="Label of the list" sublabel="Sublabel" />
          </List>
        </div>

        {/* default */}
        <div
          data-variant-id="default"
          className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
        >
          <p className="text-xs text-klp-fg-muted mb-2">default</p>
          <List
            listStyle="default"
            listTitle="List title"
            buttonLabel="See all"
            itemSize="medium"
            items={DEMO_ITEMS}
          />
        </div>

        {/* with-inputs */}
        <div
          data-variant-id="with-inputs"
          className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
        >
          <p className="text-xs text-klp-fg-muted mb-2">with-inputs</p>
          <List
            listStyle="with-inputs"
            listTitle="List title"
            showButton={false}
            itemSize="medium"
            headerInputs={
              <div className="flex gap-klp-size-m">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border border-klp-border-default rounded-klp-l px-klp-size-s py-klp-size-2xs text-klp-text-medium text-klp-fg-default bg-klp-bg-default focus:outline-none focus:ring-2 focus:ring-klp-border-brand-emphasis"
                />
              </div>
            }
            items={DEMO_ITEMS}
          />
        </div>

      </div>
    </div>
  )
}
