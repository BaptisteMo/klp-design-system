import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import {
  TabulationCell,
  TabulationCellsContent,
  type TabulationCellProps,
} from '@/components/tabulation-cells'

// ---------------------------------------------------------------------------
// rootVariants — derived from spec.variants[0].layers.root
//
// fill:         --klp-bg-subtle       → bg-klp-bg-subtle
// stroke:       --klp-border-default  → border + border-klp-border-default
// cornerRadius: literal 8px           → rounded-[8px]
// paddingAll:   literal 2px           → p-[2px]
// itemSpacing:  literal 4px           → gap-[4px]
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'inline-flex items-stretch rounded-klp-l border border-klp-border-default bg-klp-bg-subtle p-[2px] gap-[4px]',
  {
    variants: {
      scrollType: {
        none: '',
      },
    },
    defaultVariants: { scrollType: 'none' },
  }
)

// ---------------------------------------------------------------------------
// dividerVariants — derived from spec.variants[0].layers.divider
//
// stroke:       --klp-border-default  → border-l border-klp-border-default
// strokeWeight: literal 1px           → border-l (1px)
// length:       literal 24px          → h-[24px]
// ---------------------------------------------------------------------------
const dividerVariants = cva(
  'h-[24px] w-[1px] shrink-0 self-center border-l border-klp-border-default'
)

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------
export interface TabulationsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    VariantProps<typeof rootVariants> {
  /**
   * Each tab item. Provide an array of objects with:
   * - `value`: unique identifier used by Radix Tabs for controlled selection.
   * - `label`: display text rendered inside the cell.
   * - `badge`: optional numeric count shown in the badge pill.
   *
   * @propClass required
   */
  tabs: Array<{
    value: string
    label: React.ReactNode
    badge?: TabulationCellProps['badge']
  }>
}

// ---------------------------------------------------------------------------
// TabulationsCell — bridges Radix Tabs data-state to TabulationCell state prop.
//
// TabulationCell is already a TabsPrimitive.Trigger. Radix injects
// data-state="active"|"inactive" on the trigger element after selection
// changes. We observe that attribute via MutationObserver and map it to the
// `state` prop so TabulationCell's cva variants apply correctly.
// ---------------------------------------------------------------------------
interface TabulationsCellBridgeProps
  extends Omit<TabulationCellProps, 'state'> {}

const TabulationsCellBridge = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabulationsCellBridgeProps
>(({ children, badge, className, ...props }, forwardedRef) => {
  const [state, setState] = React.useState<'rest' | 'active'>('rest')
  const innerRef = React.useRef<HTMLButtonElement>(null)

  // Compose the forwarded ref with our inner ref
  const composedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      (innerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
      }
    },
    [forwardedRef]
  )

  React.useEffect(() => {
    const node = innerRef.current
    if (!node) return

    // Sync initial state
    setState(node.dataset.state === 'active' ? 'active' : 'rest')

    // Observe Radix data-state mutations
    const observer = new MutationObserver(() => {
      setState(node.dataset.state === 'active' ? 'active' : 'rest')
    })
    observer.observe(node, { attributes: true, attributeFilter: ['data-state'] })
    return () => observer.disconnect()
  }, [])

  return (
    <TabulationCell
      ref={composedRef}
      state={state}
      badge={badge}
      className={className}
      {...props}
    >
      {children}
    </TabulationCell>
  )
})
TabulationsCellBridge.displayName = 'TabulationsCellBridge'

// ---------------------------------------------------------------------------
// Tabulations — the outer tab bar container.
//
// Renders a Radix Tabs.Root → Tabs.List (styled as the Figma frame) containing
// TabulationsCellBridge instances separated by vertical divider spans.
// Tab content panels are rendered via TabulationsContent (= Tabs.Content).
// ---------------------------------------------------------------------------
const Tabulations = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabulationsProps
>(({ className, scrollType, tabs, children, ...props }, ref) => {
  return (
    <TabsPrimitive.Root ref={ref} {...props}>
      <TabsPrimitive.List
        className={cn(rootVariants({ scrollType }), className)}
      >
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.value}>
            {index > 0 && (
              <span aria-hidden="true" className={dividerVariants()} />
            )}
            <TabulationsCellBridge value={tab.value} badge={tab.badge}>
              {tab.label}
            </TabulationsCellBridge>
          </React.Fragment>
        ))}
      </TabsPrimitive.List>

      {children}
    </TabsPrimitive.Root>
  )
})
Tabulations.displayName = 'Tabulations'

// ---------------------------------------------------------------------------
// Re-export Tabs.Content for tab panel usage
// ---------------------------------------------------------------------------
const TabulationsContent = TabulationCellsContent
TabulationsContent.displayName = 'TabulationsContent'

export {
  Tabulations,
  TabulationsContent,
  TabulationsCellBridge,
  rootVariants,
  dividerVariants,
}
