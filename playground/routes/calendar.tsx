import { useEffect, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { CalendarDays } from 'lucide-react'
import { Calendar } from '@/components/calendar'
import { Input } from '@/components/input'

const CAPTURE_BRAND = 'klub'

export function CalendarRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [month, setMonth] = useState<Date>(new Date())

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-xl font-semibold">Calendar — captured in {CAPTURE_BRAND}</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Interactive</h2>
        <p className="text-klp-text-small text-klp-fg-muted font-klp-body">
          Selected: {date ? date.toDateString() : 'none'}
        </p>
        <div data-variant-id="default" className="w-fit">
          <Calendar
            value={date}
            onValueChange={setDate}
            month={month}
            onMonthChange={setMonth}
            isDateDisabled={(d) => d.getDay() === 0}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Without time picker</h2>
        <div className="w-fit">
          <Calendar showTimePicker={false} defaultValue={new Date()} />
        </div>
      </section>

      {/* Second supported usage: the same panel as an input's dropdown. The
          panel is not wrapped in any extra box — Popover.Content renders it
          directly via asChild, which only works because Calendar forwards its
          ref and spreads unknown props onto the root. */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">As an input dropdown</h2>
        <p className="text-klp-text-small text-klp-fg-muted font-klp-body">
          Wide field (480px) — the panel tracks the trigger width.
        </p>
        <DatePickerDemo width={480} />
        <p className="text-klp-text-small text-klp-fg-muted font-klp-body">
          Narrow field (240px) — the panel floors at its own min-width of 320px.
        </p>
        <DatePickerDemo width={240} />
      </section>
    </div>
  )
}

function DatePickerDemo({ width = 480 }: { width?: number }) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <div data-variant-id="as-input-dropdown" style={{ width }}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Anchor asChild>
          <div>
            <Popover.Trigger asChild>
              <Input
                label="Date of the event"
                size="small"
                type="text"
                readOnly
                value={date ? date.toLocaleDateString('en-GB') : ''}
                placeholder="Pick a date"
                iconRight={<CalendarDays aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />}
              />
            </Popover.Trigger>
          </div>
        </Popover.Anchor>

        <Popover.Portal>
          <Popover.Content sideOffset={4} align="start" className="z-50 outline-none" asChild>
            <Calendar
              // Track the trigger's width; the component's own min-w-[320px]
              // still wins on narrower fields.
              className="w-[var(--radix-popover-trigger-width)]"
              showTimePicker={false}
              value={date}
              onValueChange={(d) => {
                setDate(d)
                setOpen(false)
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
