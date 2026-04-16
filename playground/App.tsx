import { useSyncExternalStore, type ComponentType } from 'react'
import { Index } from './routes/_index'
import { ButtonRoute } from './routes/button'
import { CheckboxRoute } from './routes/checkbox'

const routes: Record<string, ComponentType> = {
  '': Index,
  'button': ButtonRoute,
  'checkbox': CheckboxRoute,
}

const BRANDS = ['wireframe', 'klub', 'atlas', 'showup'] as const
type Brand = (typeof BRANDS)[number]

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

function getHash() {
  return window.location.hash.replace(/^#\/?/, '')
}

function subscribeBrand(cb: () => void) {
  const observer = new MutationObserver(cb)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-brand'] })
  return () => observer.disconnect()
}

function getBrand(): Brand {
  const current = document.documentElement.dataset.brand as Brand | undefined
  return current && (BRANDS as readonly string[]).includes(current) ? current : 'wireframe'
}

export function App() {
  const hash = useSyncExternalStore(subscribe, getHash, () => '')
  const brand = useSyncExternalStore(subscribeBrand, getBrand, () => 'wireframe' as Brand)
  const Route = routes[hash] ?? NotFound

  return (
    <div className="min-h-screen bg-klp-bg-default text-klp-fg-default font-klp-body">
      <header className="flex items-center justify-between border-b border-klp-border-default px-6 py-4">
        <a href="#/" className="font-klp-mono text-sm text-klp-fg-muted hover:text-klp-fg-default">
          @klp/ui playground
        </a>
        <div className="flex gap-1" role="radiogroup" aria-label="Brand">
          {BRANDS.map((b) => (
            <button
              key={b}
              type="button"
              role="radio"
              aria-checked={brand === b}
              onClick={() => setBrand(b)}
              className={
                brand === b
                  ? 'rounded-klp-m border border-klp-border-brand bg-klp-bg-brand px-3 py-1 text-xs font-klp-mono text-klp-fg-on-emphasis'
                  : 'rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-3 py-1 text-xs font-klp-mono text-klp-fg-muted hover:text-klp-fg-default'
              }
            >
              {b}
            </button>
          ))}
        </div>
      </header>
      <main className="p-6">
        <Route />
      </main>
    </div>
  )
}

function NotFound() {
  return (
    <div className="text-klp-fg-muted">
      Unknown route. <a className="underline" href="#/">← back to index</a>
    </div>
  )
}

function setBrand(brand: Brand) {
  document.documentElement.dataset.brand = brand
}
