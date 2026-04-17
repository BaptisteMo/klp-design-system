import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Checkbox } from '@/components/checkbox'
import { Button } from '@/components/button'
import { Badge } from '@/components/badges'

// ---------------------------------------------------------------------------
// Layer: root
// paddingTop/Bottom: --klp-size-xs (height=1) | --klp-size-s (height=2)
// paddingLeft/Right: literal 8px (unbound in Figma; matches --klp-size-xs value)
// minHeight: literal 36px (height=1) | 44px (height=2) — no matching --klp-size-* alias (tokenGaps)
// overflow: hidden (literal)
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'flex flex-row items-start overflow-hidden pl-[8px] pr-[8px]',
  {
    variants: {
      height: {
        '1': 'pt-klp-size-xs pb-klp-size-xs min-h-[36px]',
        '2': 'pt-klp-size-s pb-klp-size-s min-h-[44px]',
      },
      width: {
        '100': 'w-[100px]',
        '150': 'w-[150px]',
        '200': 'w-[200px]',
        '300': 'w-[300px]',
        '400': 'w-[400px]',
      },
    },
    defaultVariants: { height: '1', width: '200' },
  }
)

// ---------------------------------------------------------------------------
// Layer: content
// Inner flex row that fills root width and holds slots + text-container.
// itemSpacing is a literal in the spec (varies by height/width), but both
// height=1 and height=2 converge on 8px spacing (height=2) or 16px (height=1).
// We use flex gap with the literal value derived from spec.
// Width fills available space (flex-1 / w-full) since it adapts to root width.
// ---------------------------------------------------------------------------
const contentVariants = cva(
  'flex flex-row items-center w-full',
  {
    variants: {
      height: {
        '1': 'gap-[16px]',
        '2': 'gap-[8px]',
      },
    },
    defaultVariants: { height: '1' },
  }
)

// ---------------------------------------------------------------------------
// Layer: text-container
// Vertical flex column; fills content width.
// itemSpacing: --klp-size-3xs → gap-klp-size-3xs
// ---------------------------------------------------------------------------
const textContainerVariants = cva(
  'flex flex-col flex-1 min-w-0 gap-klp-size-3xs',
  {
    variants: {},
    defaultVariants: {},
  }
)

// ---------------------------------------------------------------------------
// Layer: label
// color: --klp-fg-default → text-klp-fg-default
// fontSize: --klp-font-size-text-medium → text-klp-text-medium
// fontFamily: --klp-font-family-body → font-klp-body
// fontWeight: --klp-font-weight-body → font-klp-body (weight utility)
// height=1: truncate (ENDING / TRUNCATE)
// height=2: wrap (HEIGHT auto-resize)
// ---------------------------------------------------------------------------
const labelVariants = cva(
  'text-klp-fg-default text-klp-text-medium font-klp-body font-klp-body',
  {
    variants: {
      height: {
        '1': 'truncate',
        '2': 'whitespace-normal break-words',
      },
    },
    defaultVariants: { height: '1' },
  }
)

// ---------------------------------------------------------------------------
// Layer: subtitle
// color: --klp-fg-default → text-klp-fg-default
// fontSize: --klp-font-size-text-medium → text-klp-text-medium
// Hidden by default; shown when subtitle prop is true
// ---------------------------------------------------------------------------
const subtitleVariants = cva(
  'text-klp-fg-default text-klp-text-medium font-klp-body',
  {
    variants: {},
    defaultVariants: {},
  }
)

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface TableCellsTextProps
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'height' | 'width'> {
  /** Row height tier: '1' = compact (36px), '2' = relaxed (44px) */
  height?: '1' | '2'
  /** Column width in pixels */
  width?: '100' | '150' | '200' | '300' | '400'
  /** Primary cell text */
  text?: string
  /** Show subtitle line below label */
  showSubtitle?: boolean
  /** Subtitle text content */
  subtitleText?: string
  /** Show checkbox slot (optional composition) */
  checkbox?: boolean
  /** Checkbox checked state — used when checkbox=true */
  checkboxChecked?: boolean | 'indeterminate'
  /** Called when the checkbox value changes */
  onCheckboxChange?: (checked: boolean | 'indeterminate') => void
  /** Show avatar slot placeholder (optional composition) */
  avatar?: boolean
  /** Custom avatar node rendered in the avatar slot */
  avatarNode?: React.ReactNode
  /** Show icon-button slot using Button icon variant */
  iconButton?: boolean
  /** Icon to render inside the icon-button slot */
  iconButtonIcon?: React.ReactNode
  /** Called when the icon button is clicked */
  onIconButtonClick?: () => void
  /** Show badge slot (optional composition) */
  badge?: boolean
  /** Badge label text */
  badgeLabel?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TableCellsText = React.forwardRef<
  HTMLTableCellElement,
  TableCellsTextProps
>(
  (
    {
      className,
      height = '1',
      width = '200',
      text = '24/04/2023',
      showSubtitle = false,
      subtitleText = 'Subtitle',
      checkbox = false,
      checkboxChecked,
      onCheckboxChange,
      avatar = false,
      avatarNode,
      iconButton = false,
      iconButtonIcon,
      onIconButtonClick,
      badge = false,
      badgeLabel = 'Badge',
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
        <div className={cn(contentVariants({ height }))}>
          {/* Checkbox slot — rendered only when checkbox=true */}
          {checkbox && (
            <Checkbox
              checked={checkboxChecked}
              onCheckedChange={onCheckboxChange}
              aria-label="Select row"
            />
          )}

          {/* Avatar slot — rendered only when avatar=true */}
          {avatar && avatarNode && (
            <span className="inline-flex shrink-0 items-center justify-center">
              {avatarNode}
            </span>
          )}

          {/* Text container — label + optional subtitle */}
          <div className={cn(textContainerVariants())}>
            <span className={cn(labelVariants({ height }))}>
              {text}
            </span>

            {showSubtitle && (
              <span className={cn(subtitleVariants())}>
                {subtitleText}
              </span>
            )}
          </div>

          {/* Icon-button slot — rendered only when iconButton=true */}
          {iconButton && (
            <Button
              variant="tertiary"
              size="icon"
              htmlType="button"
              aria-label="Row action"
              onClick={onIconButtonClick}
            >
              {iconButtonIcon}
            </Button>
          )}

          {/* Badge slot — rendered only when badge=true */}
          {badge && (
            <Badge badgeType="tertiary" size="small">
              {badgeLabel}
            </Badge>
          )}
        </div>
      </td>
    )
  }
)
TableCellsText.displayName = 'TableCellsText'

export {
  rootVariants as tableCellsTextRootVariants,
  contentVariants as tableCellsTextContentVariants,
  textContainerVariants as tableCellsTextContainerVariants,
  labelVariants as tableCellsTextLabelVariants,
  subtitleVariants as tableCellsTextSubtitleVariants,
}
