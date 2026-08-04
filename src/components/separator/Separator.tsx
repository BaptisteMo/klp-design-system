import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Layer 1 — root variants
// Padding-only wrapper. No fill/stroke of its own — reserves the margin space
// around the line. Direction-dependent: paddingTop/Bottom for horizontal,
// paddingLeft/Right for vertical. `none` margin has zero padding (unbound in
// Figma). The wrapper fills its container's main axis (w-full / h-full) —
// the 234px seen in Figma is only the canvas sample, never a hardcoded size.
// ---------------------------------------------------------------------------
const rootVariants = cva('flex', {
  variants: {
    direction: {
      horizontal: 'w-full flex-col',
      vertical: 'h-full flex-row',
    },
    margin: {
      none: '',
      small: '',
      medium: '',
      large: '',
    },
  },
  compoundVariants: [
    { direction: 'horizontal', margin: 'none', className: 'pt-0 pb-0' },
    { direction: 'horizontal', margin: 'small', className: 'pt-klp-size-xs pb-klp-size-xs' },
    { direction: 'horizontal', margin: 'medium', className: 'pt-klp-size-m pb-klp-size-m' },
    { direction: 'horizontal', margin: 'large', className: 'pt-klp-size-l pb-klp-size-l' },
    { direction: 'vertical', margin: 'none', className: 'pl-0 pr-0' },
    { direction: 'vertical', margin: 'small', className: 'pl-klp-size-xs pr-klp-size-xs' },
    { direction: 'vertical', margin: 'medium', className: 'pl-klp-size-m pr-klp-size-m' },
    { direction: 'vertical', margin: 'large', className: 'pl-klp-size-l pr-klp-size-l' },
  ],
  defaultVariants: { direction: 'horizontal', margin: 'none' },
})

// ---------------------------------------------------------------------------
// Layer 2 — line variants
// The visible rule. Figma's node is a stroke-only RECTANGLE (no fill paint):
// drawn here with `border-*` utilities, never `bg-*`. Fills its container's
// cross axis (w-full for horizontal, h-full for vertical) so the 1px line
// spans the wrapper — the 234px canvas sample is not a real constraint.
// ---------------------------------------------------------------------------
const lineVariants = cva('shrink-0 border-klp-border-default', {
  variants: {
    direction: {
      horizontal: 'w-full border-t',
      vertical: 'h-full border-l',
    },
  },
  defaultVariants: { direction: 'horizontal' },
})

export interface SeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>, 'orientation'>,
    VariantProps<typeof rootVariants> {
  /** Direction axis: maps to Radix's `orientation` prop.
   * @propClass optional
   */
  direction?: 'horizontal' | 'vertical'
  /** Space reserved around the line (maps to spec variantAxes.margin).
   * @propClass optional
   */
  margin?: VariantProps<typeof rootVariants>['margin']
  /** Whether the separator is purely visual (role="none") vs semantic
   * (role="separator"). Defaults to true — most rules carry no meaning for
   * assistive tech.
   * @propClass optional
   */
  decorative?: boolean
}

export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({ className, direction = 'horizontal', margin = 'none', decorative = true, ...props }, ref) => {
  return (
    <div className={cn(rootVariants({ direction, margin }))}>
      <SeparatorPrimitive.Root
        ref={ref}
        orientation={direction}
        decorative={decorative}
        className={cn(lineVariants({ direction }), className)}
        {...props}
      />
    </div>
  )
})
Separator.displayName = 'Separator'

export { rootVariants as separatorRootVariants, lineVariants as separatorLineVariants }
