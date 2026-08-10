import { Boxes, GitBranch, Sparkles } from 'lucide-react'
import { Badge } from '@/components/badges'
import { List } from '@/components/list'
import type { ListItemConfig } from '@/components/list'

type ComponentEntry = {
  slug: string
  label: string
  category: string
  /** Optional left-side icon. Omit to hide. */
  icon?: React.ReactNode
}

const COMPONENTS: ComponentEntry[] = [
  { slug: 'button',            label: 'Button',            category: 'inputs'   },
  { slug: 'checkbox',          label: 'Checkbox',          category: 'inputs'   },
  { slug: 'radio',             label: 'Radio',             category: 'inputs'   },
  { slug: 'switch',            label: 'Switch',            category: 'inputs'   },
  { slug: 'input',             label: 'Input',             category: 'inputs'   },
  { slug: 'input-file',        label: 'Input File',        category: 'inputs'   },
  { slug: 'input-multiselect', label: 'Input Multiselect', category: 'inputs'   },
  { slug: 'file-dropped',      label: 'File Dropped',      category: 'inputs'   },
  { slug: 'text-area',         label: 'Text Area',         category: 'inputs'   },
  { slug: 'calendar-button',   label: 'Calendar Button',   category: 'inputs'   },
  { slug: 'calendar',          label: 'Calendar',          category: 'inputs'   },
  { slug: 'tooltip',           label: 'Tooltip',           category: 'overlays' },
  { slug: 'badges',            label: 'Badge',             category: 'feedback' },
  { slug: 'floating-alert',    label: 'Floating Alert',    category: 'feedback' },
  { slug: 'in-content-alert',  label: 'InContent Alert',   category: 'feedback' },
  { slug: 'breadcrumbs',       label: 'BreadCrumbs',       category: 'navigation' },
  { slug: 'pagination',        label: 'Pagination',        category: 'navigation' },
  { slug: 'tabulations',       label: 'Tabulations',       category: 'navigation' },
  { slug: 'tabulation-cells',  label: 'Tabulation Cells',  category: 'navigation' },
  { slug: 'list',              label: 'List',              category: 'data-display' },
  { slug: 'list-content',      label: 'List Content',      category: 'data-display' },
  { slug: 'table',             label: 'Table',             category: 'data-display' },
  { slug: 'data-table',        label: 'Data Table',        category: 'data-display' },
  { slug: 'collapsible',       label: 'Collapsible',       category: 'data-display' },
  { slug: 'action-sheet-item', label: 'Action Sheet Item', category: 'overlays' },
  { slug: 'action-sheet-menu', label: 'ActionSheet Menu',  category: 'overlays' },
  { slug: 'modal-variation',   label: 'Modal Variation',   category: 'overlays' },
  { slug: 'item-side-bar',     label: 'Item Side Bar',     category: 'navigation' },
  { slug: 'sidebar',           label: 'SideBar',           category: 'navigation' },
  { slug: 'header-desktop',    label: 'Header Desktop',    category: 'navigation' },
  { slug: 'header-phone',      label: 'Header Phone',      category: 'navigation' },
  { slug: 'nav-item',          label: 'Nav Item',          category: 'navigation' },
  { slug: 'navbar-item',       label: 'Navbar Item',       category: 'navigation' },
  { slug: 'sidebar-atlas',     label: 'Sidebar (Atlas)',   category: 'navigation' },
  { slug: 'header-showup',     label: 'Header Showup',     category: 'navigation' },
  { slug: 'separator',         label: 'Separator',         category: 'utilities' },
  { slug: 'cards',             label: 'Card',              category: 'containers' },
  { slug: 'data-field',        label: 'Data Field',        category: 'data-display' },
]

const LATEST: ComponentEntry = {
  slug: 'modal-variation',
  label: 'Modal Variation',
  category: 'overlays',
}

const DEPENDENCIES_MOCK = 3

export function Index() {
  const items: ListItemConfig[] = COMPONENTS.map((c) => ({
    key: c.slug,
    label: c.label,
    sublabel: c.category,
    showActionButton: false,
    showDecorativeIcon: c.icon != null,
    decorativeIcon: c.icon,
    onClick: () => {
      window.location.hash = `#/${c.slug}`
    },
  }))

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-klp-size-xl">
      <header className="flex flex-col gap-klp-size-2xs">
        <h1 className="text-klp-heading-h1 font-klp-title" style={{ fontWeight: 'var(--font-weight-klp-title)' }}>
          Dashboard
        </h1>
        <p className="text-klp-text-medium text-klp-fg-muted">
          Overview of the @klp/ui design system.
        </p>
      </header>

      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 gap-klp-size-m sm:grid-cols-3"
      >
        <KpiCard
          icon={<Boxes strokeWidth={1.5} />}
          label="Components"
          value={COMPONENTS.length.toString()}
          hint="Stable in the registry"
        />
        <KpiCard
          icon={<GitBranch strokeWidth={1.5} />}
          label="Dependencies"
          value={DEPENDENCIES_MOCK.toString()}
          hint="External packages"
        />
        <KpiCard
          icon={<Sparkles strokeWidth={1.5} />}
          label="Latest component"
          value={LATEST.label}
          hint={LATEST.category}
          accent={
            <Badge badgeType="success" size="small" badgeStyle="light">new</Badge>
          }
          onClick={() => {
            window.location.hash = `#/${LATEST.slug}`
          }}
        />
      </section>

      <section className="rounded-klp-l border border-klp-border-default p-klp-size-l">
        <List
          listStyle="default"
          listTitle="Components"
          showButton={false}
          itemSize="medium"
          items={items}
        />
      </section>
    </div>
  )
}

interface KpiCardProps {
  icon: React.ReactNode
  label: string
  value: string
  hint?: string
  accent?: React.ReactNode
  onClick?: () => void
}

function KpiCard({ icon, label, value, hint, accent, onClick }: KpiCardProps) {
  const interactive = typeof onClick === 'function'
  const Tag = interactive ? 'button' : 'div'
  return (
    <Tag
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      className={
        'flex flex-col gap-klp-size-s rounded-klp-l border border-klp-border-default bg-klp-bg-default p-klp-size-l text-left transition-colors' +
        (interactive ? ' hover:bg-klp-bg-subtle cursor-pointer' : '')
      }
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-klp-m bg-klp-bg-brand-low text-klp-fg-secondary-brand-contrasted [&>svg]:h-4.5 [&>svg]:w-4.5">
          {icon}
        </span>
        {accent}
      </div>
      <div className="flex flex-col gap-klp-size-3xs">
        <span className="text-klp-text-small text-klp-fg-muted font-klp-label">
          {label}
        </span>
        <span
          className="text-klp-heading-h2 font-klp-title text-klp-fg-default"
          style={{ fontWeight: 'var(--font-weight-klp-title)' }}
        >
          {value}
        </span>
        {hint && (
          <span className="text-klp-text-small text-klp-fg-muted font-klp-label">
            {hint}
          </span>
        )}
      </div>
    </Tag>
  )
}
