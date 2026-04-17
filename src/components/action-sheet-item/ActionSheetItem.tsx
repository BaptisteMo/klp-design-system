import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// root layer — fill, stroke, padding, gap, radius, height
// Derived literally from spec.variants[].layers.root
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'inline-flex w-full items-center border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klp-border-brand disabled:pointer-events-none',
  {
    variants: {
      state: {
        default:     'bg-klp-bg-invisible border-klp-border-invisible',
        hover:       'bg-klp-bg-subtle border-klp-border-invisible',
        active:      'bg-klp-bg-brand-low border-klp-border-brand',
        emphased:    'bg-klp-bg-inset border-transparent',
        disabled:    'bg-klp-bg-disable border-klp-border-invisible',
        destructive: 'bg-klp-bg-danger border-klp-border-invisible',
        creation:    'bg-klp-bg-success border-klp-border-invisible',
      },
      size: {
        lg: 'h-[56px] px-klp-size-m py-klp-size-m gap-klp-size-s rounded-[8px]',
        md: 'h-[48px] px-klp-size-s py-klp-size-s gap-klp-size-xs rounded-[4px]',
        sm: 'h-[40px] px-klp-size-xs py-klp-size-xs gap-klp-size-xs rounded-[8px]',
      },
    },
    defaultVariants: { state: 'default', size: 'lg' },
  }
)

// ---------------------------------------------------------------------------
// icon-left / icon-right layers — color
// Derived literally from spec.variants[].layers.icon-left / icon-right
// ---------------------------------------------------------------------------
const iconVariants = cva(
  'inline-flex shrink-0 items-center justify-center [&>svg]:h-[16px] [&>svg]:w-[16px]',
  {
    variants: {
      state: {
        default:     'text-klp-fg-default',
        hover:       'text-klp-fg-default',
        active:      'text-klp-fg-default',
        emphased:    'text-klp-fg-default',
        disabled:    'text-klp-fg-disable',
        destructive: 'text-klp-fg-danger-contrasted',
        creation:    'text-klp-fg-success-contrasted',
      },
    },
    defaultVariants: { state: 'default' },
  }
)

// ---------------------------------------------------------------------------
// label layer — color, fontSize, fontFamily, fontWeight
// Derived literally from spec.variants[].layers.label
// ---------------------------------------------------------------------------
const labelVariants = cva(
  'flex-1 text-klp-text-medium font-klp-label',
  {
    variants: {
      state: {
        default:     'text-klp-fg-default',
        hover:       'text-klp-fg-default',
        active:      'text-klp-fg-default',
        emphased:    'text-klp-fg-default',
        disabled:    'text-klp-fg-disable',
        destructive: 'text-klp-fg-danger-contrasted',
        creation:    'text-klp-fg-success-contrasted',
      },
    },
    defaultVariants: { state: 'default' },
  }
)

// ---------------------------------------------------------------------------
// content layer — vertical flex column filling remaining width
// No token bindings (layout only)
// ---------------------------------------------------------------------------
const contentVariants = cva('flex flex-1 flex-col')

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type ActionSheetItemState = 'default' | 'hover' | 'active' | 'emphased' | 'disabled' | 'destructive' | 'creation'
export type ActionSheetItemSize  = 'lg' | 'md' | 'sm'

export interface ActionSheetItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rootVariants> {
  asChild?:         boolean
  firstIcon?:       React.ReactNode
  secondAction?:    React.ReactNode
  description?:     React.ReactNode
}

export const ActionSheetItem = React.forwardRef<HTMLButtonElement, ActionSheetItemProps>(
  (
    {
      className,
      state,
      size,
      asChild = false,
      firstIcon,
      secondAction,
      description,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const resolvedState: ActionSheetItemState = disabled ? 'disabled' : (state ?? 'default')
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        disabled={disabled}
        aria-disabled={resolvedState === 'disabled' ? true : undefined}
        className={cn(rootVariants({ state: resolvedState, size }), className)}
        {...props}
      >
        {firstIcon && (
          <span aria-hidden="true" className={cn(iconVariants({ state: resolvedState }), 'h-[20px] w-[20px]')}>
            {firstIcon}
          </span>
        )}

        <span className={contentVariants()}>
          <span className={labelVariants({ state: resolvedState })}>
            {children}
          </span>
          {description && (
            <span className="text-klp-text-small text-klp-fg-muted">
              {description}
            </span>
          )}
        </span>

        {secondAction && (
          <span aria-hidden="true" className={cn(iconVariants({ state: resolvedState }), 'h-[20px] w-[20px]')}>
            {secondAction}
          </span>
        )}
      </Comp>
    )
  }
)
ActionSheetItem.displayName = 'ActionSheetItem'

export { rootVariants, iconVariants, labelVariants, contentVariants }
