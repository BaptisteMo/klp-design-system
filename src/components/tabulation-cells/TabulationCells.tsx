import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// rootVariants — derived from spec.variants[].layers.root
// Padding uses per-side literals (spec uses paddingLeft/Right/Top/Bottom).
// cornerRadius and itemSpacing are literals (no --klp-* token in spec).
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'inline-flex items-center justify-center rounded-[8px] pl-[12px] pr-[12px] pt-[6px] pb-[6px] gap-[8px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klp-border-brand',
  {
    variants: {
      state: {
        rest:   'bg-klp-bg-invisible',
        active: 'bg-klp-bg-brand-low shadow-[0_1px_1px_rgba(0,0,0,0.15)]',
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
// badgeVariants — derived from spec.variants[].layers.badge
// paddingX/paddingY use token-mapped utilities (--klp-size-xs / --klp-size-2xs).
// cornerRadius is a literal 4px.
// ---------------------------------------------------------------------------
const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-[4px] border px-klp-size-xs py-klp-size-2xs font-klp-body text-klp-text-small',
  {
    variants: {
      state: {
        rest:   'bg-klp-bg-invisible border-klp-border-invisible text-klp-fg-muted',
        active: 'bg-klp-bg-brand-low border-klp-border-invisible text-klp-fg-brand-contrasted',
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
  /** Badge count to display alongside the label. Omit to hide the badge. */
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
        <span className={badgeVariants({ state })}>
          {badge}
        </span>
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
  badgeVariants,
}
