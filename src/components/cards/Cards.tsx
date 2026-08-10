import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Layer 1 — root variants
// Controls background, border, border-radius, padding, gap.
// Card is a purely presentational, generic container: the only axis is
// paddingSize (8px / 16px), per spec.variantAxes.
// ---------------------------------------------------------------------------
const rootVariants = cva(
  // base: layout, surface, border, radius (16px → --klp-radius-xl)
  'box-border flex flex-col gap-klp-size-xs rounded-klp-xl border bg-klp-bg-default border-klp-border-default',
  {
    variants: {
      paddingSize: {
        '8px': 'p-klp-size-xs',
        '16px': 'p-klp-size-m',
      },
    },
    defaultVariants: { paddingSize: '16px' },
  }
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof rootVariants> {
  /**
   * Generic content rendered inside the card surface.
   * @propClass required
   */
  children?: React.ReactNode
  /**
   * Padding density axis (maps to spec variantAxes.paddingSize).
   * @propClass optional
   */
  paddingSize?: VariantProps<typeof rootVariants>['paddingSize']
  /**
   * Render child element in place of the native <div> (e.g. an <article> or <a>).
   * @propClass optional
   */
  asChild?: boolean
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, paddingSize = '16px', asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'

    return (
      <Comp
        ref={ref}
        className={cn(rootVariants({ paddingSize }), className)}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Card.displayName = 'Card'

export { rootVariants as cardVariants }
