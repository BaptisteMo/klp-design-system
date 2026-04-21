import { Check, FilePlus, PenLine, Search } from 'lucide-react'
import { HeaderDesktop } from './HeaderDesktop'

/**
 * Example 1 — Default mode, mixed actions, breadcrumbs.
 * Demonstrates icon-only tertiary buttons + a secondary label button.
 */
export function HeaderDesktopDefault() {
  return (
    <HeaderDesktop
      title="Turnover Collection"
      actions={[
        { variant: 'tertiary', size: 'icon', children: <Check aria-hidden="true" />, 'aria-label': 'Validate', onClick: () => {} },
        { variant: 'tertiary', size: 'icon', children: <Search aria-hidden="true" />, 'aria-label': 'Search', onClick: () => {} },
        { variant: 'tertiary', size: 'icon', children: <PenLine aria-hidden="true" />, 'aria-label': 'Edit', onClick: () => {} },
        { variant: 'secondary', size: 'md', children: 'New', rightIcon: <FilePlus aria-hidden="true" />, onClick: () => {} },
      ]}
      breadcrumbs={[{ label: 'Home' }, { label: 'Turnover Collection' }]}
    />
  )
}

/**
 * Example 2 — Search-active mode with custom placeholder.
 * Actions are ignored in this mode.
 */
export function HeaderDesktopSearch() {
  return (
    <HeaderDesktop
      features="search-active"
      title="Turnover Collection"
      searchPlaceholder="Input placeholder texte custom"
      breadcrumbs={[{ label: 'Home' }, { label: 'Turnover Collection' }]}
      onSearchChange={(value) => console.log('search:', value)}
    />
  )
}

/**
 * Example 3 — Title-only. No breadcrumbs, no actions.
 */
export function HeaderDesktopMinimal() {
  return <HeaderDesktop title="Dashboard" />
}
