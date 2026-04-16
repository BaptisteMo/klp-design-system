import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cva, type VariantProps } from 'class-variance-authority'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Layer 1 — root variants
// The track/pill container. Radix Switch.Root.
// State transitions via Radix data-* attribute selectors:
//   data-state="checked"   → toggle-on:  fill=--klp-bg-brand,  stroke=--klp-border-brand
//   data-state="unchecked" → toggle-off: fill=--klp-bg-inset,  stroke=--klp-border-default
//
// Spec source: .klp/figma-refs/switch/spec.json
//   toggle-on-default:  fill=--klp-bg-brand,  stroke=--klp-border-brand,  cornerRadius=9999px
//   toggle-off-default: fill=--klp-bg-inset,  stroke=--klp-border-default, cornerRadius=9999px
//   literals: width=44px, height=24px, strokeWeight=1px
// ---------------------------------------------------------------------------
const rootVariants = cva(
  [
    // layout + fixed size from spec literals (width: 44px, height: 24px)
    'inline-flex shrink-0 cursor-pointer items-center',
    'w-[44px] h-[24px]',
    // horizontal padding so 20px thumb sits 2px from each edge
    'p-[2px]',
    // border (strokeWeight: 1px)
    'border',
    // cornerRadius: spec value 9999px → arbitrary
    'rounded-[9999px]',
    // transitions
    'transition-colors',
    // focus ring
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klp-border-brand-emphasis',
    // disabled state
    'data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
    // toggle-off (unchecked): fill=--klp-bg-inset, stroke=--klp-border-default
    'bg-klp-bg-inset border-klp-border-default',
    // toggle-on (checked): fill=--klp-bg-brand, stroke=--klp-border-brand
    'data-[state=checked]:bg-klp-bg-brand data-[state=checked]:border-klp-border-brand',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  }
)

// ---------------------------------------------------------------------------
// Layer 2 — thumb variants
// The sliding circle. Radix Switch.Thumb.
// fill=--klp-bg-default for both states.
// Translates 20px right when checked.
//
// Spec source:
//   toggle-on-default:  fill=--klp-bg-default, literals: width=20px, height=20px, dropShadow=0 4px 16px rgba(112,112,112,0.35)
//   toggle-off-default: fill=--klp-bg-default, literals: width=20px, height=20px, dropShadow=0 4px 16px rgba(112,112,112,0.35)
// ---------------------------------------------------------------------------
const thumbVariants = cva(
  [
    // fixed size from spec literals (width: 20px, height: 20px)
    'relative block h-[20px] w-[20px]',
    // shape: full circle
    'rounded-[9999px]',
    // fill: --klp-bg-default → bg-klp-bg-default (both states)
    'bg-klp-bg-default',
    // drop shadow from spec literal
    'shadow-[0_4px_16px_rgba(112,112,112,0.35)]',
    // sliding animation: travel = 44px - 2*2px padding - 20px = 20px
    'transition-transform duration-200',
    'translate-x-0 data-[state=checked]:translate-x-[19px]',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  }
)

// ---------------------------------------------------------------------------
// Layer 3 — icon variants
// Icon overlay inside the thumb. Checkmark SVG.
// Radix Thumb propagates data-state — we target it to toggle visibility.
//
// Spec source:
//   toggle-on-default:  stroke=--klp-border-brand,     opacity=1,  width=16px, height=16px
//   toggle-off-default: stroke=--klp-border-invisible,  opacity=0, width=16px, height=16px
// ---------------------------------------------------------------------------
const iconVariants = cva(
  [
    // position centered inside the 20px thumb
    'absolute inset-0 flex items-center justify-center',
    // fixed icon size from spec literals (16px × 16px)
    '[&>svg]:h-[16px] [&>svg]:w-[16px]',
    // transition for opacity change
    'transition-opacity duration-200',
    // toggle-off: stroke=--klp-border-invisible → text-klp-border-invisible, opacity=0
    'text-klp-border-invisible opacity-0',
    // toggle-on (parent Thumb has data-state=checked): stroke=--klp-border-brand, opacity=1
    'group-data-[state=checked]/thumb:text-klp-border-brand group-data-[state=checked]/thumb:opacity-100',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  }
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface SwitchProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    'asChild'
  >,
    VariantProps<typeof rootVariants> {
  /** Additional class names for the root element */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(rootVariants(), className)}
    {...props}
  >
    {/*
      group/thumb enables the icon layer to read data-state via
      group-data-[state=checked]/thumb:* selector — Tailwind v4 supports
      named group variants.
    */}
    <SwitchPrimitive.Thumb className={cn(thumbVariants(), 'group/thumb')}>
      <span className={cn(iconVariants())}>
        <Check strokeWidth={2} aria-hidden="true" className='mt-px ml-px' />
      </span>
    </SwitchPrimitive.Thumb>
  </SwitchPrimitive.Root>
))
Switch.displayName = 'Switch'

export {
  rootVariants as switchRootVariants,
  thumbVariants as switchThumbVariants,
  iconVariants as switchIconVariants,
}
