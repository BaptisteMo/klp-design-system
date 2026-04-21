import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { Plus, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'

// ---------------------------------------------------------------------------
// root layer — fill, padding, gap, radius vary by size + state
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'group flex flex-col w-full cursor-pointer transition-colors',
  {
    variants: {
      size: {
        small:  'p-klp-size-xs gap-klp-size-xs rounded-klp-l',
        medium: 'pt-klp-size-s pb-klp-size-s pl-klp-size-xs pr-klp-size-xs gap-klp-size-s rounded-klp-l',
        large:  'pt-klp-size-m pb-klp-size-m pl-klp-size-s pr-klp-size-s gap-klp-size-m rounded-klp-l',
      },
      state: {
        default: 'hover:bg-klp-bg-subtle',
        hover:   'bg-klp-bg-subtle',
        active:  'bg-klp-bg-secondary-brand-low',
      },
    },
    defaultVariants: { size: 'medium', state: 'default' },
  }
)

// ---------------------------------------------------------------------------
// decorative-icon layer — color varies by state; fixed 20×20
// ---------------------------------------------------------------------------
const decorativeIconVariants = cva(
  'inline-flex shrink-0 items-center justify-center [&>svg]:h-[20px] [&>svg]:w-[20px]',
  {
    variants: {
      state: {
        default: 'text-klp-fg-default',
        hover:   'text-klp-fg-default',
        active:  'text-klp-fg-secondary-brand-contrasted',
      },
    },
    defaultVariants: { state: 'default' },
  }
)

// ---------------------------------------------------------------------------
// label layer — color varies by state; typography is fixed across states
// ---------------------------------------------------------------------------
const labelVariants = cva(
  'font-klp-label font-klp-label text-klp-text-medium leading-[24px]',
  {
    variants: {
      state: {
        default: 'text-klp-fg-default',
        hover:   'text-klp-fg-default',
        active:  'text-klp-fg-secondary-brand-contrasted',
      },
    },
    defaultVariants: { state: 'default' },
  }
)

// ---------------------------------------------------------------------------
// sublabel layer — color is always fg-muted; font-size varies by size
// ---------------------------------------------------------------------------
const sublabelVariants = cva(
  'font-klp-label font-klp-label text-klp-fg-muted',
  {
    variants: {
      size: {
        small:  'text-klp-text-small leading-[20px]',
        medium: 'text-klp-text-small leading-[20px]',
        large:  'text-klp-text-medium leading-[24px]',
      },
    },
    defaultVariants: { size: 'medium' },
  }
)

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------
export type ListContentSize  = 'small' | 'medium' | 'large'
export type ListContentState = 'default' | 'hover' | 'active'

export interface ListContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size variant — controls padding and sublabel font-size
   * @propClass optional
   */
  size?: ListContentSize
  /** Interaction state — controls background fill and text/icon color.
   * Represents the selected row in the list.
   *
   * @propClass persistent
   */
  state?: ListContentState
  /** Primary label text
   * @propClass optional
   */
  label?: React.ReactNode
  /** Secondary sublabel text
   * @propClass optional
   */
  sublabel?: React.ReactNode
  /** Whether to show the sublabel
   * @propClass optional
   */
  showSublabel?: boolean
  /** Whether to show the left decorative icon
   * @propClass optional
   */
  showDecorativeIcon?: boolean
  /** Custom decorative icon — defaults to Plus from lucide-react
   * @propClass optional
   */
  decorativeIcon?: React.ReactNode
  /** Whether to show the right action button
   * @propClass optional
   */
  showActionButton?: boolean
  /** Callback for the action button click
   * @propClass optional
   */
  onActionClick?: React.MouseEventHandler<HTMLButtonElement>
  /** aria-label for the action button
   * @propClass optional
   */
  actionLabel?: string
  /** Use Slot (asChild) pattern on the root
   * @propClass optional
   */
  asChild?: boolean
}

const ListContent = React.forwardRef<HTMLDivElement, ListContentProps>(
  (
    {
      className,
      size = 'medium',
      state = 'default',
      label = 'Label of the list',
      sublabel = 'Sublabel',
      showSublabel = true,
      showDecorativeIcon = true,
      decorativeIcon,
      showActionButton = true,
      onActionClick,
      actionLabel = 'More options',
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'div'

    return (
      <Comp
        ref={ref}
        role="listitem"
        className={cn(rootVariants({ size, state }), className)}
        {...props}
      >
        {/* content row: left-part + action-button */}
        <div className="flex items-center gap-[4px] w-full">
          {/* left-part: decorative-icon + headline-subcontent */}
          <div className="flex flex-1 items-center gap-[7px] min-w-0">
            {showDecorativeIcon && (
              <span
                aria-hidden="true"
                className={decorativeIconVariants({ state })}
              >
                {decorativeIcon ?? <Plus strokeWidth={1.5} />}
              </span>
            )}
            {/* headline + sublabel stack */}
            <div className="flex flex-col min-w-0">
              <span className={labelVariants({ state })}>
                {children ?? label}
              </span>
              {showSublabel && (
                <span className={sublabelVariants({ size })}>
                  {sublabel}
                </span>
              )}
            </div>
          </div>

          {/* action-button — reuses the DS Button (tertiary × icon) */}
          {showActionButton && (
            <Button
              variant="tertiary"
              size="icon"
              aria-label={actionLabel}
              onClick={(e) => {
                e.stopPropagation()
                onActionClick?.(e)
              }}
            >
              <MoreVertical strokeWidth={1.5} />
            </Button>
          )}
        </div>
      </Comp>
    )
  }
)

ListContent.displayName = 'ListContent'

export { ListContent, rootVariants, decorativeIconVariants, labelVariants, sublabelVariants }
