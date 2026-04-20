import { HeaderDesktop } from '@/components/header-desktop'

export default function HeaderDesktopExample() {
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Default — icon buttons + secondary action */}
      <HeaderDesktop
        features="default"
        title="My Page"
        breadcrumbSteps={[
          { label: 'Home' },
          { label: 'My Page' },
        ]}
        onNewClick={() => console.log('new')}
        onActionClick={(a) => console.log(a)}
      />

      {/* Search active — search input replaces action row */}
      <HeaderDesktop
        features="search-active"
        title="My Page"
        breadcrumbSteps={[
          { label: 'Home' },
          { label: 'My Page' },
        ]}
        searchPlaceholder="Search items…"
        onSearchChange={(v) => console.log(v)}
      />
    </div>
  )
}
