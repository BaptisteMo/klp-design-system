import * as React from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { cva } from 'class-variance-authority'
import { FolderOpen, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ActionSheetItem } from '@/components/action-sheet-item'

// ---------------------------------------------------------------------------
// root layer — outer container wrapping trigger + optional content panel
// No token-bound fill/stroke on root itself — those live on trigger / content
// ---------------------------------------------------------------------------
const rootVariants = cva('flex w-full flex-col')

// ---------------------------------------------------------------------------
// trigger layer — clickable row: icon-container + label + optional chevron
// Derived from spec.variants[].layers.trigger
//
// state × feature matrix:
//   rest/collapsible  → no fill (transparent)
//   rest/static       → no fill (transparent)
//   hover/collapsible → bg-klp-bg-inset
//   hover/static      → bg-klp-bg-inset
//   active/collapsible→ bg-klp-bg-default
//   active/static     → bg-klp-bg-inset
// ---------------------------------------------------------------------------
const triggerVariants = cva(
  'inline-flex w-full cursor-pointer items-center gap-klp-size-xs rounded-klp-m transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klp-border-brand px-klp-size-xs py-klp-size-xs text-left',
  {
    variants: {
      state: {
        rest:   'bg-transparent',
        hover:  'bg-klp-bg-inset',
        active: 'bg-klp-bg-default',
      },
      feature: {
        collapsible: '',
        static: '',
      },
    },
    compoundVariants: [
      // active+static uses bg-inset (same as hover), not bg-default
      { state: 'active', feature: 'static', className: 'bg-klp-bg-inset' },
    ],
    defaultVariants: { state: 'rest', feature: 'collapsible' },
  }
)

// ---------------------------------------------------------------------------
// icon-container layer — decorative icon box with optional border
// Derived from spec.variants[].layers.icon-container
//
// active states → bg-klp-bg-default + border-klp-border-contrasted
// rest/hover states → bg-klp-bg-invisible + border-klp-border-invisible
// ---------------------------------------------------------------------------
const iconContainerVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-klp-m border',
  {
    variants: {
      state: {
        rest:   'bg-klp-bg-invisible border-klp-border-invisible',
        hover:  'bg-klp-bg-invisible border-klp-border-invisible',
        active: 'bg-klp-bg-default border-klp-border-contrasted',
      },
    },
    defaultVariants: { state: 'rest' },
  }
)

// ---------------------------------------------------------------------------
// decorative-icon layer — 20×20 container with 2px (size-4xs) padding
// Literal size: 20px (no --klp-size-* alias covers 20px)
// ---------------------------------------------------------------------------
const decorativeIconVariants = cva(
  'inline-flex items-center justify-center w-[20px] h-[20px] p-klp-size-4xs'
)

// ---------------------------------------------------------------------------
// icon layer — 16×16 folder-open icon; color inherits from parent via currentColor
// ---------------------------------------------------------------------------
const iconVariants = cva(
  'inline-flex shrink-0 items-center justify-center text-klp-fg-brand [&>svg]:h-[16px] [&>svg]:w-[16px]'
)

// ---------------------------------------------------------------------------
// label layer — item text
// Derived from spec.variants[].layers.label (identical across all variants)
// ---------------------------------------------------------------------------
const labelVariants = cva(
  'flex-1 text-klp-text-medium font-klp-label font-klp-label text-klp-fg-default'
)

// ---------------------------------------------------------------------------
// chevron layer — collapsible-only; chevron-right at rest/hover, chevron-down at active
// 16×16 wrapper, 14×14 icon (literal — no --klp-size-* alias at 14px)
// ---------------------------------------------------------------------------
const chevronVariants = cva(
  'inline-flex shrink-0 items-center justify-center text-klp-fg-default [&>svg]:h-[14px] [&>svg]:w-[14px]'
)

// ---------------------------------------------------------------------------
// content layer — collapsible panel containing ActionSheet items
// cornerRadius: 8px → rounded-klp-l (token gap resolved per spec.tokenGaps)
// fill: bg-klp-bg-default
// padding: p-klp-size-xs
// ---------------------------------------------------------------------------
const contentVariants = cva(
  'flex flex-col rounded-klp-l bg-klp-bg-default p-klp-size-xs'
)

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------
export type ItemSideBarState   = 'rest' | 'hover' | 'active'
export type ItemSideBarFeature = 'collapsible' | 'static'

export interface ItemSideBarProps {
  /** Interaction state — drives trigger fill and icon-container border.
   * Represents the currently-selected navigation item.
   *
   * @propClass persistent
   */
  state?: ItemSideBarState
  /** Feature mode — collapsible adds chevron + expandable content panel
   * @propClass optional
   */
  feature?: ItemSideBarFeature
  /** Icon to render inside the decorative icon box. Defaults to FolderOpen.
   * @propClass optional
   */
  icon?: React.ReactNode
  /** Item label text
   * @propClass required
   */
  label?: React.ReactNode
  /**
   * Content rows rendered inside the expanded panel.
   * Pass one or more <ActionSheetItem> elements (or any ReactNode).
   *
   * @propClass optional
   */
  children?: React.ReactNode
  /** Whether the collapsible panel is open (controlled)
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
  /** Forwarded to the trigger button
   * @propClass optional
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  /**
   * @propClass optional
   */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const ItemSideBar = React.forwardRef<HTMLDivElement, ItemSideBarProps>(
  (
    {
      state = 'rest',
      feature = 'collapsible',
      icon,
      label = 'Label',
      children,
      open,
      defaultOpen,
      onOpenChange,
      onClick,
      className,
    },
    ref
  ) => {
    const isCollapsible = feature === 'collapsible'
    const isActive = state === 'active'

    const iconNode = icon ?? <FolderOpen aria-hidden="true" strokeWidth={1.5} />

    if (!isCollapsible) {
      // Static variant: plain button row, no Collapsible primitive
      return (
        <div ref={ref} className={cn(rootVariants(), className)}>
          <button
            type="button"
            onClick={onClick}
            className={triggerVariants({ state, feature })}
          >
            <span className={iconContainerVariants({ state })}>
              <span className={decorativeIconVariants()}>
                <span className={iconVariants()} aria-hidden="true">
                  {iconNode}
                </span>
              </span>
            </span>
            <span className={labelVariants()}>{label}</span>
          </button>
        </div>
      )
    }

    // Collapsible variant: Radix Collapsible.Root + Trigger + Content
    return (
      <Collapsible.Root
        ref={ref}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        className={cn(rootVariants(), className)}
      >
        <Collapsible.Trigger asChild>
          <button
            type="button"
            onClick={onClick}
            className={triggerVariants({ state, feature })}
          >
            <span className={iconContainerVariants({ state })}>
              <span className={decorativeIconVariants()}>
                <span className={iconVariants()} aria-hidden="true">
                  {iconNode}
                </span>
              </span>
            </span>
            <span className={labelVariants()}>{label}</span>
            <span className={chevronVariants()} aria-hidden="true">
              {isActive ? (
                <ChevronDown strokeWidth={1.5} />
              ) : (
                <ChevronRight strokeWidth={1.5} />
              )}
            </span>
          </button>
        </Collapsible.Trigger>

        <Collapsible.Content>
          <div className={contentVariants()}>
            {children}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    )
  }
)
ItemSideBar.displayName = 'ItemSideBar'

export {
  rootVariants,
  triggerVariants,
  iconContainerVariants,
  decorativeIconVariants,
  iconVariants,
  labelVariants,
  chevronVariants,
  contentVariants,
}

// Re-export ActionSheetItem so consumers can use it directly as content children
export { ActionSheetItem }
