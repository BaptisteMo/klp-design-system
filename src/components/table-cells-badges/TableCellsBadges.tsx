import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Hourglass } from 'lucide-react'
import { Badge } from '@/components/badges'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Layer: root
// Derived from spec.variants[].layers.root
//
// paddingX is literal 8px across all variants → pl-[8px] pr-[8px]
// paddingY differs by type:
//   type=badge → 12px (all badge variants) → pt-[12px] pb-[12px]
//   type=status → 8px (all status variants) → pt-[8px] pb-[8px]
// minHeight differs by type:
//   type=badge → 44px
//   type=status → 36px
// Width is driven by the `width` axis (square values differ by height, see width=square below).
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'flex flex-row items-center pl-[8px] pr-[8px]',
  {
    variants: {
      type: {
        badge: 'pt-[12px] pb-[12px] min-h-[44px]',
        status: 'pt-[8px] pb-[8px] min-h-[36px]',
      },
      width: {
        '100': 'w-[100px]',
        '150-auto': 'w-[150px]',
        '200': 'w-[200px]',
        '300': 'w-[300px]',
        '400': 'w-[400px]',
        // square: height=1 → 48px, height=2 → 56px; resolved at runtime via squareHeight prop
        'square': 'w-[48px]',
      },
    },
    defaultVariants: { type: 'badge', width: '150-auto' },
  }
)

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type TableCellBadgeType = 'badge' | 'status'
export type TableCellBadgeWidth = '100' | '150-auto' | '200' | '300' | '400' | 'square'
export type TableCellBadgeHeight = '1' | '2'

export interface TableCellsBadgesProps
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'width'>,
    VariantProps<typeof rootVariants> {
  /** Display type: 'badge' renders a branded text pill; 'status' renders an info icon-only pill */
  type?: TableCellBadgeType
  /** Column width preset */
  width?: TableCellBadgeWidth
  /** Row height tier — affects square-width only (h1=48px, h2=56px) */
  height?: TableCellBadgeHeight
  /** Label text shown inside the badge (type=badge only) */
  label?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TableCellsBadges = React.forwardRef<HTMLTableCellElement, TableCellsBadgesProps>(
  (
    {
      className,
      type = 'badge',
      width = '150-auto',
      height = '1',
      label = 'Label',
      ...props
    },
    ref
  ) => {
    // square width differs between height=1 (48px) and height=2 (56px)
    const squareWidthClass = height === '2' ? 'w-[56px]' : 'w-[48px]'

    return (
      <td
        ref={ref}
        className={cn(
          rootVariants({ type, width: width === 'square' ? undefined : width }),
          width === 'square' ? squareWidthClass : undefined,
          className
        )}
        {...props}
      >
        {type === 'badge' ? (
          // type=badge: bg/brand-low fill + bd/brand-emphasis stroke + fg/brand-contrasted label
          // Maps to Badge badgeType="primary" badgeStyle="bordered" size="small"
          <Badge badgeType="primary" badgeStyle="bordered" size="small">
            {label}
          </Badge>
        ) : (
          // type=status: bg/info fill + bd/invisible stroke + fg/info icon (Hourglass)
          // Maps to Badge badgeType="info" badgeStyle="light" size="small" leftIcon=<Hourglass>
          <Badge
            badgeType="info"
            badgeStyle="light"
            size="small"
            leftIcon={<Hourglass aria-hidden="true" strokeWidth={1.5} />}
          />
        )}
      </td>
    )
  }
)
TableCellsBadges.displayName = 'TableCellsBadges'

export { rootVariants }
