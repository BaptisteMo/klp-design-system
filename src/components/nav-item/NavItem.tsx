import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/badges'

// ---------------------------------------------------------------------------
// NOTE ON TOKENS — this component is NOT tokenized in Figma. Every colour and
// the Arial/Bold 14 type on the source component are hardcoded literals with
// zero bound variables. The mapping below is a deliberate reconciliation onto
// klp aliases, each verified by an exact match between the Figma literal and
// the alias's resolved value (see .klp/figma-refs/nav-item/spec.json notes):
//   text + icon      → --klp-fg-on-emphasis
//   active underline → --klp-border-light
// The Arial/Bold 14 type is intentionally NOT reproduced — this maps onto the
// klp label font utilities instead (see gap report: `label-typography`).
// ---------------------------------------------------------------------------

// Root layer — fixed 80px header height, centers the underlined content box.
// Width intentionally NOT fixed: the Figma 75px is a sample driven by label
// text length, so the root hugs its content instead of hardcoding it.
// The content box is bottom-aligned inside the 80px item, which is what puts
// the active underline flush on the header's bottom edge.
// `group` + `relative` carry the hover overlay declared below.
const rootBaseClasses =
  'group relative inline-flex flex-col items-center justify-end h-[80px] cursor-pointer'

// Hover overlay — a white-10% surface inset 8px from the header's top and
// bottom edges (80 - 2x8 = 64px tall). Absolutely positioned so it neither
// changes the item's size nor shifts the row; `-inset-x-[8px]` extends it past
// the label's own width, which still clears the 20px gap between items.
// No hover state exists in the Figma component set — this comes from a design
// instruction, and is why the alpha-10 alias had to be added (see gaps).
const hoverOverlayClasses =
  'pointer-events-none absolute inset-y-[8px] -inset-x-[8px] rounded-klp-l bg-klp-alpha-10 ' +
  'opacity-0 transition-opacity group-hover:opacity-100'

// Content layer — the only layer that differs between default/active: a
// bottom-only 2px underline, toggled by border color (transparent when
// inactive keeps box geometry stable without introducing a layout shift that
// the Figma spec doesn't otherwise call for).
const contentVariants = cva(
  // Height is the Figma literal (71px inside an 80px item), NOT paddingY. The
  // captured 25/25 padding only holds for a bare 21px text line — with the
  // counter Badge the box grew past the header and pushed the underline out of
  // frame. A fixed height keeps the rule on the bottom edge whatever the
  // content, which is what the design actually expresses.
  // `relative` so this box paints above the absolutely-positioned hover
  // overlay that precedes it — a static sibling would sit underneath it.
  'relative inline-flex h-[71px] flex-row items-center justify-center gap-klp-size-3xs border-b-2',
  {
    variants: {
      state: {
        default: 'border-transparent',
        active: 'border-klp-border-light',
      },
    },
    defaultVariants: { state: 'default' },
  }
)

// Label layer — color + type are identical across both states.
const labelClasses = 'font-klp-label font-klp-label-bold text-klp-text-small leading-[16px] text-klp-fg-on-emphasis'

// Icon layer — color identical across both states; size is a literal 14px.
const iconClasses = 'inline-flex shrink-0 items-center justify-center text-klp-fg-on-emphasis [&>svg]:h-[14px] [&>svg]:w-[14px]'

export type NavItemState = 'default' | 'active'

export interface NavItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof contentVariants> {
  /**
   * When set, the item renders as an `<a href>` instead of a `<button>` — the
   * common case for a navigation entry.
   *
   * This deliberately does NOT use Radix's `asChild`/Slot: Slot clones the
   * consumer's element and keeps *its* children, which would silently discard
   * this component's own icon, label and overlay. Slot also requires exactly
   * one child, so passing it this component's internal structure throws
   * `React.Children.only`.
   * @propClass optional
   */
  href?: string
  /**
   * Marks this item as the current page. Toggles the bottom underline and
   * sets `aria-current="page"` for assistive tech (the underline alone is
   * not conveyed to screen readers).
   * @propClass optional
   */
  active?: boolean
  /**
   * Optional leading icon (Figma boolean prop `Show Icon selector`). Pass a
   * lucide-react icon element; omit to hide.
   * @propClass optional
   */
  icon?: React.ReactNode
  /**
   * Optional trailing counter badge (Figma boolean prop `HasCounter`). Pass
   * the counter content (e.g. a number); omit to hide. Rendered via the
   * shared Badge component (Type=Primary, Size=Small, Style=Light).
   * @propClass optional
   */
  counter?: React.ReactNode
  /**
   * Nav item label text.
   * @propClass required
   */
  children: React.ReactNode
}

export const NavItem = React.forwardRef<HTMLElement, NavItemProps>(
  ({ className, active = false, href, icon, counter, children, ...props }, ref) => {
    const Comp = (href ? 'a' : 'button') as React.ElementType
    const state: NavItemState = active ? 'active' : 'default'

    return (
      <Comp
        ref={ref}
        href={href}
        type={href ? undefined : 'button'}
        aria-current={active ? 'page' : undefined}
        className={cn(rootBaseClasses, className)}
        {...props}
      >
        <span aria-hidden="true" className={hoverOverlayClasses} />

        <span className={contentVariants({ state })}>
          {icon && (
            <span aria-hidden="true" className={iconClasses}>
              {icon}
            </span>
          )}
          <span className={labelClasses}>{children}</span>
          {counter !== undefined && counter !== null && (
            <Badge badgeType="primary" size="small" badgeStyle="light">
              {counter}
            </Badge>
          )}
        </span>
      </Comp>
    )
  }
)
NavItem.displayName = 'NavItem'

export { rootBaseClasses, hoverOverlayClasses, contentVariants, labelClasses, iconClasses }
