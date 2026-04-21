import { HeaderPhone } from '@/components/header-phone'

/**
 * Example 1 — Full: breadcrumbs + search button + notification.
 */
export function HeaderPhoneFull() {
  return (
    <HeaderPhone
      title="Dashboard"
      hasNotification={true}
      notificationCount={3}
      breadcrumbs={[
        { label: 'Home', onClick: () => {} },
        { label: 'Dashboard' },
      ]}
      onMenuClick={() => {}}
      onNotificationClick={() => {}}
      onSearchClick={() => {}}
    />
  )
}

/**
 * Example 2 — No breadcrumbs, no search button.
 */
export function HeaderPhoneMinimal() {
  return (
    <HeaderPhone
      title="Dashboard"
      hasNotification={false}
      showSearch={false}
    />
  )
}

/**
 * Example 3 — Breadcrumbs only, no search.
 */
export function HeaderPhoneBreadcrumbsOnly() {
  return (
    <HeaderPhone
      title="Turnover Collection"
      showSearch={false}
      breadcrumbs={[{ label: 'Home' }, { label: 'Turnover Collection' }]}
    />
  )
}
