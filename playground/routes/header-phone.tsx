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

      <div className="flex flex-col gap-4">
        {/* Only one variant: default */}
        <div
          data-variant-id="default"
          className="flex items-start justify-start rounded-klp-m border border-klp-border-default p-4"
        >
          <HeaderPhone
            title="Dashboard"
            hasNotification={true}
            notificationCount={1}
            breadcrumbSteps={[
              { label: 'Home', onClick: () => {} },
              { label: 'Dashboard' },
            ]}
            onMenuClick={() => {}}
            onNotificationClick={() => {}}
            onSearchClick={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
