import * as React from 'react'
import { cva } from 'class-variance-authority'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Clock } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { CalendarButton } from '@/components/calendar-button'
import { Separator } from '@/components/separator'

// ---------------------------------------------------------------------------
// Composition discipline
//   REUSED: button          → the 4 header nav affordances (tertiary/icon)
//   REUSED: calendar-button → every day-grid cell (default/other-month/today/
//                              selected/disable state fully owned by that component)
//   REUSED: input            → footer hour field (size="small")
//   REUSED: separator        → footer rule (direction="horizontal" margin="none")
// ---------------------------------------------------------------------------

// ─── root layer ─────────────────────────────────────────────────────────────
// fill: --klp-bg-default · cornerRadius: --klp-radius-l · padding: --klp-size-m
// itemSpacing/width/boxShadow are literal (not bound to a token) in the spec.
// Width: 360px is the Figma capture and stays the standalone default, but it is
// a plain `w-` utility so a host can override it with cn/tailwind-merge — e.g.
// `w-[var(--radix-popover-trigger-width)]` to track an input it drops out of.
// `min-w-[320px]` is the floor: below it the 7x36px day cells would collide.
const rootVariants = cva(
  'flex w-[360px] min-w-[320px] flex-col gap-[16px] rounded-klp-l bg-klp-bg-default px-klp-size-m py-klp-size-m shadow-[0_7px_22px_rgba(0,0,0,0.25),0_0_1.5px_rgba(0,0,0,0.30),0_0_1px_rgba(0,0,0,0.40)]'
)

// ─── header layer ───────────────────────────────────────────────────────────
// All properties on this layer are literal (no token bindings captured).
const headerVariants = cva('flex h-[52px] flex-row items-center gap-[8px] px-[8px] py-[8px]')

// ─── month-label layer ──────────────────────────────────────────────────────
// color: --klp-fg-muted · fontSize: --klp-font-size-text-medium
// fontFamily: --klp-font-family-label · fontWeight: --klp-font-weight-label-bold
// lineHeight/textAlign are literal.
const monthLabelVariants = cva(
  'flex-1 text-center font-klp-label font-klp-label-bold text-klp-text-medium leading-[24px] text-klp-fg-muted'
)

// ─── day-grid layer ─────────────────────────────────────────────────────────
// itemSpacing/width are literal.
const dayGridVariants = cva('flex w-full flex-col gap-[8px]')

// ─── weekday-header layer ───────────────────────────────────────────────────
// itemSpacing/justify/height are literal.
// No fixed gap: `justify-between` distributes the leftover space, which lands on
// Figma's captured 13px at the 360px default (328 inner - 7x36 cells = 76 / 6)
// and shrinks gracefully down to the 320px floor instead of overflowing.
const weekdayHeaderVariants = cva('flex h-[24px] flex-row justify-between')

// ─── weekday-label layer ────────────────────────────────────────────────────
// color: --klp-fg-muted · fontSize: --klp-font-size-text-small
// fontFamily: --klp-font-family-body · fontWeight: --klp-font-weight-body
// width/height/textAlign are literal.
const weekdayLabelVariants = cva(
  'flex h-[24px] w-[36px] items-center justify-center font-klp-body font-klp-body text-klp-text-small text-klp-fg-muted leading-[18px]'
)

// ─── week-row layer ─────────────────────────────────────────────────────────
// itemSpacing/justify/height are literal.
const weekRowVariants = cva('flex h-[36px] flex-row justify-between')

// ─── footer layer ───────────────────────────────────────────────────────────
// itemSpacing/height are literal.
const footerVariants = cva('flex h-[40px] flex-row items-center gap-[19px]')

// ─── footer-label layer ─────────────────────────────────────────────────────
// color: --klp-fg-default · fontSize: --klp-font-size-text-medium
// fontFamily: --klp-font-family-label · fontWeight: --klp-font-weight-label-bold
// lineHeight is literal.
const footerLabelVariants = cva(
  'shrink-0 font-klp-label font-klp-label-bold text-klp-text-medium leading-[24px] text-klp-fg-default'
)

// ─── Date helpers ───────────────────────────────────────────────────────────
// Week starts on Monday (Figma weekday-header sample reads "Mo" first).

const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0] // Mon..Sun, JS getDay() indices

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function isSameDay(a: Date | undefined, b: Date | undefined): boolean {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

interface MonthDay {
  date: Date
  otherMonth: boolean
}

/** Builds a Monday-first month grid. Rows are always full weeks (7 days);
 * the row count (5 or 6) is derived from the displayed month so every date
 * is reachable — the Figma capture shows a 5-row sample month, this covers
 * the general case without truncating longer months. */
function buildMonthGrid(monthDate: Date): MonthDay[][] {
  const first = startOfMonth(monthDate)
  const firstWeekday = WEEKDAY_ORDER.indexOf(first.getDay())
  const gridStart = new Date(first)
  gridStart.setDate(first.getDate() - firstWeekday)

  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7

  const days: MonthDay[] = []
  for (let i = 0; i < totalCells; i++) {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    days.push({ date: d, otherMonth: d.getMonth() !== monthDate.getMonth() })
  }

  const weeks: MonthDay[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
}

function weekdayLabels(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  // 2023-01-02 is a Monday — used purely as a stable Monday anchor.
  const monday = new Date(2023, 0, 2)
  return WEEKDAY_ORDER.map((_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const label = formatter.format(d)
    return label.charAt(0).toUpperCase() + label.charAt(1)
  })
}

// ─── Public types ───────────────────────────────────────────────────────────

// `defaultValue` is omitted from HTMLAttributes because this component redefines
// it as a Date. Extending HTMLAttributes (and spreading the rest onto the root)
// is what makes the panel embeddable: Radix clones it via `asChild` and injects
// positioning `style`, `data-state`, `id`, `role` and keyboard handlers, all of
// which would be silently dropped without a spread.
export interface CalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  /** Controlled selected date.
   * @propClass optional
   */
  value?: Date
  /** Default selected date (uncontrolled).
   * @propClass optional
   */
  defaultValue?: Date
  /** Callback fired when the selected date changes.
   * @propClass optional
   */
  onValueChange?: (date: Date) => void
  /** Controlled displayed month (any Date within the month works).
   * @propClass optional
   */
  month?: Date
  /** Default displayed month (uncontrolled).
   * @propClass optional
   */
  defaultMonth?: Date
  /** Callback fired when the displayed month changes (via header nav).
   * @propClass optional
   */
  onMonthChange?: (date: Date) => void
  /** Predicate marking individual dates as disabled/non-selectable.
   * @propClass optional
   */
  isDateDisabled?: (date: Date) => boolean
  /** Reference "today" date, used to highlight the current day. Defaults to `new Date()`.
   * @propClass optional
   */
  today?: Date
  /** Locale used to format the month label and weekday abbreviations.
   * @propClass optional
   */
  locale?: string
  /** Shows the footer "Select an hour" row with a time Input, matching the Figma capture.
   * @propClass optional
   */
  showTimePicker?: boolean
  /** Controlled hour field value (footer time Input).
   * @propClass optional
   */
  hourValue?: string
  /** Default hour field value (uncontrolled).
   * @propClass optional
   */
  defaultHourValue?: string
  /** Callback fired when the hour field value changes.
   * @propClass optional
   */
  onHourValueChange?: (value: string) => void
  /** Additional className applied to the root panel.
   * @propClass optional
   */
  className?: string
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      month,
      defaultMonth,
      onMonthChange,
      isDateDisabled,
      today = new Date(),
      locale = 'en-US',
      showTimePicker = true,
      hourValue,
      defaultHourValue,
      onHourValueChange,
      className,
      ...props
    },
    ref
  ) => {
    // ── selected date (controlled/uncontrolled) ──────────────────────────
    const [internalValue, setInternalValue] = React.useState<Date | undefined>(defaultValue)
    const isValueControlled = value !== undefined
    const selectedDate = isValueControlled ? value : internalValue

    const selectDate = (date: Date) => {
      if (!isValueControlled) setInternalValue(date)
      onValueChange?.(date)
    }

    // ── displayed month (controlled/uncontrolled) ─────────────────────────
    const [internalMonth, setInternalMonth] = React.useState<Date>(
      startOfMonth(defaultMonth ?? selectedDate ?? today)
    )
    const isMonthControlled = month !== undefined
    const displayedMonth = startOfMonth(isMonthControlled ? month : internalMonth)

    const changeMonth = (next: Date) => {
      if (!isMonthControlled) setInternalMonth(next)
      onMonthChange?.(next)
    }

    const goToPrevYear = () =>
      changeMonth(new Date(displayedMonth.getFullYear() - 1, displayedMonth.getMonth(), 1))
    const goToNextYear = () =>
      changeMonth(new Date(displayedMonth.getFullYear() + 1, displayedMonth.getMonth(), 1))
    const goToPrevMonth = () =>
      changeMonth(new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1))
    const goToNextMonth = () =>
      changeMonth(new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1))

    // ── hour field (controlled/uncontrolled) ──────────────────────────────
    const [internalHourValue, setInternalHourValue] = React.useState(defaultHourValue ?? '')
    const isHourControlled = hourValue !== undefined
    const currentHourValue = isHourControlled ? hourValue : internalHourValue
    const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isHourControlled) setInternalHourValue(e.target.value)
      onHourValueChange?.(e.target.value)
    }

    const weeks = React.useMemo(() => buildMonthGrid(displayedMonth), [displayedMonth])
    const weekdays = React.useMemo(() => weekdayLabels(locale), [locale])
    const monthLabel = React.useMemo(
      () =>
        new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(displayedMonth),
      [locale, displayedMonth]
    )
    const monthLabelCapitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)

    return (
      <div
        ref={ref}
        // role comes before the spread so a host (e.g. Popover.Content asChild,
        // which sets role="dialog") can override it.
        role="application"
        className={cn(rootVariants(), className)}
        {...props}
      >
        {/* header layer — REUSED: button (tertiary/icon) x4 */}
        <div className={headerVariants()}>
          <Button
            variant="tertiary"
            size="icon"
            aria-label="Previous year"
            onClick={goToPrevYear}
          >
            <ChevronsLeft aria-hidden="true" strokeWidth={1.5} />
          </Button>
          <Button
            variant="tertiary"
            size="icon"
            aria-label="Previous month"
            onClick={goToPrevMonth}
          >
            <ChevronLeft aria-hidden="true" strokeWidth={1.5} />
          </Button>
          <span className={monthLabelVariants()}>{monthLabelCapitalized}</span>
          <Button variant="tertiary" size="icon" aria-label="Next month" onClick={goToNextMonth}>
            <ChevronRight aria-hidden="true" strokeWidth={1.5} />
          </Button>
          <Button variant="tertiary" size="icon" aria-label="Next year" onClick={goToNextYear}>
            <ChevronsRight aria-hidden="true" strokeWidth={1.5} />
          </Button>
        </div>

        {/* day-grid layer */}
        <div className={cn(dayGridVariants(), 'mx-auto')} role="grid" aria-label={monthLabelCapitalized}>
          <div className={weekdayHeaderVariants()} role="row">
            {weekdays.map((label, i) => (
              <span key={i} className={weekdayLabelVariants()} role="columnheader">
                {label}
              </span>
            ))}
          </div>

          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className={weekRowVariants()} role="row">
              {week.map((cell) => {
                const disabled = isDateDisabled?.(cell.date) ?? false
                return (
                  // day-cell layer — REUSED: calendar-button
                  <CalendarButton
                    key={cell.date.toISOString()}
                    day={cell.date.getDate()}
                    otherMonth={cell.otherMonth}
                    today={isSameDay(cell.date, today)}
                    selected={isSameDay(cell.date, selectedDate)}
                    disabled={disabled}
                    aria-label={new Intl.DateTimeFormat(locale, {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }).format(cell.date)}
                    onClick={() => selectDate(cell.date)}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {showTimePicker && (
          <>
            {/* separator layer — REUSED: separator */}
            <Separator direction="horizontal" margin="none" />

            {/* footer layer — REUSED: input (size="small") */}
            <div className={footerVariants()}>
              <span className={footerLabelVariants()}>Select an hour</span>
              <Input
                size="small"
                placeholder="00:00"
                value={currentHourValue}
                onChange={handleHourChange}
                iconRight={<Clock aria-hidden="true" strokeWidth={1.5} className="h-[16px] w-[16px]" />}
                aria-label="Select an hour"
              />
            </div>
          </>
        )}
      </div>
    )
  }
)
Calendar.displayName = 'Calendar'

export {
  rootVariants,
  headerVariants,
  monthLabelVariants,
  dayGridVariants,
  weekdayHeaderVariants,
  weekdayLabelVariants,
  weekRowVariants,
  footerVariants,
  footerLabelVariants,
}
