import { HeaderPhone } from '@/components/header-phone'

export function HeaderPhoneExample() {
  return (
    <HeaderPhone
      title="Dashboard"
      hasNotification={true}
      notificationCount={3}
      breadcrumbSteps={[
        { label: 'Home', onClick: () => {} },
        { label: 'Dashboard' },
      ]}
      onMenuClick={() => {}}
      onNotificationClick={() => {}}
      onSearchClick={() => {}}
    />
  )
}
