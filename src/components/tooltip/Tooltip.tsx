import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Layer 1 — root variants
// Controls background fill, border-radius, padding.
// token: --klp-bg-brand-contrasted → bg-klp-bg-brand-contrasted
// token gap (accepted): --klp-radius-m → rounded-klp-m
// token gap (accepted): --klp-size-xs → p-klp-size-xs
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'inline-flex items-center justify-center bg-klp-bg-brand-contrasted rounded-klp-m p-klp-size-xs backdrop-blur-[10px]',
  {
    variants: {
      arrowOrientation: {
        'bottom-left':  '',
        'bottom-right': '',
        'top-left':     '',
        'top-right':    '',
      },
    },
    defaultVariants: { arrowOrientation: 'bottom-left' },
  }
)

// ---------------------------------------------------------------------------
// Layer 2 — label variants
// Controls text color, font size, font family, font weight.
// token gap (accepted): --klp-fg-on-emphasis → text-klp-fg-on-emphasis
// token gap (accepted): --klp-font-size-text-medium → text-klp-text-medium
// ---------------------------------------------------------------------------
const labelVariants = cva(
  'text-klp-fg-on-emphasis text-klp-text-medium font-klp-body font-weight-klp-body',
  {
    variants: {
      arrowOrientation: {
        'bottom-left':  '',
        'bottom-right': '',
        'top-left':     '',
        'top-right':    '',
      },
    },
    defaultVariants: { arrowOrientation: 'bottom-left' },
  }
)

// ---------------------------------------------------------------------------
// Layer 3 — arrow variants
// Controls arrow fill color and dimensions.
// token: --klp-bg-brand-contrasted → fill via CSS currentColor trick on SVG
// Placement is handled by Radix (side + align props on Content).
// ---------------------------------------------------------------------------
const arrowVariants = cva('fill-klp-bg-brand-contrasted', {
  variants: {
    arrowOrientation: {
      'bottom-left':  '',
      'bottom-right': '',
      'top-left':     '',
      'top-right':    '',
    },
  },
  defaultVariants: { arrowOrientation: 'bottom-left' },
})

// ---------------------------------------------------------------------------
// Arrow orientation → Radix side + align mapping
// bottom-* = tooltip sits above the trigger, arrow on bottom of bubble
// top-*    = tooltip sits below the trigger, arrow on top of bubble
// *-left   = tooltip is left-aligned (align="start")
// *-right  = tooltip is right-aligned (align="end")
// ---------------------------------------------------------------------------
const ORIENTATION_MAP: Record<
  'bottom-left' | 'bottom-right' | 'top-left' | 'top-right',
  { side: 'top' | 'bottom'; align: 'start' | 'end' }
> = {
  'bottom-left':  { side: 'top',    align: 'start' },
  'bottom-right': { side: 'top',    align: 'end'   },
  'top-left':     { side: 'bottom', align: 'start' },
  'top-right':    { side: 'bottom', align: 'end'   },
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ArrowOrientation = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'

export interface TooltipContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    'side' | 'align'
  >,
    VariantProps<typeof rootVariants> {
  /** Controls arrow placement and tooltip position relative to the trigger.
   * @propClass optional
   */
  arrowOrientation?: ArrowOrientation
}

// ---------------------------------------------------------------------------
// TooltipProvider — re-exported for app-level wrapping
// ---------------------------------------------------------------------------
export const TooltipProvider = TooltipPrimitive.Provider

// ---------------------------------------------------------------------------
// TooltipRoot — re-exported for compound usage
// ---------------------------------------------------------------------------
export const TooltipRoot = TooltipPrimitive.Root

// ---------------------------------------------------------------------------
// TooltipTrigger — re-exported for compound usage
// ---------------------------------------------------------------------------
export const TooltipTrigger = TooltipPrimitive.Trigger

// ---------------------------------------------------------------------------
// TooltipContent — the styled bubble
// ---------------------------------------------------------------------------
export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, arrowOrientation = 'bottom-left', children, ...props }, ref) => {
  const { side, align } = ORIENTATION_MAP[arrowOrientation]

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        side={side}
        align={align}
        sideOffset={6}
        className={cn(rootVariants({ arrowOrientation }), className)}
        {...props}
      >
        <span className={cn(labelVariants({ arrowOrientation }))}>{children}</span>
        <TooltipPrimitive.Arrow
          width={22}
          height={11}
          className={cn(arrowVariants({ arrowOrientation }))}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
})
TooltipContent.displayName = 'TooltipContent'

// ---------------------------------------------------------------------------
// Convenience wrapper — Tooltip
// Accepts a `content` prop so consumers don't have to wire Root+Trigger+Content.
// ---------------------------------------------------------------------------
export interface TooltipProps {
  /** The tooltip bubble text.
   * @propClass required
   */
  content: React.ReactNode
  /** The element that triggers the tooltip.
   * @propClass optional
   */
  children: React.ReactNode
  /** Controls arrow placement and tooltip position.
   * @propClass optional
   */
  arrowOrientation?: ArrowOrientation
  /** Controlled open state.
   * @propClass optional
   */
  open?: boolean
  /** Uncontrolled default open state.
   * @propClass optional
   */
  defaultOpen?: boolean
  /** Callback when open state changes.
   * @propClass optional
   */
  onOpenChange?: (open: boolean) => void
  /** Override delay in ms.
   * @propClass optional
   */
  delayDuration?: number
}

export function Tooltip({
  content,
  children,
  arrowOrientation = 'bottom-left',
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
    >
      <TooltipPrimitive.Trigger asChild>
        {children as React.ReactElement}
      </TooltipPrimitive.Trigger>
      <TooltipContent arrowOrientation={arrowOrientation}>{content}</TooltipContent>
    </TooltipPrimitive.Root>
  )
}

export { rootVariants, labelVariants, arrowVariants }
