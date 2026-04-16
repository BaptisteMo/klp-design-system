import * as React from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/button'

// Force atlas brand for this route (captureBrand = "atlas" in spec)
function useForceBrand(brand: string) {
  React.useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = brand
    return () => {
      if (prev !== undefined) {
        document.documentElement.dataset.brand = prev
      } else {
        delete document.documentElement.dataset.brand
      }
    }
  }, [brand])
}


function Cell({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div
      data-variant-id={id}
      className="flex items-center justify-center rounded-klp-m border border-klp-border-default bg-klp-bg-subtle p-4"
    >
      {children}
    </div>
  )
}

export function ButtonRoute() {
  useForceBrand('atlas')

  return (
    <div className="flex flex-col gap-klp-size-xl">
      <h1
        className="text-klp-heading-h3 font-klp-title"
        style={{ fontWeight: 'var(--font-weight-klp-title)' }}
      >
        Button
      </h1>

      {/* ── Primary ─────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-klp-size-s">
        <h2 className="text-klp-text-small font-klp-label text-klp-fg-muted uppercase tracking-wide">
          Primary
        </h2>
        <div className="grid grid-cols-4 gap-klp-size-s">
          <Cell id="primary-sm-rest">
            <Button variant="primary" size="sm" leftIcon={<Check />} rightIcon={<Check />}>
              Label
            </Button>
          </Cell>
          <Cell id="primary-md-rest">
            <Button variant="primary" size="md" leftIcon={<Check />} rightIcon={<Check />}>
              Label
            </Button>
          </Cell>
          <Cell id="primary-lg-rest">
            <Button variant="primary" size="lg" leftIcon={<Check />} rightIcon={<Check />}>
              Label
            </Button>
          </Cell>
          {/* hover state: override root bg+border to the hover tokens */}
          <Cell id="primary-md-hover">
            <Button
              variant="primary"
              size="md"
              className="bg-klp-bg-brand-contrasted border-klp-border-brand-emphasis"
              leftIcon={<Check />}
              rightIcon={<Check />}
            >
              Label
            </Button>
          </Cell>
          {/* clicked state */}
          <Cell id="primary-md-clicked">
            <Button
              variant="primary"
              size="md"
              className="bg-klp-bg-brand-contrasted border-klp-border-brand-contrasted"
              leftIcon={<Check />}
              rightIcon={<Check />}
            >
              Label
            </Button>
          </Cell>
          {/* disable state */}
          <Cell id="primary-md-disable">
            <Button
              variant="primary"
              size="md"
              disabled
              aria-disabled
              leftIcon={<Check />}
              rightIcon={<Check />}
            >
              Label
            </Button>
          </Cell>
        </div>
      </section>

      {/* ── Secondary ───────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-klp-size-s">
        <h2 className="text-klp-text-small font-klp-label text-klp-fg-muted uppercase tracking-wide">
          Secondary
        </h2>
        <div className="grid grid-cols-4 gap-klp-size-s">
          <Cell id="secondary-sm-rest">
            <Button variant="secondary" size="sm" leftIcon={<Check />} rightIcon={<Check />}>
              Label
            </Button>
          </Cell>
          <Cell id="secondary-md-rest">
            <Button variant="secondary" size="md" leftIcon={<Check />} rightIcon={<Check />}>
              Label
            </Button>
          </Cell>
          <Cell id="secondary-lg-rest">
            <Button variant="secondary" size="lg" leftIcon={<Check />} rightIcon={<Check />}>
              Label
            </Button>
          </Cell>
        </div>
      </section>

      {/* ── Tertiary ────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-klp-size-s">
        <h2 className="text-klp-text-small font-klp-label text-klp-fg-muted uppercase tracking-wide">
          Tertiary
        </h2>
        <div className="grid grid-cols-4 gap-klp-size-s">
          <Cell id="tertiary-sm-rest">
            <Button variant="tertiary" size="sm" leftIcon={<Check />} rightIcon={<Check />}>
              Label
            </Button>
          </Cell>
          <Cell id="tertiary-md-rest">
            <Button variant="tertiary" size="md" leftIcon={<Check />} rightIcon={<Check />}>
              Label
            </Button>
          </Cell>
          <Cell id="tertiary-lg-rest">
            <Button variant="tertiary" size="lg" leftIcon={<Check />} rightIcon={<Check />}>
              Label
            </Button>
          </Cell>
        </div>
      </section>

      {/* ── Destructive ─────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-klp-size-s">
        <h2 className="text-klp-text-small font-klp-label text-klp-fg-muted uppercase tracking-wide">
          Destructive
        </h2>
        <div className="grid grid-cols-4 gap-klp-size-s">
          <Cell id="destructive-md-rest">
            <Button variant="destructive" size="md" leftIcon={<Check />} rightIcon={<Check />}>
              Label
            </Button>
          </Cell>
          <Cell id="destructive-md-hover">
            <Button
              variant="destructive"
              size="md"
              className="border-2 border-klp-border-danger-contrasted"
              leftIcon={<Check />}
              rightIcon={<Check />}
            >
              Label
            </Button>
          </Cell>
          <Cell id="destructive-md-clicked">
            <Button
              variant="destructive"
              size="md"
              className="bg-klp-bg-danger-contrasted border-klp-border-danger-contrasted"
              leftIcon={<Check />}
              rightIcon={<Check />}
            >
              Label
            </Button>
          </Cell>
        </div>
      </section>

      {/* ── Validation ──────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-klp-size-s">
        <h2 className="text-klp-text-small font-klp-label text-klp-fg-muted uppercase tracking-wide">
          Validation
        </h2>
        <div className="grid grid-cols-4 gap-klp-size-s">
          <Cell id="validation-md-rest">
            <Button variant="validation" size="md" leftIcon={<Check />} rightIcon={<Check />}>
              Label
            </Button>
          </Cell>
        </div>
      </section>

      {/* ── Icon-only ───────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-klp-size-s">
        <h2 className="text-klp-text-small font-klp-label text-klp-fg-muted uppercase tracking-wide">
          Icon
        </h2>
        <div className="grid grid-cols-4 gap-klp-size-s">
          <Cell id="icon-primary-rest">
            <Button variant="primary" size="icon" aria-label="Confirm">
              <Check />
            </Button>
          </Cell>
          <Cell id="icon-secondary-rest">
            <Button variant="secondary" size="icon" aria-label="Confirm">
              <Check />
            </Button>
          </Cell>
          {/* tertiary icon uses bg-invisible + fg-muted per spec */}
          <Cell id="icon-tertiary-rest">
            <Button
              variant="tertiary"
              size="icon"
              aria-label="Confirm"
              className="bg-klp-bg-invisible border-klp-border-invisible text-klp-fg-muted"
            >
              <Check />
            </Button>
          </Cell>
          <Cell id="icon-destructive-rest">
            <Button variant="destructive" size="icon" aria-label="Delete">
              <Check />
            </Button>
          </Cell>
        </div>
      </section>
    </div>
  )
}
