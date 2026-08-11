import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Layer 1 — root
// Read-only display of a single labelled value. Column stack, 4px gap
// (--klp-size-xs, same rhythm as the Input head→field gap). No border, no
// padding, no background: the field inherits the surface it sits on.
// ---------------------------------------------------------------------------
const rootVariants = cva('flex min-w-0 flex-col gap-klp-size-xs')

// ---------------------------------------------------------------------------
// Layer 2 — label
// Always muted + one step below the value in the type scale
// (text-small: 14px in klub/showup/wireframe, 12px in atlas).
// ---------------------------------------------------------------------------
const labelVariants = cva('font-klp-label text-klp-text-small text-klp-fg-muted')

// ---------------------------------------------------------------------------
// Layer 3 — value
// text-medium (16px in klub/showup/wireframe, 14px in atlas), fg-default.
// `emphasis` only swaps the weight — never the color or the size, so a strong
// field stays aligned with its neighbours in a stack.
// ---------------------------------------------------------------------------
const valueVariants = cva(
  'font-klp-label text-klp-text-medium text-klp-fg-default whitespace-pre-line break-words',
  {
    variants: {
      emphasis: {
        default: 'font-klp-label',
        strong: 'font-klp-label-bold',
      },
    },
    defaultVariants: { emphasis: 'default' },
  },
)

export interface DataFieldProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'>,
    VariantProps<typeof valueVariants> {
  /** Field name, rendered muted above the value.
   * @propClass required
   */
  label: React.ReactNode
  /** The read-only content. Strings keep their line breaks (`whitespace-pre-line`).
   * @propClass required
   */
  value: React.ReactNode
  /** Weight of the value text. `strong` bolds it; size and color never change.
   * @propClass optional
   */
  emphasis?: VariantProps<typeof valueVariants>['emphasis']
  /** Rendered in place of `value` when it is empty (`undefined`, `null` or `''`).
   * @propClass optional
   */
  emptyText?: React.ReactNode
}

const isEmpty = (v: React.ReactNode) =>
  v === undefined || v === null || v === '' || (typeof v === 'string' && v.trim() === '')

export const DataField = React.forwardRef<HTMLDivElement, DataFieldProps>(
  ({ className, label, value, emphasis = 'default', emptyText = '—', ...props }, ref) => {
    const labelId = React.useId()
    const empty = isEmpty(value)

    return (
      <div ref={ref} className={cn(rootVariants(), className)} {...props}>
        <span id={labelId} className={cn(labelVariants())}>
          {label}
        </span>
        <span
          aria-labelledby={labelId}
          className={cn(valueVariants({ emphasis }), empty && 'text-klp-fg-subtle')}
        >
          {empty ? emptyText : value}
        </span>
      </div>
    )
  },
)
DataField.displayName = 'DataField'

export { rootVariants as dataFieldRootVariants, labelVariants as dataFieldLabelVariants, valueVariants as dataFieldValueVariants }
