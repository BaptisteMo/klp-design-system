import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Layer: root (the entire cell — no child layers in any variant)
//
// fill:        --klp-bg-default → bg-klp-bg-default          (all variants)
// paddingLeft:  literal 12px    → pl-[12px]                  (all variants, tokenGap: unbound, matches --klp-size-s value)
// paddingRight: literal 12px    → pr-[12px]                  (all variants, tokenGap: unbound, matches --klp-size-s value)
// paddingTop:   literal  8px    → pt-[8px]  (height=1)       (tokenGap: unbound, matches --klp-size-xs value)
//               literal 12px    → pt-[12px] (height=2)       (tokenGap: unbound, matches --klp-size-s value)
// paddingBottom:literal  8px    → pb-[8px]  (height=1)       (same as paddingTop)
//               literal 12px    → pb-[12px] (height=2)
// minHeight:    literal 36px    → min-h-[36px]               (all variants, tokenGap: no --klp-size-* alias for 36px)
// minWidth:     literal 48px    → min-w-[48px] (width=48)
//               literal 56px    → min-w-[56px] (width=empty-switch)
//               none            →              (width=default — fluid)
// itemSpacing:  --klp-size-xs   → gap-klp-size-xs            (all variants; no children rendered, retained for completeness)
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'bg-klp-bg-default pl-[12px] pr-[12px] min-h-[36px] gap-klp-size-xs',
  {
    variants: {
      height: {
        '1': 'pt-[8px] pb-[8px]',
        '2': 'pt-[12px] pb-[12px]',
      },
      width: {
        '48': 'min-w-[48px]',
        'empty-switch': 'min-w-[56px]',
        'default': '',
      },
    },
    defaultVariants: { height: '1', width: 'default' },
  }
)

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface TableCellsEmptyProps
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'height' | 'width'> {
  /** Row height tier: '1' = compact (36px min-h, 8px vertical padding), '2' = relaxed (36px min-h, 12px vertical padding) */
  height?: '1' | '2'
  /** Column width constraint: '48' = 48px min-width, 'empty-switch' = 56px min-width, 'default' = fluid */
  width?: '48' | 'empty-switch' | 'default'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TableCellsEmpty = React.forwardRef<
  HTMLTableCellElement,
  TableCellsEmptyProps
>(({ className, height = '1', width = 'default', ...props }, ref) => {
  return (
    <td
      ref={ref}
      className={cn(rootVariants({ height, width }), className)}
      {...props}
    />
  )
})
TableCellsEmpty.displayName = 'TableCellsEmpty'

export { rootVariants as tableCellsEmptyRootVariants }
