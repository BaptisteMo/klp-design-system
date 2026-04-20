import * as React from 'react'
import { cva } from 'class-variance-authority'
import { Check, Search, PenLine, FolderPlus, FilePlus } from 'lucide-react'
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

export type HeaderDesktopFeatures = 'default' | 'search-active'

export interface HeaderDesktopProps extends React.HTMLAttributes<HTMLElement> {
  /** Feature variant controlling which action row is shown */
  features?: HeaderDesktopFeatures
  /** Page title text */
  title?: string
  /** Breadcrumb steps array — forwarded to BreadCrumbs */
  breadcrumbSteps?: BreadCrumbStep[]
  /** Callback when a tertiary icon button is clicked (receives icon name) */
  onActionClick?: (action: 'check' | 'search' | 'pen-line' | 'folder-plus') => void
  /** Callback when the secondary "New" button is clicked */
  onNewClick?: () => void
  /** Callback on search input change (search-active variant) */
  onSearchChange?: (value: string) => void
  /** Placeholder text for the search input */
  searchPlaceholder?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const HeaderDesktop = React.forwardRef<HTMLElement, HeaderDesktopProps>(
  (
    {
      className,
      features = 'default',
      title = 'Page title',
      breadcrumbSteps,
      onActionClick,
      onNewClick,
      onSearchChange,
      searchPlaceholder = 'Search…',
      ...props
    },
    ref
  ) => {
    const defaultSteps: BreadCrumbStep[] = breadcrumbSteps ?? [
      { label: 'Home' },
      { label: 'Current page' },
    ]

    return (
      <header
        ref={ref}
        role="banner"
        className={cn(rootVariants({ features }), className)}
        {...props}
      >
        {/* title-action-row layer */}
        <div className={titleActionRowVariants({ features })}>
          {/* title layer */}
          <h1 className={titleVariants({ features })}>{title}</h1>

          {/* actions layer — Default variant: 4 tertiary icon buttons + 1 secondary button */}
          <div className={actionsVariants({ features })} aria-label="Page actions">
            <Button
              variant="tertiary"
              size="icon"
              aria-label="Check"
              onClick={() => onActionClick?.('check')}
            >
              <Check className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
            </Button>
            <Button
              variant="tertiary"
              size="icon"
              aria-label="Search"
              onClick={() => onActionClick?.('search')}
            >
              <Search className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
            </Button>
            <Button
              variant="tertiary"
              size="icon"
              aria-label="Edit"
              onClick={() => onActionClick?.('pen-line')}
            >
              <PenLine className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
            </Button>
            <Button
              variant="tertiary"
              size="icon"
              aria-label="New folder"
              onClick={() => onActionClick?.('folder-plus')}
            >
              <FolderPlus className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
            </Button>
            <Button
              variant="secondary"
              size="md"
              rightIcon={<FilePlus className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />}
              onClick={onNewClick}
            >
              New
            </Button>
          </div>

          {/* search-input layer — Search active variant only */}
          <div className={searchInputVariants({ features })}>
            <Input
              size="small"
              state="default"
              type="search"
              placeholder={searchPlaceholder}
              iconLeft={<Search className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>

        {/* breadcrumbs layer */}
        <BreadCrumbs steps={defaultSteps} showDropdownAffordance />
      </header>
    )
  }
)
HeaderDesktop.displayName = 'HeaderDesktop'

export { rootVariants, titleActionRowVariants, titleVariants, actionsVariants, searchInputVariants }
