import * as React from 'react'
import { cva } from 'class-variance-authority'
import { Hourglass, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// root layer — tr
// Spec bindings: stroke → border-klp-border-default, fill → bg-klp-bg-subtle (hover/floating-on),
// height → h-klp-size-3xl, paddingTop/Bottom literals → pt-[2px] pb-[2px]
// empty variant: pt-klp-size-3xl pr-klp-size-3xl pb-klp-size-3xl pl-klp-size-3xl, gap-klp-size-2xl
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'border-b border-klp-border-default transition-colors',
  {
    variants: {
      variant: {
        'default':           'h-klp-size-3xl pt-[2px] pb-[2px]',
        'default-hover':     'bg-klp-bg-subtle h-klp-size-3xl pt-[2px] pb-[2px]',
        'floating-action-on':  'bg-klp-bg-subtle h-klp-size-3xl pt-[2px] pb-[2px]',
        'floating-action-off': 'h-klp-size-3xl pt-[2px] pb-[2px]',
        'empty':             'pt-klp-size-3xl pr-klp-size-3xl pb-klp-size-3xl pl-klp-size-3xl border-none',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

// ---------------------------------------------------------------------------
// cell-checkbox layer — td
// No token bindings beyond visibility (hidden in empty)
// ---------------------------------------------------------------------------
const cellCheckboxVariants = cva('', {
  variants: {
    variant: {
      'default':             '',
      'default-hover':       '',
      'floating-action-on':  '',
      'floating-action-off': '',
      'empty':               'hidden',
    },
  },
  defaultVariants: { variant: 'default' },
})

// ---------------------------------------------------------------------------
// cell-left layer — td
// Hidden in empty
// ---------------------------------------------------------------------------
const cellLeftVariants = cva('', {
  variants: {
    variant: {
      'default':             '',
      'default-hover':       '',
      'floating-action-on':  '',
      'floating-action-off': '',
      'empty':               'hidden',
    },
  },
  defaultVariants: { variant: 'default' },
})

// ---------------------------------------------------------------------------
// cell-badge layer — span
// fill → bg-klp-bg-info, stroke → border-klp-border-invisible, gap → gap-klp-size-2xs
// color → text-klp-fg-info (applies to icon inside)
// ---------------------------------------------------------------------------
const cellBadgeVariants = cva(
  'inline-flex items-center gap-klp-size-2xs rounded-klp-l border border-klp-border-invisible bg-klp-bg-info text-klp-fg-info',
  {
    variants: {
      variant: {
        'default':             '',
        'default-hover':       '',
        'floating-action-on':  '',
        'floating-action-off': '',
        'empty':               'hidden',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

// ---------------------------------------------------------------------------
// cell-text layer — td / span
// color → text-klp-fg-muted (secondary text), primary text → text-klp-fg-default + font-klp-body-bold
// fontSize → text-klp-text-medium, fontFamily → font-klp-body, fontWeight → font-klp-body (body regular)
// ---------------------------------------------------------------------------
const cellTextVariants = cva(
  'font-klp-body text-klp-text-medium text-klp-fg-muted',
  {
    variants: {
      variant: {
        'default':             '',
        'default-hover':       '',
        'floating-action-on':  '',
        'floating-action-off': '',
        'empty':               'hidden',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

// Primary text (bold) inside a cell-text
const cellTextPrimaryVariants = cva(
  'font-klp-body font-klp-body-bold text-klp-text-medium text-klp-fg-default',
  {
    variants: {
      variant: {
        'default':             '',
        'default-hover':       '',
        'floating-action-on':  '',
        'floating-action-off': '',
        'empty':               'hidden',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

// ---------------------------------------------------------------------------
// cell-actions layer — td
// padding → pt-klp-size-xs pr-klp-size-xs pb-klp-size-xs pl-klp-size-xs, gap → gap-klp-size-xs
// floating-action-on: fill → bg-klp-bg-subtle
// floating-action-off: hidden
// empty: hidden
// ---------------------------------------------------------------------------
const cellActionsVariants = cva(
  'flex items-center gap-klp-size-xs pt-klp-size-xs pr-klp-size-xs pb-klp-size-xs pl-klp-size-xs',
  {
    variants: {
      variant: {
        'default':             '',
        'default-hover':       '',
        'floating-action-on':  'bg-klp-bg-subtle',
        'floating-action-off': 'hidden',
        'empty':               'hidden',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

// ---------------------------------------------------------------------------
// action-button layer — button
// fill → bg-klp-bg-invisible, stroke → border-klp-border-invisible, radius → rounded-klp-l
// padding → pt-klp-size-xs pr-klp-size-xs pb-klp-size-xs pl-klp-size-xs
// color → text-klp-fg-muted
// ---------------------------------------------------------------------------
const actionButtonVariants = cva(
  'inline-flex items-center justify-center rounded-klp-l border border-klp-border-invisible bg-klp-bg-invisible pt-klp-size-xs pr-klp-size-xs pb-klp-size-xs pl-klp-size-xs text-klp-fg-muted transition-colors',
  {
    variants: {
      variant: {
        'default':             '',
        'default-hover':       '',
        'floating-action-on':  '',
        'floating-action-off': '',
        'empty':               'hidden',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

// ---------------------------------------------------------------------------
// empty-message layer — td
// TOKEN_GAP: hardcoded black → resolved to text-klp-fg-default (per spec.tokenGaps note)
// ---------------------------------------------------------------------------
const emptyMessageVariants = cva('text-klp-fg-default', {
  variants: {
    variant: {
      'default':             'hidden',
      'default-hover':       'hidden',
      'floating-action-on':  'hidden',
      'floating-action-off': 'hidden',
      'empty':               '',
    },
  },
  defaultVariants: { variant: 'default' },
})

// ---------------------------------------------------------------------------
// empty-illustration layer — div
// No token bindings; visible only in empty variant
// ---------------------------------------------------------------------------
const emptyIllustrationVariants = cva('', {
  variants: {
    variant: {
      'default':             'hidden',
      'default-hover':       'hidden',
      'floating-action-on':  'hidden',
      'floating-action-off': 'hidden',
      'empty':               '',
    },
  },
  defaultVariants: { variant: 'default' },
})

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------
export type TableRowVariant =
  | 'default'
  | 'default-hover'
  | 'floating-action-on'
  | 'floating-action-off'
  | 'empty'

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  variant?: TableRowVariant
  /** Checkbox slot — pass a <Checkbox /> element for the leftmost cell */
  checkboxSlot?: React.ReactNode
  /** Primary (bold) text in the main text cell */
  primaryText?: React.ReactNode
  /** Secondary (muted) text in the main text cell */
  secondaryText?: React.ReactNode
  /** Badge label text */
  badgeLabel?: React.ReactNode
  /** Action buttons slot — rendered inside cell-actions */
  actions?: React.ReactNode
  /** Content for the empty state message cell */
  emptyMessage?: React.ReactNode
  /** Content for the empty state illustration */
  emptyIllustration?: React.ReactNode
  /** Number of columns to span for empty cells (default: 4) */
  colSpan?: number
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      className,
      variant = 'default',
      checkboxSlot,
      primaryText = 'Primary text',
      secondaryText = 'Secondary text',
      badgeLabel = 'Badge',
      actions,
      emptyMessage = 'No data available',
      emptyIllustration,
      colSpan = 4,
      ...props
    },
    ref
  ) => {
    const isEmptyVariant = variant === 'empty'

    return (
      <tr ref={ref} className={cn(rootVariants({ variant }), className)} {...props}>
        {/* cell-checkbox */}
        <td className={cn(cellCheckboxVariants({ variant }))}>
          {checkboxSlot}
        </td>

        {/* cell-left containing badge + text cells */}
        <td className={cn(cellLeftVariants({ variant }), 'pr-klp-size-xs')}>
          <div className="flex items-center gap-klp-size-xs">
            {/* cell-badge */}
            <span className={cn(cellBadgeVariants({ variant }), 'pl-klp-size-2xs pr-klp-size-2xs pt-[2px] pb-[2px]')}>
              <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center text-klp-fg-info">
                <Hourglass className="h-[14px] w-[14px]" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="font-klp-label text-klp-text-small">{badgeLabel}</span>
            </span>

            {/* cell-text */}
            <td className={cn(cellTextVariants({ variant }))}>
              <div className="flex flex-col">
                <span className={cn(cellTextPrimaryVariants({ variant }))}>{primaryText}</span>
                <span className={cn(cellTextVariants({ variant }))}>{secondaryText}</span>
              </div>
            </td>
          </div>
        </td>

        {/* cell-actions */}
        <td>
          <div className={cn(cellActionsVariants({ variant }))}>
            {actions ?? (
              <button
                type="button"
                aria-label="More actions"
                className={cn(actionButtonVariants({ variant }))}
              >
                <MoreHorizontal className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
              </button>
            )}
          </div>
        </td>

        {/* empty-message — visible only in empty variant */}
        {isEmptyVariant && (
          <td
            colSpan={colSpan}
            className={cn(emptyMessageVariants({ variant }))}
          >
            <div className="flex flex-col items-center gap-klp-size-2xl">
              {emptyIllustration && (
                <div className={cn(emptyIllustrationVariants({ variant }))}>
                  {emptyIllustration}
                </div>
              )}
              <span role="status" aria-live="polite">
                {emptyMessage}
              </span>
            </div>
          </td>
        )}
      </tr>
    )
  }
)
TableRow.displayName = 'TableRow'

// Export cva blocks for token validator
export {
  rootVariants,
  cellCheckboxVariants,
  cellLeftVariants,
  cellBadgeVariants,
  cellTextVariants,
  cellTextPrimaryVariants,
  cellActionsVariants,
  actionButtonVariants,
  emptyMessageVariants,
  emptyIllustrationVariants,
}
