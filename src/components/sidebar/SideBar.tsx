import * as React from 'react'
import { cva } from 'class-variance-authority'
import { Bell, X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'
import { ItemSideBar } from '@/components/item-side-bar'
import { SIDEBAR_MENU } from './menu'

// ---------------------------------------------------------------------------
// root layer
// fill: bg-klp-bg-default
// stroke: border-klp-border-default (right edge — implemented as border-r)
// paddingX: 16px (literal) → p-[16px] but spec uses identical X and Y so p-[16px]
// paddingY: 16px (literal)
// itemSpacing: 8px (literal) → gap-[8px] (horizontal gap between content and border edge — not applicable for flex-col)
// desktop: w-[247px] h-[640px]
// phone:   w-[320px] h-[568px]
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'flex flex-col bg-klp-bg-default border border-klp-border-default overflow-hidden',
  {
    variants: {
      device: {
        desktop: 'w-[247px] max-h-[640px]',
        phone:   'w-[320px] max-h-[568px]',
      },
    },
    defaultVariants: { device: 'desktop' },
  }
)

// ---------------------------------------------------------------------------
// content layer
// fill: none (transparent)
// itemSpacing: 24px (literal) → gap-[24px]
// width/height: fill → flex-1
// ---------------------------------------------------------------------------
const contentVariants = cva(
  'flex flex-1 flex-col min-h-0'
)

// ---------------------------------------------------------------------------
// header layer
// fill: bg-klp-bg-default
// itemSpacing: 10px (literal) → gap-[10px]
// width: fill → w-full
// ---------------------------------------------------------------------------
const headerVariants = cva(
  'flex flex-col border-b border-klp-border-default gap-[10px] p-[16px] bg-klp-bg-default w-full shrink-0'
)

// ---------------------------------------------------------------------------
// logo-notif layer
// fill: none
// layout: space-between
// height: 40px (literal)
// ---------------------------------------------------------------------------
const logoNotifVariants = cva(
  'flex items-center justify-between h-[40px] w-full'
)

// ---------------------------------------------------------------------------
// logo layer
// fill: none
// width: 123px, height: 40px (literals)
// ---------------------------------------------------------------------------
const logoVariants = cva(
  'flex items-center w-[123px] h-[40px] shrink-0'
)

// ---------------------------------------------------------------------------
// notification-dot layer
// fill: bg-klp-bg-decorative-orange
// width: 8px, height: 8px, borderRadius: 50%, position: absolute (literals)
// Hidden on phone variant
// ---------------------------------------------------------------------------
const notificationDotVariants = cva(
  'absolute top-0 right-0 w-[8px] h-[8px] rounded-full bg-klp-bg-decorative-orange',
  {
    variants: {
      device: {
        desktop: 'block',
        phone:   'hidden',
      },
    },
    defaultVariants: { device: 'desktop' },
  }
)

// ---------------------------------------------------------------------------
// context-switcher layer
// fill: none
// layout: space-between
// height: 44px (literal)
// ---------------------------------------------------------------------------
const contextSwitcherVariants = cva(
  'flex items-center justify-between h-[44px] w-full cursor-pointer'
)

// ---------------------------------------------------------------------------
// context-label layer
// color: text-klp-fg-default
// fontSize: 14px (literal)
// ---------------------------------------------------------------------------
const contextLabelVariants = cva(
  'text-klp-fg-default text-[14px] font-klp-label font-klp-label truncate'
)

// ---------------------------------------------------------------------------
// context-chevron layer
// stroke: text-klp-fg-muted (icon inherits via currentColor)
// icon: chevron-right, size: 16px
// ---------------------------------------------------------------------------
const contextChevronVariants = cva(
  'inline-flex shrink-0 items-center justify-center text-klp-fg-muted [&>svg]:h-[16px] [&>svg]:w-[16px]'
)

// ---------------------------------------------------------------------------
// menu layer
// fill: bg-klp-bg-invisible (transparent)
// itemSpacing: 8px (literal) → gap-[8px]
// paddingBottom: 16px (literal)
// overflow: hidden
// ---------------------------------------------------------------------------
const menuVariants = cva(
  'flex flex-1 flex-col gap-[8px] bg-klp-bg-invisible overflow-y-auto min-h-0 pb-[16px]'
)

// ---------------------------------------------------------------------------
// menu-item layer
// fill: none
// width: fill → w-full
// height: 40px (literal) — ItemSideBar handles its own height
// ---------------------------------------------------------------------------
const menuItemVariants = cva(
  'w-full'
)

// ---------------------------------------------------------------------------
// profil layer
// fill: bg-klp-bg-default
// stroke: border-klp-border-default (top border)
// paddingX: 16px, paddingY: 16px (literals)
// itemSpacing: 8px (literal) → gap-[8px]
// height: 72px (literal)
// ---------------------------------------------------------------------------
const profilVariants = cva(
  'flex items-center gap-[8px] bg-klp-bg-default border-t border-klp-border-default p-[16px] border-t  shrink-0'
)

// ---------------------------------------------------------------------------
// avatar layer
// fill: image (no token binding)
// width: 40px, height: 40px, borderRadius: 50% (literals)
// ---------------------------------------------------------------------------
const avatarVariants = cva(
  'w-[40px] h-[40px] rounded-full shrink-0 overflow-hidden bg-klp-bg-inset'
)

// ---------------------------------------------------------------------------
// user-name layer
// color: text-klp-fg-default
// fontSize: 16px (literal)
// fontWeight: 400 (literal — Regular)
// fontFamily: Inter → font-klp-label
// ---------------------------------------------------------------------------
const userNameVariants = cva(
  'text-klp-fg-default text-[16px] font-klp-label truncate'
)

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------
export type SideBarDevice = 'desktop' | 'phone'

export interface SideBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Desktop or phone layout
   * @propClass optional
   */
  device?: SideBarDevice
  /** Logo node rendered in the header
   * @propClass optional
   */
  logo?: React.ReactNode
  /** Context/location label text
   * @propClass optional
   */
  contextLabel?: string
  /** Called when notification/close button is clicked
   * @propClass optional
   */
  onNotificationClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Called when context-switcher is clicked
   * @propClass optional
   */
  onContextSwitcherClick?: React.MouseEventHandler<HTMLDivElement>
  /** Key of the currently active top-level menu entry. Drives row highlight
   * and auto-expansion of the matching collapsible panel.
   * @propClass persistent
   */
  activeKey?: string
  /** Key of the currently active sub-item. Only honored when its parent
   * matches `activeKey`.
   * @propClass persistent
   */
  activeChildKey?: string
  /** Called when a leaf row is clicked. `parentKey` is set for sub-rows.
   * Parents with children do not fire this — they toggle their panel.
   * @propClass optional
   */
  onNavigate?: (key: string, parentKey?: string) => void
  /** Avatar image node or src string
   * @propClass optional
   */
  avatar?: React.ReactNode
  /** User display name
   * @propClass optional
   */
  userName?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const SideBar = React.forwardRef<HTMLElement, SideBarProps>(
  (
    {
      className,
      device = 'desktop',
      logo,
      contextLabel = 'Shopping Center',
      onNotificationClick,
      onContextSwitcherClick,
      activeKey,
      activeChildKey,
      onNavigate,
      avatar,
      userName = 'User Name',
      ...props
    },
    ref
  ) => {
    const isPhone = device === 'phone'

    return (
      <nav
        ref={ref}
        aria-label="Site navigation"
        className={cn(rootVariants({ device }), className)}
        {...props}
      >
        {/* content */}
        <div className={contentVariants()}>
          {/* header */}
          <div className={headerVariants()}>
            {/* logo-notif row */}
            <div className={logoNotifVariants()}>
              <div className={logoVariants()}>
                {logo ?? (
                  <span className="font-klp-label font-klp-label-bold text-klp-fg-default text-[18px]">
                    KLUB
                  </span>
                )}
              </div>

              {/* notification-button — composed via Button DS component */}
              <div className="relative">
                <Button
                  variant="tertiary"
                  size="icon"
                  aria-label={isPhone ? 'Close navigation' : 'Notifications'}
                  onClick={onNotificationClick}
                >
                  {isPhone ? (
                    <X aria-hidden="true" strokeWidth={1.5} />
                  ) : (
                    <Bell aria-hidden="true" strokeWidth={1.5} />
                  )}
                </Button>
                {/* notification-dot — overlaid on the button; hidden on phone */}
                <span
                  aria-hidden="true"
                  className={notificationDotVariants({ device })}
                />
              </div>
            </div>

            {/* context-switcher row */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Switch context"
              className={contextSwitcherVariants()}
              onClick={onContextSwitcherClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onContextSwitcherClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
                }
              }}
            >
              <span className={contextLabelVariants()}>{contextLabel}</span>
              <span className={contextChevronVariants()}>
                <ChevronRight aria-hidden="true" strokeWidth={1.5} />
              </span>
            </div>
          </div>

          {/* menu */}
          <div className={menuVariants()}>
            {SIDEBAR_MENU.map((item) => {
              const Icon = item.icon
              const isActive = activeKey === item.key
              const hasChildren = !!item.children?.length

              if (!hasChildren) {
                return (
                  <div key={item.key} className={menuItemVariants()}>
                    <ItemSideBar
                      feature="static"
                      state={isActive ? 'active' : 'rest'}
                      icon={<Icon aria-hidden="true" strokeWidth={1.5} />}
                      label={item.label}
                      onClick={() => onNavigate?.(item.key)}
                    />
                  </div>
                )
              }

              return (
                <div key={item.key} className={menuItemVariants()}>
                  <ItemSideBar
                    feature="collapsible"
                    state={isActive ? 'active' : 'rest'}
                    icon={<Icon aria-hidden="true" strokeWidth={1.5} />}
                    label={item.label}
                    defaultOpen={isActive}
                  >
                    {item.children!.map((child) => {
                      const childActive =
                        isActive && activeChildKey === child.key
                      return (
                        <ItemSideBar
                          key={child.key}
                          feature="static"
                          state={childActive ? 'active' : 'rest'}
                          icon={null}
                          label={child.label}
                          className={
                            childActive
                              ? 'bg-klp-bg-default rounded-klp-xl'
                              : undefined
                          }
                          onClick={() => onNavigate?.(child.key, item.key)}
                        />
                      )
                    })}
                  </ItemSideBar>
                </div>
              )
            })}
          </div>
        </div>

        {/* profil footer */}
        <div className={profilVariants()}>
          <div className={avatarVariants()}>
            {typeof avatar === 'string' ? (
              <img src={avatar} alt={typeof userName === 'string' ? userName : 'avatar'} className="w-full h-full object-cover" />
            ) : (
              avatar
            )}
          </div>
          <span className={userNameVariants()}>{userName}</span>
        </div>
      </nav>
    )
  }
)
SideBar.displayName = 'SideBar'

export {
  rootVariants,
  contentVariants,
  headerVariants,
  logoNotifVariants,
  logoVariants,
  notificationDotVariants,
  contextSwitcherVariants,
  contextLabelVariants,
  contextChevronVariants,
  menuVariants,
  menuItemVariants,
  profilVariants,
  avatarVariants,
  userNameVariants,
}
