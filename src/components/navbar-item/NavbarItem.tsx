import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Atlas application sidebar rail item — 70x52 vertical stack (icon over
// label), three interaction states differing ONLY on the root surface:
//   default  → no fill, no stroke
//   hover    → white-10% surface (--klp-alpha-10)
//   selected → 3px right-edge border, INSIDE-aligned (--klp-border-light)
// Icon colour, label colour, and typography are identical across all three
// states, so only rootVariants branches on `state` — icon/label classes are
// flat constants (per-layer discipline: never assign a state-varying token to
// a layer whose Figma binding is itself state-invariant).
// ---------------------------------------------------------------------------

// Root layer — 70x52, centred both axes, 4px vertical padding, 4px gap
// between icon and label, no horizontal padding, no radius.
const rootVariants = cva(
  'inline-flex h-[52px] w-[70px] flex-col items-center justify-center gap-klp-size-4xs pt-klp-size-4xs pb-klp-size-4xs rounded-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klp-border-brand-emphasis',
  {
    variants: {
      state: {
        default: '',
        hover: 'bg-klp-alpha-10',
        selected: 'border-r-[3px] border-klp-border-light',
      },
    },
    defaultVariants: { state: 'default' },
  }
)

// Icon layer — 70x24 box, 2px inset padding around a 20px icon box; colour
// identical across all three states.
const iconClasses =
  'inline-flex h-[24px] w-[70px] shrink-0 items-center justify-center p-klp-size-4xs text-klp-fg-on-emphasis [&>svg]:h-[20px] [&>svg]:w-[20px]'

// Label layer — 70x16, centred single line; colour + type identical across
// all three states.
const labelClasses =
  'w-[70px] text-center text-klp-text-smaller font-klp-label leading-[16px] text-klp-fg-on-emphasis'

export type NavbarItemState = 'default' | 'hover' | 'selected'

export interface NavbarItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof rootVariants> {
  /**
   * When set, the item renders as an `<a href>` instead of a `<button>` — the
   * common case for real navigation.
   *
   * This deliberately does NOT use Radix's `asChild`/Slot: Slot clones the
   * consumer's element and keeps *its* children, which would silently discard
   * this component's own icon and label. Slot also requires exactly one child,
   * so handing it this component's internal structure throws
   * `React.Children.only`.
   * @propClass optional
   */
  href?: string
  /**
   * Explicit visual state override. When omitted, the root derives its
   * surface from real CSS `:hover` (genuine pointer interaction) and falls
   * back to "default" otherwise. Pass this to force any of the three states
   * statically — used by the playground variant grid and docs.
   *
   * @propClass computed
   * @derivedFrom hover (CSS pseudo-class)
   */
  state?: NavbarItemState
  /**
   * Marks this item as the current route. Only the parent rail knows the
   * active route, so this is author-supplied. Wins over hover styling
   * (including a real pointer hover) and over an explicit `state` override.
   * Sets `aria-current="page"`.
   * @propClass optional
   */
  selected?: boolean
  /**
   * Icon slot — pass a lucide-react icon element. Colour flows through
   * `currentColor` via the wrapping span's `text-klp-fg-on-emphasis`.
   * @propClass required
   */
  icon: React.ReactNode
  /**
   * Item label text.
   * @propClass required
   */
  children: React.ReactNode
}

export const NavbarItem = React.forwardRef<HTMLElement, NavbarItemProps>(
  ({ className, state, selected = false, href, icon, children, ...props }, ref) => {
    const Comp = (href ? 'a' : 'button') as React.ElementType

    // `selected` always wins. Otherwise an explicit `state` prop forces a
    // static rendering (playground/docs). With neither, the root falls back
    // to the "default" cva slice plus a real `hover:` pseudo-class so the
    // white-10% surface only ever appears on genuine pointer interaction.
    const resolvedState: NavbarItemState = selected ? 'selected' : (state ?? 'default')
    const isRealHoverEnabled = !selected && state === undefined

    return (
      <Comp
        ref={ref}
        href={href}
        type={href ? undefined : 'button'}
        aria-current={selected ? 'page' : undefined}
        className={cn(
          rootVariants({ state: resolvedState }),
          isRealHoverEnabled && 'hover:bg-klp-alpha-10',
          className
        )}
        {...props}
      >
        <span aria-hidden="true" className={iconClasses}>
          {icon}
        </span>
        <span className={labelClasses}>{children}</span>
      </Comp>
    )
  }
)
NavbarItem.displayName = 'NavbarItem'

export { rootVariants, iconClasses, labelClasses }
