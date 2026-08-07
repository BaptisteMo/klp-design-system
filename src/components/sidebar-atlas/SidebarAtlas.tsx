import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { NavbarItem, type NavbarItemState } from '@/components/navbar-item'

// ---------------------------------------------------------------------------
// Layer: root
// Plain COMPONENT in Figma — no variant axis, states live one level down
// inside each navbar-item instance. 70px-wide vertical flex stack
// (flex-col items-center justify-start), paddingTop/Bottom 24px, gap 16px
// between every child (logo-to-first-item and item-to-item alike). No
// intermediate items-wrapper frame — logo and all navbar-item instances are
// direct children of root, in document order.
// The 800px height in Figma is a canvas sample only — the rail fills its
// container's height (h-full), never a fixed 800px.
// fill: --klp-bg-navrail (DS-side alias for an unbound literal, see gaps).
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'flex h-full w-[70px] flex-col items-center justify-start gap-[16px] bg-klp-bg-navrail py-[24px]'
)

// ---------------------------------------------------------------------------
// Layer: logo (consumer-provided slot — see gaps: new-primitive)
// RECTANGLE with an IMAGE fill in Figma (Atlas logo artwork). Image fills
// cannot bind to a Figma variable, so this is not a token gap — but there is
// no klp equivalent component, so it is exposed as a slot defaulting to a
// minimal placeholder mark (never inline SVG, never a hardcoded asset import).
// ---------------------------------------------------------------------------
const logoVariants = cva(
  'inline-flex h-[51px] w-[48px] shrink-0 items-center justify-center rounded-klp-m bg-klp-alpha-10 text-klp-fg-on-emphasis font-klp-title text-klp-text-small select-none'
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single primary navigation entry rendered via the shared `navbar-item` component. */
export interface SidebarAtlasItem {
  /** Stable identifier, also used as the React key.
   * @propClass required
   */
  id: string
  /** Item label text.
   * @propClass required
   */
  label: string
  /** Icon slot — pass a lucide-react icon element.
   * @propClass required
   */
  icon: React.ReactNode
  /** Marks this item as the current route. Renders navbar-item's right-edge
   * border and sets `aria-current="page"`. Wins over hover and over an
   * explicit `state` override.
   * @propClass optional
   */
  selected?: boolean
  /** When provided, the item renders as an `<a href>` via navbar-item's
   * `href` prop.
   * @propClass optional
   */
  href?: string
  /** Explicit visual state override forwarded to navbar-item — force
   * `default | hover | selected` on a specific item (used by the playground
   * to show all three states at once without a pointer).
   * @propClass optional
   */
  state?: NavbarItemState
}

export interface SidebarAtlasProps extends React.HTMLAttributes<HTMLElement> {
  /** Primary navigation entries rendered as navbar-item instances.
   * @propClass required
   */
  items: SidebarAtlasItem[]
  /** Called when a nav item is selected, receiving its id.
   * @propClass optional
   */
  onItemSelect?: (id: string) => void
  /** Brand logo slot. Defaults to a minimal placeholder mark (no vector art
   * reproduced — the Atlas logo is a Figma IMAGE fill, not a component).
   * @propClass optional
   */
  logo?: React.ReactNode
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const SidebarAtlas = React.forwardRef<HTMLElement, SidebarAtlasProps>(
  ({ className, items, onItemSelect, logo, ...props }, ref) => {
    return (
      <nav ref={ref} aria-label="Primary" className={cn(rootVariants(), className)} {...props}>
        {/* logo: new-primitive slot, no klp equivalent */}
        <span aria-hidden="true" className={logoVariants()}>
          {logo ?? 'A'}
        </span>

        {items.map((item) => (
          <NavbarItem
            key={item.id}
            href={item.href}
            icon={item.icon}
            selected={item.selected}
            state={item.state}
            onClick={onItemSelect ? () => onItemSelect(item.id) : undefined}
          >
            {item.label}
          </NavbarItem>
        ))}
      </nav>
    )
  }
)
SidebarAtlas.displayName = 'SidebarAtlas'

export { rootVariants, logoVariants }
