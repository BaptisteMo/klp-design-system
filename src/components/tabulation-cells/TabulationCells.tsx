import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/badges'

// ---------------------------------------------------------------------------
// rootVariants — derived from spec.variants[].layers.root
// Padding uses per-side literals (spec uses paddingLeft/Right/Top/Bottom).
// cornerRadius and itemSpacing are literals (no --klp-* token in spec).
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'inline-flex items-center justify-center rounded-[6px] pl-[12px] pr-[12px] pt-[6px] pb-[6px] gap-[8px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klp-border-brand cursor-pointer',
  {
    variants: {
      state: {
        rest:   'bg-klp-bg-invisible',
        active: 'bg-klp-bg-default shadow-[0_1px_1px_rgba(0,0,0,0.15)]',
      },
    },
    defaultVariants: { state: 'rest' },
  }
)

// ---------------------------------------------------------------------------
// labelVariants — derived from spec.variants[].layers.label
// ---------------------------------------------------------------------------
const labelVariants = cva(
  'font-klp-label text-klp-text-medium',
  {
    variants: {
      state: {
        rest:   'text-klp-fg-default font-klp-label',
        active: 'text-klp-fg-default font-klp-label-bold',
      },
    },
    defaultVariants: { state: 'rest' },
  }
)

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------
export interface TabulationCellProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof rootVariants> {
  /**
   * Label text rendered inside the tab cell (passed as children).
   * @propClass required
   */
  children?: React.ReactNode
  /** Badge count to display alongside the label. Omit to hide the badge.
   * @propClass optional
   */
  badge?: number | string
}

// ---------------------------------------------------------------------------
// TabulationCell — a single Tabs.Trigger cell
// ---------------------------------------------------------------------------
const TabulationCell = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabulationCellProps
>(({ className, state, badge, children, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(rootVariants({ state }), className)}
      {...props}
    >
      <span className={labelVariants({ state })}>
        {children}
      </span>
      {badge !== undefined && badge !== null && (
        <Badge
          badgeType={state === 'active' ? 'primary' : 'on-emphasis'}
          badgeStyle="light"
          size="small"
        >
          {badge}
        </Badge>
      )}
    </TabsPrimitive.Trigger>
  )
})
TabulationCell.displayName = 'TabulationCell'

// ---------------------------------------------------------------------------
// Re-export Radix Tabs parts for compound usage
// ---------------------------------------------------------------------------
const TabulationCellsRoot = TabsPrimitive.Root
TabulationCellsRoot.displayName = 'TabulationCellsRoot'

const TabulationCellsList = TabsPrimitive.List
TabulationCellsList.displayName = 'TabulationCellsList'

const TabulationCellsContent = TabsPrimitive.Content
TabulationCellsContent.displayName = 'TabulationCellsContent'

export {
  TabulationCell,
  TabulationCellsRoot,
  TabulationCellsList,
  TabulationCellsContent,
  rootVariants,
  labelVariants,
}
