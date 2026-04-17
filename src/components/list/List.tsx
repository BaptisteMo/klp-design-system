import * as React from 'react'
import { cva } from 'class-variance-authority'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
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
// header-button layer — present in condensed + default; hidden in with-inputs
// Spec: fill=--klp-bg-inset, border=--klp-border-invisible, radius=--klp-radius-l
// paddingX=--klp-size-m, paddingY=--klp-size-xs, gap=--klp-size-2xs
// color=--klp-fg-default, fontSize=--klp-font-size-text-medium
// fontFamily=--klp-font-family-label, fontWeight=--klp-font-weight-label-bold
// ---------------------------------------------------------------------------
const headerButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'bg-klp-bg-inset border border-klp-border-invisible rounded-klp-l',
    'pl-klp-size-m pr-klp-size-m pt-klp-size-xs pb-klp-size-xs gap-klp-size-2xs',
    'text-klp-fg-default text-klp-text-medium font-klp-label font-klp-label-bold',
    'cursor-pointer transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klp-border-brand-emphasis',
  ].join(' '),
  {
    variants: {
      style: {
        condensed:    '',
        default:      '',
        'with-inputs': 'hidden',
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
  /** Layout style variant */
  listStyle?: ListStyle
  /** Title text rendered in the header */
  listTitle?: React.ReactNode
  /** Whether to show the header action button (hidden in with-inputs) */
  showButton?: boolean
  /** Label text for the header action button */
  buttonLabel?: React.ReactNode
  /** Click handler for the header action button */
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Size passed down to each ListContent row */
  itemSize?: ListContentSize
  /** Rows — each entry maps to a <ListContent> instance */
  items?: ListItemConfig[]
  /**
   * Slot for filter inputs shown in the header when style="with-inputs".
   * Render your <Input> instances here.
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

          {/* header-button — condensed + default only */}
          {showButton && (
            <button
              type="button"
              className={headerButtonVariants({ style: listStyle })}
              onClick={onButtonClick}
              style={{ fontWeight: 'var(--font-weight-klp-label-bold)' }}
            >
              <span>{buttonLabel}</span>
              <span aria-hidden="true" className="text-klp-fg-default inline-flex items-center [&>svg]:h-[16px] [&>svg]:w-[16px]">
                <ArrowRight strokeWidth={1.5} />
              </span>
            </button>
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
  headerButtonVariants,
  headerInputsVariants,
  itemsVariants,
}
