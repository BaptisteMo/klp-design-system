import { useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { Input } from '@/components/input'

const CAPTURE_BRAND = 'klub'

type Size = 'large' | 'medium' | 'small'
type State = 'default' | 'filled' | 'focused' | 'success' | 'danger' | 'disable'

interface VariantCell {
  id: string
  size: Size
  state: State
  value?: string
}

const VARIANTS: VariantCell[] = [
  { id: 'large-default',  size: 'large',  state: 'default'  },
  { id: 'large-filled',   size: 'large',  state: 'filled',  value: 'Label' },
  { id: 'large-focused',  size: 'large',  state: 'focused'  },
  { id: 'large-success',  size: 'large',  state: 'success', value: 'Label' },
  { id: 'large-danger',   size: 'large',  state: 'danger',  value: 'Label' },
  { id: 'large-disable',  size: 'large',  state: 'disable'  },
  { id: 'medium-default', size: 'medium', state: 'default'  },
  { id: 'medium-filled',  size: 'medium', state: 'filled',  value: 'Label' },
  { id: 'medium-focused', size: 'medium', state: 'focused'  },
  { id: 'medium-success', size: 'medium', state: 'success', value: 'Label' },
  { id: 'medium-danger',  size: 'medium', state: 'danger',  value: 'Label' },
  { id: 'medium-disable', size: 'medium', state: 'disable'  },
  { id: 'small-default',  size: 'small',  state: 'default'  },
  { id: 'small-filled',   size: 'small',  state: 'filled',  value: 'Label' },
  { id: 'small-focused',  size: 'small',  state: 'focused'  },
  { id: 'small-success',  size: 'small',  state: 'success', value: 'Label' },
  { id: 'small-danger',   size: 'small',  state: 'danger',  value: 'Label' },
  { id: 'small-disable',  size: 'small',  state: 'disable'  },
]

export function InputRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-xl font-semibold">Input — captured in {CAPTURE_BRAND}</h1>

      {/* Interactive demo — no `state` prop, so the component derives focused/filled
          from real focus/value events. Click in, type, tab away to see transitions. */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Try it live (no state prop — auto-derived)</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4">
            <span className="font-klp-label text-klp-text-smaller text-klp-fg-muted">large — interactive</span>
            <Input
              label="Email"
              size="large"
              showInfoIcon
              iconLeft={<Search className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />}
              placeholder="Type to see filled state"
            />
          </div>
          <div className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4">
            <span className="font-klp-label text-klp-text-smaller text-klp-fg-muted">medium — interactive</span>
            <Input
              label="Search"
              size="medium"
              iconLeft={<Search className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />}
              iconRight={<ChevronDown className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />}
              placeholder="Click to focus"
            />
          </div>
          <div className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4">
            <span className="font-klp-label text-klp-text-smaller text-klp-fg-muted">small — interactive</span>
            <Input
              label="Tag"
              size="small"
              placeholder="No icons"
            />
          </div>
        </div>
      </section>

      {/* Static variant matrix — every cell locks `state` via prop so the visual
          per-state appearance can be reviewed without interacting. */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Locked variant grid (state prop overrides interaction)</h2>
        <div className="grid grid-cols-3 gap-6">
          {VARIANTS.map(({ id, size, state, value }) => (
            <div
              key={id}
              data-variant-id={id}
              className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
            >
              <span className="font-klp-label text-klp-text-smaller text-klp-fg-muted">
                {id}
              </span>
              <Input
                label="Label of the input"
                size={size}
                state={state}
                showInfoIcon
                iconLeft={<Search className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />}
                iconRight={<ChevronDown className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />}
                placeholder="Placeholder"
                defaultValue={value}
                disabled={state === 'disable'}
                aria-invalid={state === 'danger' ? 'true' : undefined}
                id={`input-${id}`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
