import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cva, type VariantProps } from 'class-variance-authority'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Layer 1 — root variants
// Controls background fill, border, border-radius, padding, fixed dimensions.
// State transitions are expressed via Radix data-* attribute selectors:
//   data-state="unchecked" → rest/hover
//   data-state="checked"   → clicked (checked)
//   data-state="indeterminate" → mixed
//   data-disabled          → disable
//
// Spec source: .klp/figma-refs/checkbox/spec.json
//   default-rest:    fill=--klp-bg-default,    stroke=--klp-border-default
//   default-hover:   fill=--klp-bg-brand-low,  stroke=--klp-border-brand
//   default-clicked: fill=--klp-bg-brand,      stroke=--klp-border-brand
//   default-mixed:   fill=--klp-bg-brand,      stroke=--klp-border-brand
//   default-disable: fill=--klp-bg-disable,    stroke=--klp-border-contrasted
// ---------------------------------------------------------------------------
const rootVariants = cva(
  [
    // layout + fixed size from spec literals (width: 24px, height: 24px)
    'box-border inline-flex shrink-0 items-center justify-center',
    'h-[24px] w-[24px]',
    // padding: --klp-size-3xs on all sides
    'p-klp-size-3xs',
    // border
    'border',
    // border-radius: --klp-radius-m → rounded-klp-m
    'rounded-klp-m',
    // transitions
    'transition-colors',
    // focus ring
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klp-border-brand-emphasis',
    // cursor
    'cursor-pointer data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
    // --- state-driven classes via Radix data attributes ---
    // rest (unchecked, no hover): fill=bg-default, stroke=border-default
    'bg-klp-bg-default border-klp-border-default',
    // hover (unchecked + hovered): fill=bg-brand-low, stroke=border-brand
    'hover:bg-klp-bg-brand-low hover:border-klp-border-brand',
    // checked (clicked): fill=bg-brand, stroke=border-brand
    'data-[state=checked]:bg-klp-bg-brand data-[state=checked]:border-klp-border-brand',
    // indeterminate (mixed): fill=bg-brand, stroke=border-brand
    'data-[state=indeterminate]:bg-klp-bg-brand data-[state=indeterminate]:border-klp-border-brand',
    // disabled: fill=bg-disable, stroke=border-contrasted — overrides all above
    'data-[disabled]:bg-klp-bg-disable data-[disabled]:border-klp-border-contrasted',
    // disabled hover: cancel hover styles when disabled
    'data-[disabled]:hover:bg-klp-bg-disable data-[disabled]:hover:border-klp-border-contrasted',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  }
)

// ---------------------------------------------------------------------------
// Layer 2 — indicator variants
// Controls icon color (--klp-fg-on-emphasis for checked/mixed; transparent-ish
// for unchecked/disabled). The Radix Indicator only mounts when checked or
// indeterminate, so unchecked/hover colors are not relevant for the indicator.
//
// Spec source:
//   default-clicked: color=--klp-fg-on-emphasis → text-klp-fg-on-emphasis
//   default-mixed:   color=--klp-fg-on-emphasis → text-klp-fg-on-emphasis
// ---------------------------------------------------------------------------
const indicatorVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center',
    // icon literal size from spec: iconSize: 16px
    '[&>svg]:h-[16px] [&>svg]:w-[16px]',
    // color: --klp-fg-on-emphasis for checked and indeterminate
    'text-klp-fg-on-emphasis',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  }
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    'asChild'
  >,
    VariantProps<typeof rootVariants> {
  /** Additional class names for the root element */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, checked, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    checked={checked}
    className={cn(rootVariants(), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(indicatorVariants())}
    >
      {checked === 'indeterminate' ? <Minus strokeWidth={1.5} aria-hidden="true" /> : <Check strokeWidth={1.5} aria-hidden="true" />}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = 'Checkbox'

export { rootVariants as checkboxRootVariants, indicatorVariants as checkboxIndicatorVariants }
