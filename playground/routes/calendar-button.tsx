import { useEffect } from 'react'
import { CalendarButton } from '@/components/calendar-button'

const CAPTURE_BRAND = 'klub'

interface VariantCell {
  id: string
  day: number
  otherMonth?: boolean
  today?: boolean
  selected?: boolean
  disabled?: boolean
}

const VARIANTS: VariantCell[] = [
  { id: 'default', day: 1 },
  { id: 'other-month', day: 30, otherMonth: true },
  { id: 'disable', day: 12, disabled: true },
  { id: 'today', day: 4, today: true },
  { id: 'selected', day: 9, selected: true },
]

export function CalendarButtonRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-xl font-semibold">Calendar Button — captured in {CAPTURE_BRAND}</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Variant grid (state prop derived)</h2>
        <div className="grid grid-cols-5 gap-6">
          {VARIANTS.map(({ id, day, otherMonth, today, selected, disabled }) => (
            <div
              key={id}
              data-variant-id={id}
              className="flex flex-col items-center gap-2 rounded-klp-m border border-klp-border-default p-4"
            >
              <span className="font-klp-label text-klp-text-smaller text-klp-fg-muted">{id}</span>
              <CalendarButton
                day={day}
                otherMonth={otherMonth}
                today={today}
                selected={selected}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Sample month grid</h2>
        <div className="grid w-fit grid-cols-7 gap-1 rounded-klp-l border border-klp-border-default p-4">
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 2
            const otherMonth = day < 1 || day > 30
            const displayDay = otherMonth ? ((day - 1 + 30) % 30) + 1 : day
            return (
              <CalendarButton
                key={i}
                day={displayDay}
                otherMonth={otherMonth}
                today={!otherMonth && displayDay === 15}
                selected={!otherMonth && displayDay === 20}
                disabled={!otherMonth && displayDay === 3}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}
