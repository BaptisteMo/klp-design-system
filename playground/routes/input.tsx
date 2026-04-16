import { useEffect } from 'react'
import { Input } from '@/components/input'

const CAPTURE_BRAND = 'klub'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

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
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Input — captured in {CAPTURE_BRAND}</h1>

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
              iconLeft={<SearchIcon />}
              iconRight={<ChevronIcon />}
              placeholder="Placeholder"
              defaultValue={value}
              disabled={state === 'disable'}
              aria-invalid={state === 'danger' ? 'true' : undefined}
              id={`input-${id}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
