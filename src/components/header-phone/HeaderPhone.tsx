import * as React from 'react'
import { cva } from 'class-variance-authority'
import { Menu, Bell, Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'
import { BreadCrumbs, type BreadCrumbStep } from '@/components/breadcrumbs'

// ---------------------------------------------------------------------------
// Layer: root
// Fill: rgba(255,255,255,0.9) — literal gap (no --klp-* alias, see tokenGaps).
// backdrop-filter: blur(8px) — literal.
// stroke: --klp-border-default → border-klp-border-default
// padding: 24px top, 16px bottom, 16px left/right — literals
// itemSpacing: 8px — literal
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'flex flex-col w-[320px] bg-white/90 backdrop-blur-sm border-b border-klp-border-default pt-[24px] pb-[16px] px-[16px] gap-[8px]'
)

// ---------------------------------------------------------------------------
// Layer: content
// Full-width vertical container, gap 8px
// ---------------------------------------------------------------------------
const contentVariants = cva('flex flex-col w-full gap-[8px]')

// ---------------------------------------------------------------------------
// Layer: top-bar
// Horizontal row, space-between, centered, height 36px
// ---------------------------------------------------------------------------
const topBarVariants = cva(
  'flex flex-row items-center justify-between h-[36px]'
)

// ---------------------------------------------------------------------------
// Layer: notification-button
// Relative wrapper for bell button + dot; 36×36px
// ---------------------------------------------------------------------------
const notificationButtonVariants = cva('relative flex h-[36px] w-[36px]')

// ---------------------------------------------------------------------------
// Layer: notification-dot
// fill: --klp-bg-decorative-orange → bg-klp-bg-decorative-orange
// size: 6×6px; border-radius: full; position: absolute top-[4px] right-[4px]
// ---------------------------------------------------------------------------
const notificationDotVariants = cva(
  'absolute top-[4px] right-[4px] h-[6px] w-[6px] rounded-full bg-klp-bg-decorative-orange pointer-events-none'
)

// ---------------------------------------------------------------------------
// Layer: logo
// color: --klp-fg-brand-contrasted → text-klp-fg-brand-contrasted
// size: 28×28px
// The Klub! brand logo is not a lucide icon and has no DS component.
// Rendered as a styled placeholder <span> — gap reported below.
// ---------------------------------------------------------------------------
const logoVariants = cva(
  'inline-flex items-center justify-center h-[28px] w-[28px] text-klp-fg-brand-contrasted'
)

// ---------------------------------------------------------------------------
// Layer: title-bar
// Horizontal row, space-between, centered, height 36px
// ---------------------------------------------------------------------------
const titleBarVariants = cva(
  'flex flex-row items-center justify-between h-[36px]'
)

// ---------------------------------------------------------------------------
// Layer: title
// color: --klp-fg-brand-contrasted → text-klp-fg-brand-contrasted
// fontSize: --klp-font-size-heading-h1 → text-klp-heading-h1
// fontFamily: --klp-font-family-title → font-klp-title
// fontWeight: --klp-font-weight-title → font-klp-title (weight via CSS var)
// lineHeight: 36px — literal
// ---------------------------------------------------------------------------
const titleVariants = cva(
  'text-klp-fg-brand-contrasted text-klp-heading-h1 font-klp-title leading-[36px]',
  {
    variants: {},
  }
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface HeaderPhoneProps extends React.HTMLAttributes<HTMLElement> {
  /** Page title rendered in the title bar
   * @propClass optional
   */
  title?: string
  /** Whether to show the notification dot on the bell button
   * @propClass optional
   */
  hasNotification?: boolean
  /** Unread count label for the notification button (for screen readers)
   * @propClass optional
   */
  notificationCount?: number
  /** Breadcrumb steps passed to BreadCrumbs
   * @propClass optional
   */
  breadcrumbSteps?: BreadCrumbStep[]
  /** Logo slot — accepts any React node (brand asset, img, svg component, etc.)
   * @propClass optional
   */
  logo?: React.ReactNode
  /** Handler for menu button click
   * @propClass optional
   */
  onMenuClick?: () => void
  /** Handler for notification button click
   * @propClass optional
   */
  onNotificationClick?: () => void
  /** Handler for search button click
   * @propClass optional
   */
  onSearchClick?: () => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const HeaderPhone = React.forwardRef<HTMLElement, HeaderPhoneProps>(
  (
    {
      className,
      title = 'Page Title',
      hasNotification = true,
      notificationCount = 1,
      breadcrumbSteps = [
        { label: 'Home' },
        { label: 'Section' },
      ],
      logo,
      onMenuClick,
      onNotificationClick,
      onSearchClick,
      ...props
    },
    ref
  ) => {
    const notificationAriaLabel = hasNotification
      ? `Notifications, ${notificationCount} unread`
      : 'Notifications'

    return (
      <header
        ref={ref}
        role="banner"
        className={cn(rootVariants(), className)}
        {...props}
      >
        {/* content */}
        <div className={contentVariants()}>
          {/* top-bar */}
          <div className={topBarVariants()}>
            {/* menu-button: Button/Tertiary/Icon/Rest */}
            <Button
              variant="tertiary"
              size="icon"
              aria-label="Open menu"
              onClick={onMenuClick}
            >
              <Menu className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
            </Button>

            {/* logo: brand-logo candidate — no DS component, inlined */}
            <div className={logoVariants()}>
              {logo ?? (
                <span
                  aria-label="Brand logo"
                  className="flex items-center justify-center h-[28px] w-[28px] font-klp-title font-klp-title text-klp-fg-brand-contrasted text-klp-text-small"
                >
                  K!
                </span>
              )}
            </div>

            {/* notification-button wrapper */}
            <div className={notificationButtonVariants()}>
              {/* notification-btn: Button/Tertiary/Icon/Rest */}
              <Button
                variant="tertiary"
                size="icon"
                aria-label={notificationAriaLabel}
                onClick={onNotificationClick}
              >
                <Bell className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
              </Button>

              {/* notification-dot */}
              {hasNotification && (
                <span
                  aria-hidden="true"
                  className={notificationDotVariants()}
                />
              )}
            </div>
          </div>

          {/* title-bar */}
          <div className={titleBarVariants()}>
            <h1 className={titleVariants()}>{title}</h1>

            {/* search-button: Button/Tertiary/Icon/Rest */}
            <Button
              variant="tertiary"
              size="icon"
              aria-label="Search"
              onClick={onSearchClick}
            >
              <Search className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* breadcrumbs: BreadCrumbs/Steps=1 */}
        <BreadCrumbs steps={breadcrumbSteps} stepsVariant="1" />
      </header>
    )
  }
)
HeaderPhone.displayName = 'HeaderPhone'

export {
  rootVariants as headerPhoneRootVariants,
  contentVariants as headerPhoneContentVariants,
  topBarVariants as headerPhoneTopBarVariants,
  notificationButtonVariants as headerPhoneNotificationButtonVariants,
  notificationDotVariants as headerPhoneNotificationDotVariants,
  logoVariants as headerPhoneLogoVariants,
  titleBarVariants as headerPhoneTitleBarVariants,
  titleVariants as headerPhoneTitleVariants,
}
