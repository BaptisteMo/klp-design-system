import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Layer 1 — root variants (RadioGroup.Item)
// Controls background fill, border, border-radius, padding, fixed dimensions.
// State transitions are expressed via Radix data-* attribute selectors:
//   data-state="unchecked"            → rest/hover
//   data-state="checked"              → clicked (checked)
//   data-disabled                     → disable
//
// Spec source: .klp/figma-refs/radio/spec.json
//   default-rest:    fill=--klp-bg-default,    stroke=--klp-border-default,  paddingX/Y=--klp-size-3xs
//   default-hover:   fill=--klp-bg-brand-low,  stroke=--klp-border-brand,    paddingX/Y=--klp-size-3xs
//   default-clicked: fill=--klp-bg-brand,      stroke=--klp-border-brand,    paddingX/Y=--klp-size-2xs
//   default-disable: fill=--klp-bg-disable,    stroke=--klp-border-contrasted, paddingX/Y=--klp-size-3xs
//
// cornerRadius: --klp-size-round (9999px) → rounded-full (always full pill)
// fixed size literals: width=24px, height=24px → h-[24px] w-[24px]
// ---------------------------------------------------------------------------
const rootVariants = cva(
  [
    // layout + fixed size from spec literals (width: 24px, height: 24px)
    'box-border inline-flex shrink-0 items-center justify-center',
    'h-[24px] w-[24px]',
    // cornerRadius: --klp-size-round = 9999px → always fully rounded
    'rounded-full',
    // border
    'border',
    // transitions
    'transition-colors',
    // focus ring
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klp-border-brand-emphasis',
    // cursor
    'cursor-pointer data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
    // --- state-driven classes via Radix data attributes ---
    // rest (unchecked, no hover): fill=bg-default, stroke=border-default, padding=3xs
    'bg-klp-bg-default border-klp-border-default p-klp-size-3xs',
    // hover (unchecked + hovered): fill=bg-brand-low, stroke=border-brand, padding=3xs (unchanged)
    'hover:bg-klp-bg-brand-low hover:border-klp-border-brand',
    // checked (clicked): fill=bg-brand, stroke=border-brand, padding=2xs
    'data-[state=checked]:bg-klp-bg-brand data-[state=checked]:border-klp-border-brand data-[state=checked]:p-klp-size-2xs',
    // disabled: fill=bg-disable, stroke=border-contrasted, padding=3xs — overrides all above
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
// Layer 2 — indicator variants (RadioGroup.Indicator)
// Controls the inner dot appearance. Rendered via forceMount so it can serve
// double duty:
//   • unchecked states (rest/hover/disable): indicator fills the full 16px
//     inner area; its color MUST match the root bg of that state so the dot
//     is visually invisible.
//   • checked state: padding on root shrinks from 3xs→2xs, so the indicator
//     area becomes 12px; its color is bg-default (white on brand bg).
//
// Spec source:
//   default-rest:    indicator fill=--klp-bg-default     matches rest root bg
//   default-hover:   indicator fill=--klp-bg-brand-low   matches hover root bg
//   default-clicked: indicator fill=--klp-bg-default     white dot on brand bg
//   default-disable: indicator fill=--klp-bg-disable     matches disabled root bg
//
// Because :hover and :disabled target the ROOT (not the indicator), we rely
// on the `group` class on root + `group-hover:` / `group-data-[disabled]:`
// selectors on the indicator. data-[state=checked] comes LAST in the class
// list so it overrides hover/disabled variants when both apply.
// ---------------------------------------------------------------------------
const indicatorVariants = cva(
  [
    'block w-full h-full rounded-full',
    // rest (unchecked, no hover): fill matches root bg-default
    'bg-klp-bg-default',
    // hover (group = root hovered): fill matches root bg-brand-low
    'group-hover:bg-klp-bg-brand-low',
    // disable (group data-disabled on root): fill matches root bg-disable
    'group-data-[disabled]:bg-klp-bg-disable',
    // checked: fill stays bg-default (white dot, 12px, visible on bg-brand root).
    // Placed last so it overrides any group-hover/group-disabled when state=checked.
    'data-[state=checked]:bg-klp-bg-default',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  }
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Props for the RadioGroup container */
export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  className?: string
}

/** Props for a single RadioGroup.Item */
export interface RadioItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  className?: string
}

// ---------------------------------------------------------------------------
// RadioGroup (container)
// ---------------------------------------------------------------------------
export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn('flex flex-col gap-klp-size-xs', className)}
    {...props}
  />
))
RadioGroup.displayName = 'RadioGroup'

// ---------------------------------------------------------------------------
// RadioItem (single radio button)
// ---------------------------------------------------------------------------
export const RadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioItemProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn('group', rootVariants(), className)}
    {...props}
  >
    {/*
      forceMount keeps the indicator in the DOM at all times. The `group` class
      on the Item lets the indicator react to the root's :hover and :disabled
      via group-hover:/group-data-[disabled]: selectors. Padding change on root
      (3xs→2xs on checked) resizes the inner area from 16px to 12px, matching
      spec literals exactly.
    */}
    <RadioGroupPrimitive.Indicator
      forceMount
      className={cn(indicatorVariants())}
    />
  </RadioGroupPrimitive.Item>
))
RadioItem.displayName = 'RadioItem'

export { rootVariants as radioRootVariants, indicatorVariants as radioIndicatorVariants }
