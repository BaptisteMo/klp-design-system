import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Layer 1 — root variants
// Controls background, border, border-radius, padding, gap, dimensions.
// State-driven pseudo-classes (hover/active) are expressed here for interactive
// variants; disabled state uses the disabled: modifier.
// ---------------------------------------------------------------------------
const rootVariants = cva(
  // base: layout, border, radius, focus ring, transitions
  'box-border inline-flex items-center justify-center border rounded-klp-l transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klp-border-brand-emphasis disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-klp-bg-brand border-klp-border-brand hover:bg-klp-bg-brand-contrasted hover:border-klp-border-brand-emphasis active:bg-klp-bg-brand-contrasted active:border-klp-border-brand-contrasted disabled:bg-klp-bg-inset disabled:border-klp-border-default',
        secondary:
          'bg-klp-bg-default border-klp-border-brand hover:bg-klp-bg-brand-low hover:border-klp-border-brand-emphasis active:bg-klp-bg-brand-low active:border-klp-border-brand-contrasted disabled:bg-klp-bg-inset disabled:border-klp-border-default active:border-2 ',
        tertiary:
          // Active: border 1px invisible → 2px contrasted (same pattern as destructive hover)
          'bg-klp-bg-inset border-klp-border-invisible hover:border-klp-border-default active:bg-klp-bg-subtle active:border-2 active:border-klp-border-contrasted disabled:bg-klp-bg-inset disabled:border-klp-border-invisible',
        destructive:
          // Hover: BG stays, border becomes 2px solid danger-contrasted (per Figma spec)
          'bg-klp-bg-danger-emphasis border-klp-border-danger-emphasis hover:border-2 hover:border-klp-border-danger-contrasted active:bg-klp-bg-danger-contrasted active:border-klp-border-danger-contrasted disabled:bg-klp-bg-inset disabled:border-klp-border-default',
        validation:
          'bg-klp-bg-success-emphasis border-klp-border-success-emphasis hover:border-2 hover:border-klp-border-success-contrasted active:bg-klp-bg-success-contrasted active:border-klp-border-success-contrasted disabled:bg-klp-bg-inset disabled:border-klp-border-default',
      },
      size: {
        sm:   'h-[36px] px-klp-size-s py-klp-size-2xs gap-klp-size-2xs',
        md:   'h-[40px] px-klp-size-m py-klp-size-xs gap-klp-size-2xs',
        lg:   'h-[52px] px-klp-size-l py-klp-size-s gap-klp-size-2xs',
        icon: 'h-[36px] w-[36px] p-klp-size-xs',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

// ---------------------------------------------------------------------------
// Layer 2 — label variants
// Controls text color, font family, font size, font weight.
// Applied to the inner <span> wrapping the children text.
// ---------------------------------------------------------------------------
const labelVariants = cva(
  // base: font family + weight shared across all sizes/types
  'font-klp-label font-bold leading-none', // TODO: token gap — spec declares --klp-font-weight-label-bold: 600 (wireframe) but font-bold = 700; 100-unit drift on wireframe brand
  {
    variants: {
      variant: {
        primary:     'text-klp-fg-on-emphasis',
        secondary:   'text-klp-fg-brand',
        tertiary:    'text-klp-fg-default',
        destructive: 'text-klp-fg-on-emphasis',
        validation:  'text-klp-fg-on-emphasis',
      },
      size: {
        sm:   'text-klp-text-medium',
        md:   'text-klp-text-medium',
        lg:   'text-klp-text-large',
        icon: 'text-klp-text-medium',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

// ---------------------------------------------------------------------------
// Layer 3 — icon variants
// Controls icon color (mirrors label for each variant) and icon size per size axis.
// Applied identically to icon-left and icon-right spans.
// ---------------------------------------------------------------------------
const iconVariants = cva(
  'inline-flex shrink-0 items-center justify-center',
  {
    variants: {
      variant: {
        primary:     'text-klp-fg-on-emphasis',
        secondary:   'text-klp-fg-brand',
        tertiary:    'text-klp-fg-default',
        destructive: 'text-klp-fg-on-emphasis',
        validation:  'text-klp-fg-on-emphasis',
      },
      size: {
        sm:   '[&>svg]:h-[14px] [&>svg]:w-[14px]',
        md:   '[&>svg]:h-[16px] [&>svg]:w-[16px]',
        lg:   '[&>svg]:h-[20px] [&>svg]:w-[20px]',
        icon: '[&>svg]:h-[16px] [&>svg]:w-[16px]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Visual style variant (maps to spec variantAxes.type) */
  variant?: VariantProps<typeof rootVariants>['variant']
  /** Size axis */
  size?: VariantProps<typeof rootVariants>['size']
  /** Native button type attribute */
  htmlType?: 'button' | 'submit' | 'reset'
  /** Render child element in place of <button> (e.g. <a>) */
  asChild?: boolean
  /** Optional icon rendered before the label */
  leftIcon?: React.ReactNode
  /** Optional icon rendered after the label */
  rightIcon?: React.ReactNode
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      htmlType = 'button',
      asChild = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type={asChild ? undefined : (htmlType as any)}
        disabled={disabled}
        aria-disabled={disabled}
        className={cn(rootVariants({ variant, size }), className)}
        {...props}
      >
        {leftIcon && (
          <span
            aria-hidden="true"
            className={cn(iconVariants({ variant, size }))}
          >
            {leftIcon}
          </span>
        )}

        {size !== 'icon' && children !== undefined && children !== null && (
          <span className={cn(labelVariants({ variant, size }))}>
            {children}
          </span>
        )}

        {size === 'icon' && children && (
          <span aria-hidden="true" className={cn(iconVariants({ variant, size }))}>
            {children}
          </span>
        )}

        {rightIcon && (
          <span
            aria-hidden="true"
            className={cn(iconVariants({ variant, size }))}
          >
            {rightIcon}
          </span>
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { rootVariants as buttonVariants, labelVariants, iconVariants }
