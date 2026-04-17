import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Checkbox } from '@/components/checkbox'
import type { CheckboxProps } from '@/components/checkbox'

// ---------------------------------------------------------------------------
// Layer: root (the <td> container)
//
// Spec source: .klp/figma-refs/table-cells-checkbox/spec.json
//
// fill:          --klp-bg-default → bg-klp-bg-default         (all variants)
// itemSpacing:   --klp-size-xs   → gap-klp-size-xs            (all variants)
// paddingLeft:   literal 12px    → pl-[12px]                  (all variants, tokenGap: unbound, expected --klp-size-s)
// paddingRight:  literal 12px    → pr-[12px]                  (all variants, tokenGap: unbound, expected --klp-size-s)
// paddingTop:    literal 8px     → pt-[8px]  (height=1)       (tokenGap: unbound, expected --klp-size-xs)
//                literal 12px    → pt-[12px] (height=2)       (tokenGap: unbound, expected --klp-size-s)
// paddingBottom: literal 8px     → pb-[8px]  (height=1)
//                literal 12px    → pb-[12px] (height=2)
// minHeight:     literal 36px    → min-h-[36px]               (all variants, tokenGap: no --klp-size-* alias for 36px)
// width=48:      literal 48px    → w-[48px]                   (fixed column)
// width=default:                   w-full                     (fluid)
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'inline-flex items-center justify-center bg-klp-bg-default pl-[12px] pr-[12px] min-h-[36px] gap-klp-size-xs',
  {
    variants: {
      height: {
        '1': 'pt-[8px] pb-[8px]',
        '2': 'pt-[12px] pb-[12px]',
      },
      width: {
        '48': 'w-[48px]',
        'default': 'w-full',
      },
    },
    defaultVariants: { height: '2', width: 'default' },
  }
)

// ---------------------------------------------------------------------------
// Layer: checkbox
//
// This layer is a live INSTANCE of the klp Checkbox component.
// Its fill/stroke/cornerRadius/padding are delegated entirely to <Checkbox> —
// those tokens are owned by the Checkbox component's own cva blocks.
// No wrapper classes needed beyond the Checkbox itself.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface TableCellsCheckboxProps
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'height' | 'width'> {
  /** Row height tier: '1' = compact (48px, 8px vertical padding), '2' = default (56px, 12px vertical padding) */
  height?: '1' | '2'
  /** Column width constraint: '48' = 48px fixed, 'default' = fluid */
  width?: '48' | 'default'
  // Checkbox controlled mode
  /** The controlled checked state of the checkbox ('indeterminate' for mixed state) */
  checked?: CheckboxProps['checked']
  /** Callback fired when the checked state changes */
  onCheckedChange?: CheckboxProps['onCheckedChange']
  // Checkbox uncontrolled mode
  /** The default checked state (uncontrolled). Named checkboxDefaultChecked to avoid conflict with the HTML td defaultChecked attribute. */
  checkboxDefaultChecked?: CheckboxProps['defaultChecked']
  /** Whether the checkbox is disabled */
  disabled?: CheckboxProps['disabled']
  /** aria-label forwarded to the embedded Checkbox for accessibility */
  checkboxAriaLabel?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TableCellsCheckbox = React.forwardRef<
  HTMLTableCellElement,
  TableCellsCheckboxProps
>(
  (
    {
      className,
      height = '2',
      width = 'default',
      checked,
      onCheckedChange,
      checkboxDefaultChecked,
      disabled,
      checkboxAriaLabel,
      ...props
    },
    ref
  ) => {
    return (
      <td
        ref={ref}
        className={cn(rootVariants({ height, width }), className)}
        {...props}
      >
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          defaultChecked={checkboxDefaultChecked}
          disabled={disabled}
          aria-label={checkboxAriaLabel}
        />
      </td>
    )
  }
)
TableCellsCheckbox.displayName = 'TableCellsCheckbox'

export { rootVariants as tableCellsCheckboxRootVariants }
