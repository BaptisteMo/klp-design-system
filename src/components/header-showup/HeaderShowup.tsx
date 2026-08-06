import * as React from 'react'
import { cva } from 'class-variance-authority'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/badges'
import { Button } from '@/components/button'
import { NavItem } from '@/components/nav-item'

// ---------------------------------------------------------------------------
// Layer: root
// fill: --klp-bg-brand-contrasted → bg-klp-bg-brand-contrasted
// 80px tall, HORIZONTAL, justify SPACE_BETWEEN, align CENTER, paddingX 40,
// gap 24. The 1440px canvas sample is NOT reproduced — the header fills its
// container (w-full) instead of a fixed width.
// stroke is an unbound literal (same hue as fill @ 40% opacity, no
// boundVariables entry) — intentionally not reproduced as a real border since
// it carries no token.
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'flex w-full flex-row items-center justify-between gap-[24px] bg-klp-bg-brand-contrasted px-[40px] py-0 h-[80px]'
)

// ---------------------------------------------------------------------------
// Layer: zone-logo
// HORIZONTAL flex, gap 8, paddingY 6, align MIN/CENTER, grow-1 (FILL along
// main axis).
// ---------------------------------------------------------------------------
const zoneLogoVariants = cva(
  'flex flex-1 flex-row items-center justify-start gap-[8px] py-[6px]'
)

// ---------------------------------------------------------------------------
// Layer: logo-mark (consumer-provided slot — see gaps: new-primitive)
// 96x21 white wordmark in Figma. No klp equivalent — default renders a plain
// text wordmark, never inline SVG.
// ---------------------------------------------------------------------------
const logoMarkVariants = cva(
  'inline-flex h-[21px] items-center font-klp-title text-klp-text-medium tracking-wide text-klp-fg-on-emphasis select-none'
)

// ---------------------------------------------------------------------------
// Layer: zone-items
// HORIZONTAL flex, gap 20, HUG sizing, align MIN/MAX — bottom-aligned so the
// active nav-item's underline sits flush on the header's own bottom edge.
// ---------------------------------------------------------------------------
const zoneItemsVariants = cva(
  'flex flex-row items-end justify-start gap-[20px]'
)

// ---------------------------------------------------------------------------
// Layer: zone-right
// HORIZONTAL flex, gap 16, align MAX/CENTER, grow-1 (FILL along main axis),
// content justified to the end.
// ---------------------------------------------------------------------------
const zoneRightVariants = cva(
  'flex flex-1 flex-row items-center justify-end gap-[16px]'
)

// ---------------------------------------------------------------------------
// Layer: user-avatar (consumer-provided slot — see gaps: new-primitive)
// 32x32 circle (cornerRadius 80), fill+stroke --klp-bg-secondary-brand. The
// initial's colour is an unbound literal in Figma whose value matches the
// root's bg-brand-contrasted; mapped onto that alias rather than kept raw.
// ---------------------------------------------------------------------------
const userAvatarVariants = cva(
  'inline-flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border border-klp-bg-secondary-brand bg-klp-bg-secondary-brand text-[24px] font-medium leading-none text-klp-bg-brand-contrasted'
)

// ---------------------------------------------------------------------------
// Layer: language-selector (consumer-provided slot — see gaps: new-primitive)
// 91x32, stroke + label + trailing icon all resolve to --klp-fg-on-emphasis.
// cornerRadius 8px literal. Flag icon has no lucide equivalent (Flag/
// Netherlands instance) — rendered as a slot-provided node, default omits it.
// ---------------------------------------------------------------------------
const languageSelectorVariants = cva(
  'inline-flex h-[32px] items-center gap-klp-size-2xs rounded-[8px] border border-klp-fg-on-emphasis px-klp-size-xs text-klp-text-small font-bold leading-none text-klp-fg-on-emphasis'
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A single primary navigation entry rendered via the shared `nav-item`
 * component.
 */
export interface HeaderShowupNavItem {
  /** Stable identifier, also used as the React key.
   * @propClass required
   */
  id: string
  /** Item label text.
   * @propClass required
   */
  label: string
  /** Optional leading icon (lucide-react element).
   * @propClass optional
   */
  icon?: React.ReactNode
  /** Optional trailing counter badge content.
   * @propClass optional
   */
  counter?: React.ReactNode
  /** Marks this item as the current page (renders the active underline).
   * @propClass optional
   */
  active?: boolean
  /** When provided, the item renders as an `<a href>` via nav-item's asChild/Slot pattern.
   * @propClass optional
   */
  href?: string
}

export interface HeaderShowupProps extends React.HTMLAttributes<HTMLElement> {
  /** Primary navigation entries rendered in the Items zone.
   * @propClass required
   */
  items: HeaderShowupNavItem[]
  /** Called when a nav item is selected, receiving its id.
   * @propClass optional
   */
  onItemSelect?: (id: string) => void
  /** Brand wordmark slot. Defaults to a plain "SHOWUP" text wordmark
   * (no vector art reproduced).
   * @propClass optional
   */
  logo?: React.ReactNode
  /** Info badge slot rendered beside the logo. Defaults to a Badge
   * (Type=Info, Size=Small, Style=Light).
   * @propClass optional
   */
  badge?: React.ReactNode
  /** Language selector slot. Defaults to a minimal "NL" trigger button.
   * @propClass optional
   */
  languageSelector?: React.ReactNode
  /** User avatar slot. Defaults to a circular initial ("C").
   * @propClass optional
   */
  userSlot?: React.ReactNode
  /** Extra content appended after the Tools button in the Right zone.
   * @propClass optional
   */
  actions?: React.ReactNode
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const HeaderShowup = React.forwardRef<HTMLElement, HeaderShowupProps>(
  (
    {
      className,
      items,
      onItemSelect,
      logo,
      badge,
      languageSelector,
      userSlot,
      actions,
      ...props
    },
    ref
  ) => {
    return (
      <header ref={ref} className={cn(rootVariants(), className)} {...props}>
        {/* zone-logo */}
        <div className={zoneLogoVariants()}>
          {/* logo-mark: new-primitive slot, no klp equivalent */}
          <span className={logoMarkVariants()}>{logo ?? 'SHOWUP'}</span>

          {/* logo-badge: reused DS Badge (Type=Info, Size=Small, Style=Light) */}
          {badge ?? (
            <Badge badgeType="info" size="small" badgeStyle="light">
              Qual
            </Badge>
          )}
        </div>

        {/* zone-items: 5 nav-item instances, bottom-aligned */}
        <nav aria-label="Main" className={zoneItemsVariants()}>
          {items.map((item) => (
            <NavItem
              key={item.id}
              asChild={Boolean(item.href)}
              active={item.active}
              icon={item.icon}
              counter={item.counter}
              onClick={
                onItemSelect
                  ? () => onItemSelect(item.id)
                  : undefined
              }
            >
              {item.href ? (
                <a href={item.href}>{item.label}</a>
              ) : (
                item.label
              )}
            </NavItem>
          ))}
        </nav>

        {/* zone-right — only 3 of 7 Figma children are visible in the master
            instance; the other 4 (search icon, a second Button, a
            bell-with-dot group, a user icon) are dead layers in Figma and are
            intentionally emitted as no markup here. */}
        <div className={zoneRightVariants()}>
          {/* action-tools-button: reused DS Button (variant=tertiary, size=sm) */}
          <Button variant="tertiary" size="sm" rightIcon={<ChevronDown aria-hidden="true" />}>
            Tools
          </Button>

          {actions}

          {/* language-selector: new-primitive slot, no klp equivalent */}
          {languageSelector ?? (
            <button type="button" className={languageSelectorVariants()}>
              NL
              <ChevronDown aria-hidden="true" className="h-[16px] w-[16px]" />
            </button>
          )}

          {/* user-avatar: new-primitive slot, no klp equivalent */}
          {userSlot ?? (
            <button
              type="button"
              aria-label="Account menu"
              className={userAvatarVariants()}
            >
              C
            </button>
          )}
        </div>
      </header>
    )
  }
)
HeaderShowup.displayName = 'HeaderShowup'

export {
  rootVariants as headerShowupRootVariants,
  zoneLogoVariants as headerShowupZoneLogoVariants,
  logoMarkVariants as headerShowupLogoMarkVariants,
  zoneItemsVariants as headerShowupZoneItemsVariants,
  zoneRightVariants as headerShowupZoneRightVariants,
  userAvatarVariants as headerShowupUserAvatarVariants,
  languageSelectorVariants as headerShowupLanguageSelectorVariants,
}
