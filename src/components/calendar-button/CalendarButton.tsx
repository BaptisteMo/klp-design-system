import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ─── root layer ───────────────────────────────────────────────────────────────
// 36x36 day cell. Fill/stroke are fully state-driven; radius/padding/gap are
// uniform across states. Figma's Left/Right Icon slots are visible:false in
// every one of the 5 states, so no icon markup is emitted (see spec notes).
const rootVariants = cva(
  'group inline-flex h-[36px] w-[36px] shrink-0 items-center justify-center gap-klp-size-2xs rounded-klp-l border px-klp-size-s py-klp-size-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klp-border-brand-emphasis',
  {
    variants: {
      state: {
        default: 'cursor-pointer bg-klp-bg-default border-klp-border-invisible hover:bg-klp-bg-subtle',
        'other-month': 'cursor-pointer bg-klp-bg-default border-klp-border-invisible hover:bg-klp-bg-subtle',
        disable: 'cursor-not-allowed bg-klp-bg-disable border-klp-border-invisible pointer-events-none',
        today: 'cursor-pointer bg-klp-bg-subtle border-klp-border-default hover:bg-klp-bg-default',
        selected: 'cursor-pointer bg-klp-bg-brand border-klp-border-invisible hover:bg-klp-bg-brand-contrasted',
      },
    },
    defaultVariants: { state: 'default' },
  }
)

// ─── label layer ──────────────────────────────────────────────────────────────
// Day number. Color is the only property that varies by state; font metrics
// (size/family/weight) are uniform across all 5 states.
const labelVariants = cva('font-klp-label font-klp-label-bold text-klp-text-medium leading-6', {
  variants: {
    state: {
      default: 'text-klp-fg-default',
      'other-month': 'text-klp-fg-subtle',
      disable: 'text-klp-fg-disable',
      today: 'text-klp-fg-default',
      selected: 'text-klp-fg-on-emphasis',
    },
  },
  defaultVariants: { state: 'default' },
})

// ─── Public types ─────────────────────────────────────────────────────────────

export type CalendarButtonState = 'default' | 'other-month' | 'disable' | 'today' | 'selected'

export interface CalendarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rootVariants> {
  /** The day number rendered inside the cell.
   * @propClass required
   */
  day: number
  /** Marks this cell as belonging to the previous/next month (rendered in muted text).
   * @propClass optional
   */
  otherMonth?: boolean
  /** Marks this cell as today's date. Sets `aria-current="date"`.
   * @propClass optional
   */
  today?: boolean
  /** Marks this cell as the currently selected date. Sets `aria-pressed="true"`.
   * @propClass optional
   */
  selected?: boolean
  /**
   * Explicit visual state override. When omitted the component derives state from
   * the native `disabled` attribute (highest priority) and the `selected` / `today` /
   * `otherMonth` props, in that order.
   *
   * @propClass computed
   * @derivedFrom disabled, selected, today, otherMonth
   */
  state?: CalendarButtonState
  /** Additional className applied to the root button.
   * @propClass optional
   */
  className?: string
}

export const CalendarButton = React.forwardRef<HTMLButtonElement, CalendarButtonProps>(
  (
    {
      day,
      otherMonth = false,
      today = false,
      selected = false,
      state: stateProp,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Derive state with explicit priority:
    // 1. stateProp wins (used by playground variant grid + consumer overrides)
    // 2. disabled (native, declarative HTML state) always wins over date context
    // 3. selected → today → otherMonth → default
    const derivedState: CalendarButtonState = (() => {
      if (stateProp) return stateProp
      if (disabled) return 'disable'
      if (selected) return 'selected'
      if (today) return 'today'
      if (otherMonth) return 'other-month'
      return 'default'
    })()

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-current={derivedState === 'today' ? 'date' : undefined}
        aria-pressed={derivedState === 'selected' ? true : undefined}
        className={cn(rootVariants({ state: derivedState }), className)}
        {...props}
      >
        <span className={labelVariants({ state: derivedState })}>{day}</span>
      </button>
    )
  }
)
CalendarButton.displayName = 'CalendarButton'

export { rootVariants, labelVariants }
