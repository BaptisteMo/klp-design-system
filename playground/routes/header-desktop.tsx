import * as React from 'react'
import { Check, FilePlus, FolderPlus, PenLine, Search } from 'lucide-react'
import { HeaderDesktop } from '@/components/header-desktop'

export function HeaderDesktopRoute() {
  const [searchValue, setSearchValue] = React.useState('')

  return (
    <div className="flex flex-col gap-klp-size-2xl p-klp-size-xl">
      <section>
        <h2 className="text-klp-text-large font-klp-label-bold mb-klp-size-s">default — 4 icon + 1 secondary + breadcrumbs</h2>
        <HeaderDesktop
          title="Turnover Collection"
          actions={[
            { variant: 'tertiary', size: 'icon', children: <Check aria-hidden="true" />, 'aria-label': 'Validate' },
            { variant: 'tertiary', size: 'icon', children: <Search aria-hidden="true" />, 'aria-label': 'Search' },
            { variant: 'tertiary', size: 'icon', children: <PenLine aria-hidden="true" />, 'aria-label': 'Edit' },
            { variant: 'tertiary', size: 'icon', children: <FolderPlus aria-hidden="true" />, 'aria-label': 'New folder' },
            { variant: 'secondary', size: 'md', children: 'New', rightIcon: <FilePlus aria-hidden="true" /> },
          ]}
          breadcrumbs={[{ label: 'Home' }, { label: 'Turnover Collection' }]}
        />
      </section>

      <section>
        <h2 className="text-klp-text-large font-klp-label-bold mb-klp-size-s">default — 1 secondary + 2 tertiary + 1 icon, no breadcrumbs</h2>
        <HeaderDesktop
          title="Custom Mix"
          actions={[
            { variant: 'tertiary', size: 'icon', children: <Search aria-hidden="true" />, 'aria-label': 'Search' },
            { variant: 'tertiary', size: 'md', children: 'Draft' },
            { variant: 'tertiary', size: 'md', children: 'Export' },
            { variant: 'secondary', size: 'md', children: 'New', rightIcon: <FilePlus aria-hidden="true" /> },
          ]}
        />
      </section>

      <section>
        <h2 className="text-klp-text-large font-klp-label-bold mb-klp-size-s">search-active — custom placeholder + breadcrumbs</h2>
        <HeaderDesktop
          features="search-active"
          title="Turnover Collection"
          searchPlaceholder="Input placeholder texte custom"
          breadcrumbs={[{ label: 'Home' }, { label: 'Turnover Collection' }]}
          onSearchChange={setSearchValue}
        />
        <p className="mt-klp-size-xs text-klp-text-small text-klp-fg-muted">current value: {searchValue || <em>(empty)</em>}</p>
      </section>

      <section>
        <h2 className="text-klp-text-large font-klp-label-bold mb-klp-size-s">minimal — title only</h2>
        <HeaderDesktop title="Dashboard" />
      </section>
    </div>
  )
}
