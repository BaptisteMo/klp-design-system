import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Root layer — bg, border, padding, gap, radius
// bg and border depend on both `type` and `badgeStyle`.
// padding and gap depend on `size`.
// radius is always 4px (spec: literal cornerRadius).
// ---------------------------------------------------------------------------

const rootVariants = cva(
  'inline-flex items-center rounded-klp-m border',
  {
    variants: {
      // type × badgeStyle combined into a single compound key
      typeStyle: {
        // primary
        'primary-bordered': 'bg-klp-bg-brand-low border-klp-border-brand-emphasis',
        'primary-light': 'bg-klp-bg-brand-low border-klp-border-invisible',
        // secondary
        'secondary-bordered': 'bg-klp-bg-secondary-brand-low border-klp-border-secondary-brand-emphasis',
        'secondary-light': 'bg-klp-bg-secondary-brand-low border-klp-border-invisible',
        // tertiary
        'tertiary-bordered': 'bg-klp-bg-inset border-klp-border-contrasted',
        'tertiary-light': 'bg-klp-bg-inset border-klp-border-invisible',
        // success
        'success-bordered': 'bg-klp-bg-success border-klp-border-success-emphasis',
        'success-light': 'bg-klp-bg-success border-klp-border-invisible',
        // info
        'info-bordered': 'bg-klp-bg-info border-klp-border-info-emphasis',
        'info-light': 'bg-klp-bg-info border-klp-border-invisible',
        // warning
        'warning-bordered': 'bg-klp-bg-warning border-klp-border-warning-emphasis',
        'warning-light': 'bg-klp-bg-warning border-klp-border-invisible',
        // danger
        'danger-bordered': 'bg-klp-bg-danger border-klp-border-danger-emphasis',
        'danger-light': 'bg-klp-bg-danger border-klp-border-invisible',
        // on-emphasis (light only)
        'on-emphasis-light': 'bg-klp-bg-invisible border-klp-border-invisible',
        // outlined (light only)
        'outlined-light': 'bg-klp-bg-invisible border-klp-border-brand',
      },
      size: {
        small: 'px-klp-size-xs py-klp-size-2xs gap-klp-size-2xs',
        medium: 'px-klp-size-m py-klp-size-xs gap-klp-size-2xs',
        large: 'px-klp-size-l py-klp-size-s gap-klp-size-xs',
      },
    },
    defaultVariants: {
      typeStyle: 'primary-bordered',
      size: 'medium',
    },
  }
)

// ---------------------------------------------------------------------------
// Label layer — text color, font family, font weight, font size
// Color depends on `type` only (same for bordered and light within each type).
// Font properties are identical across all variants.
// ---------------------------------------------------------------------------

const labelVariants = cva(
  'font-klp-body font-weight-klp-body text-klp-text-small',
  {
    variants: {
      badgeType: {
        primary: 'text-klp-fg-brand-contrasted',
        secondary: 'text-klp-fg-secondary-brand-contrasted',
        tertiary: 'text-klp-fg-default',
        success: 'text-klp-fg-success',
        info: 'text-klp-fg-info-contrasted',
        warning: 'text-klp-fg-warning',
        danger: 'text-klp-fg-danger',
        'on-emphasis': 'text-klp-fg-muted',
        outlined: 'text-klp-fg-brand',
      },
    },
    defaultVariants: { badgeType: 'primary' },
  }
)

// ---------------------------------------------------------------------------
// Icon layer — same color mapping as label (icon color = label color per spec)
// ---------------------------------------------------------------------------

const iconVariants = cva(
  'inline-flex shrink-0 items-center justify-center [&>svg]:h-[16px] [&>svg]:w-[16px]',
  {
    variants: {
      badgeType: {
        primary: 'text-klp-fg-brand-contrasted',
        secondary: 'text-klp-fg-secondary-brand-contrasted',
        tertiary: 'text-klp-fg-default',
        success: 'text-klp-fg-success',
        info: 'text-klp-fg-info-contrasted',
        warning: 'text-klp-fg-warning',
        danger: 'text-klp-fg-danger',
        'on-emphasis': 'text-klp-fg-muted',
        outlined: 'text-klp-fg-brand',
      },
    },
    defaultVariants: { badgeType: 'primary' },
  }
)

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type BadgeType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'on-emphasis'
  | 'outlined'

export type BadgeSize = 'small' | 'medium' | 'large'
export type BadgeStyle = 'bordered' | 'light'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Required badge content (text, number, etc.).
   * @propClass required
   */
  children?: React.ReactNode
  /** Semantic type (color scheme)
   * @propClass optional
   */
  badgeType?: BadgeType
  /** Size variant — controls padding and gap
   * @propClass optional
   */
  size?: BadgeSize
  /** Style variant — bordered adds a colored stroke, light removes it
   * @propClass optional
   */
  badgeStyle?: BadgeStyle
  /** Optional leading icon
   * @propClass optional
   */
  leftIcon?: React.ReactNode
  /** Optional trailing icon
   * @propClass optional
   */
  rightIcon?: React.ReactNode
  /** Render as child element (Slot pattern)
   * @propClass optional
   */
  asChild?: boolean
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      badgeType = 'primary',
      size = 'medium',
      badgeStyle = 'bordered',
      leftIcon,
      rightIcon,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'span'
    const typeStyle = `${badgeType}-${badgeStyle}` as
      | 'primary-bordered' | 'primary-light'
      | 'secondary-bordered' | 'secondary-light'
      | 'tertiary-bordered' | 'tertiary-light'
      | 'success-bordered' | 'success-light'
      | 'info-bordered' | 'info-light'
      | 'warning-bordered' | 'warning-light'
      | 'danger-bordered' | 'danger-light'
      | 'on-emphasis-light'
      | 'outlined-light'

    return (
      <Comp
        ref={ref}
        className={cn(rootVariants({ typeStyle, size }), className)}
        {...props}
      >
        {leftIcon && (
          <span aria-hidden="true" className={iconVariants({ badgeType })}>
            {leftIcon}
          </span>
        )}
        {children !== undefined && children !== null && (
          <span className={labelVariants({ badgeType })}>{children}</span>
        )}
        {rightIcon && (
          <span aria-hidden="true" className={iconVariants({ badgeType })}>
            {rightIcon}
          </span>
        )}
      </Comp>
    )
  }
)
Badge.displayName = 'Badge'

export { rootVariants, labelVariants, iconVariants }
