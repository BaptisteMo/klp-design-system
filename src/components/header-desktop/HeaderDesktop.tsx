import * as React from 'react'
import { cva } from 'class-variance-authority'
import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { BreadCrumbs, type BreadCrumbStep } from '@/components/breadcrumbs'

// ---------------------------------------------------------------------------
// Layer: root
// Vertical flex stack; no fill (transparent); gap literal 4px between rows.
// ---------------------------------------------------------------------------
const rootVariants = cva('flex flex-col gap-[4px]', {
  variants: {
    features: {
      default: '',
      'search-active': '',
    },
  },
  defaultVariants: { features: 'default' },
})

// ---------------------------------------------------------------------------
// Layer: title-action-row
// Horizontal flex row: title left, actions right.
// ---------------------------------------------------------------------------
const titleActionRowVariants = cva('flex flex-row items-center justify-between', {
  variants: {
    features: {
      default: '',
      'search-active': '',
    },
  },
  defaultVariants: { features: 'default' },
})

// ---------------------------------------------------------------------------
// Layer: title
// color: --klp-fg-brand-contrasted → text-klp-fg-brand-contrasted
// fontSize: --klp-font-size-heading-h1 → text-klp-heading-h1
// fontFamily: --klp-font-family-title → font-klp-title
// fontWeight: --klp-font-weight-title → font-klp-title (weight utility)
// lineHeight: 36px (literal)
// ---------------------------------------------------------------------------
const titleVariants = cva(
  'text-klp-fg-brand-contrasted text-klp-heading-h1 font-klp-title font-klp-title leading-[36px]',
  {
    variants: {
      features: {
        default: '',
        'search-active': '',
      },
    },
    defaultVariants: { features: 'default' },
  }
)

// ---------------------------------------------------------------------------
// Layer: actions
// Horizontal row of action buttons. Hidden in search-active variant.
// ---------------------------------------------------------------------------
const actionsVariants = cva('flex flex-row items-center gap-[auto]', {
  variants: {
    features: {
      default: 'flex',
      'search-active': 'hidden',
    },
  },
  defaultVariants: { features: 'default' },
})

// ---------------------------------------------------------------------------
// Layer: search-input
// Visible only in search-active variant. Rendered via Input DS component.
// ---------------------------------------------------------------------------
const searchInputVariants = cva('', {
  variants: {
    features: {
      default: 'hidden',
      'search-active': 'flex',
    },
  },
  defaultVariants: { features: 'default' },
})

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A single action button rendered in the title-action row (default mode).
 * Maps 1:1 to a subset of @/components/button props.
 */
export type HeaderAction = {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'validation'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  /** Label (sm/md/lg) or icon node (size='icon'). */
  children: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onClick?: () => void
  /** Recommended when size='icon' (no visible label). */
  'aria-label'?: string
  /** Stable key for React list rendering. Optional; falls back to array index. */
  key?: string
}

export interface HeaderDesktopProps {
  /**
   * Page title rendered in the title row.
   * @propClass optional
   */
  title?: string

  /**
   * Mode selector. 'default' renders actions; 'search-active' renders a search input.
   * @propClass optional
   */
  features?: 'default' | 'search-active'

  /**
   * Action buttons rendered left-to-right in the title row when features='default'.
   * Ignored when features='search-active'.
   * @propClass optional
   */
  actions?: HeaderAction[]

  /**
   * Breadcrumbs steps. Omit or pass false to hide the breadcrumbs row entirely.
   * @propClass optional
   */
  breadcrumbs?: BreadCrumbStep[] | false

  /**
   * Placeholder for the search input. Only used when features='search-active'.
   * @propClass optional
   */
  searchPlaceholder?: string

  /**
   * Called on every search input change. Only used when features='search-active'.
   * @propClass optional
   */
  onSearchChange?: (value: string) => void

  /**
   * Additional className applied to the root element.
   * @propClass optional
   */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const HeaderDesktop = React.forwardRef<HTMLElement, HeaderDesktopProps>(
  (
    {
      title = 'Page title',
      features = 'default',
      actions,
      breadcrumbs,
      searchPlaceholder = 'Search…',
      onSearchChange,
      className,
    },
    ref
  ) => {
    const showBreadcrumbs = Array.isArray(breadcrumbs) && breadcrumbs.length > 0
    const isSearchActive = features === 'search-active'

    return (
      <header
        ref={ref}
        className={cn(rootVariants({ features }), className)}
      >
        {showBreadcrumbs && (
          <div>
            <BreadCrumbs steps={breadcrumbs as BreadCrumbStep[]} showDropdownAffordance />
          </div>
        )}

        <div className={cn(titleActionRowVariants({ features }))}>
          <h1 className={cn(titleVariants({ features }))}>{title}</h1>

          {isSearchActive ? (
            <div className={cn(searchInputVariants({ features }))}>
              <Input
                iconLeft={<Search aria-hidden="true" />}
                placeholder={searchPlaceholder}
                onChange={(e) => onSearchChange?.(e.target.value)}
                aria-label="Search"
              />
            </div>
          ) : (
            <div className={cn(actionsVariants({ features }))}>
              {(actions ?? []).map((action, i) => {
                const {
                  key,
                  children,
                  variant = 'tertiary',
                  size = 'icon',
                  leftIcon,
                  rightIcon,
                  onClick,
                  'aria-label': ariaLabel,
                } = action
                return (
                  <Button
                    key={key ?? i}
                    variant={variant}
                    size={size}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                    onClick={onClick}
                    aria-label={ariaLabel}
                  >
                    {children}
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      </header>
    )
  }
)
HeaderDesktop.displayName = 'HeaderDesktop'

export { rootVariants, titleActionRowVariants, titleVariants, actionsVariants, searchInputVariants }
