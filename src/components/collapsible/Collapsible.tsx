import * as React from 'react'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { cva } from 'class-variance-authority'
import { ChevronRight, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'

// ---------------------------------------------------------------------------
// Layer: root
// close variant: bg-klp-bg-default, border-klp-border-default, rounded-klp-l (8px literal)
//                px-klp-size-m, py-klp-size-m, gap-klp-size-m, flex-col layout
// open variant:  bg-klp-bg-default, border-klp-border-default, rounded-klp-xl (16px literal)
//                no direct padding (padding is on the content sub-layers)
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'flex flex-col border bg-klp-bg-default border-klp-border-default',
  {
    variants: {
      state: {
        close: 'rounded-klp-xl px-klp-size-m py-klp-size-m gap-klp-size-m',
        open:  'rounded-klp-xl overflow-hidden',
      },
    },
    defaultVariants: { state: 'close' },
  }
)

// ---------------------------------------------------------------------------
// Layer: header
// close variant: header IS the root — no separate header layer; render as flex row
// open variant:  frosted-glass: bg-klp-bg-inset/70 backdrop-blur-xl, px-klp-size-m py-klp-size-m
// ---------------------------------------------------------------------------
const headerVariants = cva(
  'flex items-center gap-klp-size-m',
  {
    variants: {
      state: {
        close: '',
        open:  'bg-klp-bg-inset/70 backdrop-blur-xl px-klp-size-m py-klp-size-m',
      },
    },
    defaultVariants: { state: 'close' },
  }
)

// ---------------------------------------------------------------------------
// Layer: icon
// color: --klp-fg-default → text-klp-fg-default
// size: 16px icon inside a 20px wrapper (literal)
// ---------------------------------------------------------------------------
const iconVariants = cva(
  'inline-flex shrink-0 items-center justify-center text-klp-fg-default [&>svg]:h-[16px] [&>svg]:w-[16px]',
  {
    variants: {
      state: {
        close: '',
        open:  '',
      },
    },
    defaultVariants: { state: 'close' },
  }
)

// ---------------------------------------------------------------------------
// Layer: title
// color: --klp-fg-default → text-klp-fg-default
// fontSize: --klp-font-size-text-large → text-klp-text-large
// fontFamily: --klp-font-family-label → font-klp-label
// fontWeight: --klp-font-weight-label-bold → font-klp-label-bold
// ---------------------------------------------------------------------------
const titleVariants = cva(
  'flex-1 text-klp-fg-default text-klp-text-large font-klp-label font-klp-label-bold',
  {
    variants: {
      state: {
        close: '',
        open:  '',
      },
    },
    defaultVariants: { state: 'close' },
  }
)

// ---------------------------------------------------------------------------
// Layer: content
// paddingX: 16px → px-klp-size-m (matches --klp-size-m)
// paddingY: 24px → py-klp-size-l (matches --klp-size-l)
// gap: 16px → gap-klp-size-m (matches --klp-size-m)
// cornerRadius: 12px literal → rounded-[12px]
// ---------------------------------------------------------------------------
const contentVariants = cva(
  'flex flex-col px-klp-size-m py-klp-size-l gap-klp-size-m',
  {
    variants: {
      state: {
        close: '',
        open:  '',
      },
    },
    defaultVariants: { state: 'close' },
  }
)

// ---------------------------------------------------------------------------
// Layer: content-text
// fontSize: --klp-font-size-text-medium → text-klp-text-medium
// fontFamily: --klp-font-family-label → font-klp-label
// fontWeight: --klp-font-weight-label → font-klp-label
// color: literal #000000 resolved as --klp-fg-default → text-klp-fg-default
// ---------------------------------------------------------------------------
const contentTextVariants = cva(
  'text-klp-text-medium font-klp-label font-klp-label text-klp-fg-default',
  {
    variants: {
      state: {
        close: '',
        open:  '',
      },
    },
    defaultVariants: { state: 'close' },
  }
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface CollapsibleProps {
  /** Controlled open state
   * @propClass optional
   */
  open?: boolean
  /** Default open state (uncontrolled)
   * @propClass optional
   */
  defaultOpen?: boolean
  /** Callback when open state changes
   * @propClass optional
   */
  onOpenChange?: (open: boolean) => void
  /** Leading icon in the header. Defaults to ShoppingCart as placeholder.
   * @propClass optional
   */
  icon?: React.ReactNode
  /** Section title
   * @propClass optional
   */
  title?: string
  /** Content rendered inside the collapsible area
   * @propClass optional
   */
  children?: React.ReactNode
  /** Additional className on the root element
   * @propClass optional
   */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      icon,
      title = 'Section title',
      children,
      className,
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const isOpen = open !== undefined ? open : internalOpen

    const handleOpenChange = (next: boolean) => {
      if (open === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    }

    const state = isOpen ? 'open' : 'close'

    return (
      <CollapsiblePrimitive.Root
        ref={ref}
        open={isOpen}
        onOpenChange={handleOpenChange}
        className={cn(rootVariants({ state }), className)}
      >
        {/* Header */}
        <div className={headerVariants({ state })}>
          {/* Leading icon */}
          <span aria-hidden="true" className={iconVariants({ state })}>
            {icon ?? <ShoppingCart />}
          </span>

          {/* Title */}
          <span className={titleVariants({ state })}>
            {title}
          </span>

          {/* Toggle button — DS Button, variant=tertiary, size=icon */}
          <CollapsiblePrimitive.Trigger asChild>
            <Button
              variant="tertiary"
              size="icon"
              aria-label={isOpen ? 'Collapse section' : 'Expand section'}
            >
              <ChevronRight
                aria-hidden="true"
                className={cn(
                  'text-klp-fg-muted transition-transform duration-200',
                  isOpen && 'rotate-90'
                )}
                strokeWidth={1.5}
              />
            </Button>
          </CollapsiblePrimitive.Trigger>
        </div>

        {/* Collapsible content */}
        <CollapsiblePrimitive.Content>
          <div className={contentVariants({ state: 'open' })}>
            {children ?? (
              <p className={contentTextVariants({ state: 'open' })}>
                Content goes here. Replace this with your own children.
              </p>
            )}
          </div>
        </CollapsiblePrimitive.Content>
      </CollapsiblePrimitive.Root>
    )
  }
)
Collapsible.displayName = 'Collapsible'

export {
  rootVariants as collapsibleRootVariants,
  headerVariants as collapsibleHeaderVariants,
  iconVariants as collapsibleIconVariants,
  titleVariants as collapsibleTitleVariants,
  contentVariants as collapsibleContentVariants,
  contentTextVariants as collapsibleContentTextVariants,
}

// Re-export Radix parts for compound usage
export const CollapsibleRoot = CollapsiblePrimitive.Root
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger
export const CollapsibleContent = CollapsiblePrimitive.Content
