import { useEffect } from 'react'
import { HeaderPhone } from '@/components/header-phone'

const CAPTURE_BRAND = 'klub'

export function HeaderPhoneRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">
        Header Phone — captured in {CAPTURE_BRAND}
      </h1>

      <div className="flex flex-col gap-6">
        <div
          data-variant-id="full"
          className="flex items-start justify-start rounded-klp-m border border-klp-border-default p-4"
        >
          <div>
            <h2 className="mb-2 text-sm font-medium">full — breadcrumbs + search</h2>
            <HeaderPhone
              title="Dashboard"
              hasNotification
              notificationCount={1}
              breadcrumbs={[
                { label: 'Home', onClick: () => {} },
                { label: 'Dashboard' },
              ]}
              onMenuClick={() => {}}
              onNotificationClick={() => {}}
              onSearchClick={() => {}}
            />
          </div>
        </div>

        <div
          data-variant-id="no-search"
          className="flex items-start justify-start rounded-klp-m border border-klp-border-default p-4"
        >
          <div>
            <h2 className="mb-2 text-sm font-medium">no search button, with breadcrumbs</h2>
            <HeaderPhone
              title="Turnover Collection"
              showSearch={false}
              breadcrumbs={[{ label: 'Home' }, { label: 'Turnover Collection' }]}
            />
          </div>
        </div>

        <div
          data-variant-id="minimal"
          className="flex items-start justify-start rounded-klp-m border border-klp-border-default p-4"
        >
          <div>
            <h2 className="mb-2 text-sm font-medium">minimal — no breadcrumbs, no search</h2>
            <HeaderPhone
              title="Dashboard"
              hasNotification={false}
              showSearch={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
