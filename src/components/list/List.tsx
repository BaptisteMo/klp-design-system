import * as React from 'react'
import { cva } from 'class-variance-authority'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'
import { ListContent } from '@/components/list-content'
import type { ListContentSize, ListContentProps } from '@/components/list-content'

// ---------------------------------------------------------------------------
// root layer — vertical flex column; gap from spec: --klp-size-xs across all
// ---------------------------------------------------------------------------
const rootVariants = cva('flex flex-col w-full', {
  variants: {
    style: {
      condensed:    'gap-klp-size-xs',
      default:      'gap-klp-size-xs',
      'with-inputs': 'gap-klp-size-xs',
    },
  },
  defaultVariants: { style: 'default' },
})

// ---------------------------------------------------------------------------
// header layer — horizontal flex row, 40px tall, space-between
// ---------------------------------------------------------------------------
const headerVariants = cva(
  'flex flex-row items-center justify-between h-[40px] w-full',
  {
    variants: {
      style: {
        condensed:    '',
        default:      '',
        'with-inputs': '',
      },
    },
    defaultVariants: { style: 'default' },
  }
)

// ---------------------------------------------------------------------------
// header-title layer — H2 typography; color is literal #2b2b2b (no klp token)
// ---------------------------------------------------------------------------
const headerTitleVariants = cva(
  // font-size: --klp-font-size-heading-h2 → text-klp-heading-h2
  // font-family: --klp-font-family-title → font-klp-title
  // font-weight: --klp-font-weight-title → font-weight-klp-title (applied via style prop per theme.css)
  // color: literal #2b2b2b — no matching --klp-* token in any variant
  'text-klp-heading-h2 font-klp-title leading-[32px] text-[#2b2b2b]',
  {
    variants: {
      style: {
        condensed:    '',
        default:      '',
        'with-inputs': '',
      },
    },
    defaultVariants: { style: 'default' },
  }
)

// ---------------------------------------------------------------------------
// header-inputs layer — only visible in with-inputs; flex row with gap=--klp-size-m
// ---------------------------------------------------------------------------
const headerInputsVariants = cva('', {
  variants: {
    style: {
      condensed:    'hidden',
      default:      'hidden',
      'with-inputs': 'flex flex-row gap-klp-size-m',
    },
  },
  defaultVariants: { style: 'default' },
})

// ---------------------------------------------------------------------------
// items layer — vertical stack of ListContent rows; gap=--klp-size-3xs
// ---------------------------------------------------------------------------
const itemsVariants = cva('flex flex-col w-full gap-klp-size-3xs', {
  variants: {
    style: {
      condensed:    '',
      default:      '',
      'with-inputs': '',
    },
  },
  defaultVariants: { style: 'default' },
})

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type ListStyle = 'condensed' | 'default' | 'with-inputs'

export interface ListItemConfig
  extends Omit<ListContentProps, 'size'> {
  /** Unique key for the row */
  key: string
}

export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout style variant
   * @propClass optional
   */
  listStyle?: ListStyle
  /** Title text rendered in the header
   * @propClass optional
   */
  listTitle?: React.ReactNode
  /** Whether to show the header action button (hidden in with-inputs)
   * @propClass optional
   */
  showButton?: boolean
  /** Label text for the header action button
   * @propClass optional
   */
  buttonLabel?: React.ReactNode
  /** Click handler for the header action button
   * @propClass optional
   */
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Size passed down to each ListContent row
   * @propClass optional
   */
  itemSize?: ListContentSize
  /** Rows — each entry maps to a <ListContent> instance
   * @propClass required
   */
  items?: ListItemConfig[]
  /**
   * Slot for filter inputs shown in the header when style="with-inputs".
   * Render your <Input> instances here.
   *
   * @propClass optional
   */
  headerInputs?: React.ReactNode
}

const List = React.forwardRef<HTMLDivElement, ListProps>(
  (
    {
      className,
      listStyle = 'default',
      listTitle = 'List title',
      showButton = true,
      buttonLabel = 'See all',
      onButtonClick,
      itemSize = 'medium',
      items = [],
      headerInputs,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="list"
        className={cn(rootVariants({ style: listStyle }), className)}
        {...props}
      >
        {/* header */}
        <div className={headerVariants({ style: listStyle })}>
          <span
            className={headerTitleVariants({ style: listStyle })}
            style={{ fontWeight: 'var(--font-weight-klp-title)' }}
          >
            {listTitle}
          </span>

          {/* header-button — condensed + default only (DS Button tertiary × md) */}
          {showButton && listStyle !== 'with-inputs' && (
            <Button
              variant="tertiary"
              size="md"
              rightIcon={<ArrowRight strokeWidth={1.5} />}
              onClick={onButtonClick}
            >
              {buttonLabel}
            </Button>
          )}

          {/* header-inputs — with-inputs only */}
          {listStyle === 'with-inputs' && headerInputs && (
            <div className={headerInputsVariants({ style: listStyle })}>
              {headerInputs}
            </div>
          )}
        </div>

        {/* items — each row is a ListContent instance */}
        <div className={itemsVariants({ style: listStyle })}>
          {items.map(({ key, ...itemProps }) => (
            <ListContent
              key={key}
              size={itemSize}
              {...itemProps}
            />
          ))}
          {/* allow direct children as items too */}
          {children}
        </div>
      </div>
    )
  }
)

List.displayName = 'List'

export {
  List,
  rootVariants,
  headerVariants,
  headerTitleVariants,
  headerInputsVariants,
  itemsVariants,
}
