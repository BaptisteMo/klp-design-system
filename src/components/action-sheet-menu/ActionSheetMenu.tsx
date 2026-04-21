import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { ActionSheetItem } from '@/components/action-sheet-item'
import { Checkbox } from '@/components/checkbox'

// ---------------------------------------------------------------------------
// Composition discipline
//   REUSED: action-sheet-item  → imported from @/components/action-sheet-item
//   REUSED: checkbox           → imported from @/components/checkbox
//   GAP:    Separator          → no klp component registered; inlined as <hr>
//                                (unmatched-instance gap — see registry stub)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// root layer
// fill: --klp-bg-default → bg-klp-bg-default
// cornerRadius: tokenGap resolved to --klp-radius-l → rounded-klp-l (see spec tokenGaps)
// paddingX (all variants): --klp-size-xs → pl-klp-size-xs pr-klp-size-xs
// paddingY (all variants): --klp-size-xs → pt-klp-size-xs pb-klp-size-xs
// checkbox-default also has itemSpacing: --klp-size-xs → gap-klp-size-xs
// minWidth: literal from spec
// ---------------------------------------------------------------------------
const rootVariants = cva(
  [
    'flex flex-col bg-klp-bg-default rounded-klp-l overflow-hidden',
    'pl-klp-size-xs pr-klp-size-xs pt-klp-size-xs pb-klp-size-xs',
  ].join(' '),
  {
    variants: {
      type: {
        default:  'min-w-[251px] shadow-[0_0_1px_0_rgba(0,0,0,0.40),0_0_1.5px_0_rgba(0,0,0,0.30),0_7px_22px_0_rgba(0,0,0,0.25)]',
        checkbox: 'min-w-[249px] gap-klp-size-xs',
        flat:     'min-w-[251px]',
      },
    },
    defaultVariants: { type: 'default' },
  }
)

// ---------------------------------------------------------------------------
// section layer
// Vertical stack, gap: 0 (literal)
// No token bindings — layout only
// ---------------------------------------------------------------------------
const sectionVariants = cva('flex flex-col gap-0')

// ---------------------------------------------------------------------------
// title layer
// color: --klp-fg-muted → text-klp-fg-muted
// fontSize: --klp-font-size-text-small → text-klp-text-small
// fontFamily: --klp-font-family-label → font-klp-label
// fontWeight: --klp-font-weight-label-bold → font-klp-label-bold
// flat variant: display none (literal)
// ---------------------------------------------------------------------------
const titleVariants = cva(
  'text-klp-fg-muted text-klp-text-small font-klp-label font-klp-label-bold',
  {
    variants: {
      type: {
        default:  'block px-klp-size-m py-klp-size-xs',
        checkbox: 'block px-klp-size-m py-klp-size-xs',
        flat:     'hidden',
      },
    },
    defaultVariants: { type: 'default' },
  }
)

// ---------------------------------------------------------------------------
// separator layer
// default / flat variants (INSTANCE of Separator component):
//   paddingY: --klp-size-m → pt-klp-size-m pb-klp-size-m on a wrapper
//   stroke: --klp-border-default → border-klp-border-default
// checkbox variant (direct rectangle):
//   fill: --klp-border-default → bg-klp-border-default
//   height: 1px (literal)
// ---------------------------------------------------------------------------
const separatorVariants = cva('', {
  variants: {
    type: {
      default:  'pt-klp-size-m pb-klp-size-m',
      checkbox: '',
      flat:     'pt-klp-size-m pb-klp-size-m',
    },
  },
  defaultVariants: { type: 'default' },
})

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------
export type ActionSheetMenuType = 'default' | 'checkbox' | 'flat'

export interface ActionSheetMenuSection {
  /** Section header text — hidden in flat type */
  title?: string
  /** Item rows for action-sheet-item (default/flat) or checkbox (checkbox type) */
  items: ActionSheetMenuItemDef[]
}

export interface ActionSheetMenuItemDef {
  /** Unique key for the item */
  id: string
  /** Primary label text */
  label: string
  /** Optional description for action-sheet-item */
  description?: string
  /** Optional left icon (action-sheet-item only) */
  leftIcon?: React.ReactNode
  /** Optional right icon/action (action-sheet-item only) */
  rightIcon?: React.ReactNode
  /** Semantic state for action-sheet-item */
  state?: 'default' | 'hover' | 'active' | 'emphased' | 'disabled' | 'destructive' | 'creation'
  /** Checkbox checked state (checkbox type only) */
  checked?: boolean | 'indeterminate'
  /** Click / change handler */
  onSelect?: () => void
  /** Checkbox change handler (checkbox type only) */
  onCheckedChange?: (checked: boolean | 'indeterminate') => void
}

export interface ActionSheetMenuProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof rootVariants> {
  /**
   * @propClass required
   */
  sections: ActionSheetMenuSection[]
  /**
   * @propClass optional
   */
  type?: ActionSheetMenuType
}

// ---------------------------------------------------------------------------
// Separator sub-component (unmatched-instance: no registered klp Separator)
// default/flat: wrapper with paddingY + inner <hr> with border token
// checkbox: solid 1px rectangle using bg token
// ---------------------------------------------------------------------------
function ActionSheetSeparator({ type }: { type: ActionSheetMenuType }) {
  if (type === 'checkbox') {
    // direct rectangle separator — fill: --klp-border-default, height: 1px (literal)
    return <div aria-hidden="true" className="h-[1px] bg-klp-border-default" />
  }
  // Separator INSTANCE (inlined): wrapper carries paddingY, hr carries border
  return (
    <div aria-hidden="true" className={cn(separatorVariants({ type }))}>
      <hr className="border-0 border-t border-klp-border-default" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export const ActionSheetMenu = React.forwardRef<HTMLDivElement, ActionSheetMenuProps>(
  ({ className, type = 'default', sections, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="menu"
        aria-label="Action sheet menu"
        className={cn(rootVariants({ type }), className)}
        {...props}
      >
        {sections.map((section, sectionIdx) => (
          <React.Fragment key={sectionIdx}>
            {sectionIdx > 0 && <ActionSheetSeparator type={type} />}

            <div className={sectionVariants()}>
              {section.title && (
                <span className={titleVariants({ type })}>
                  {section.title}
                </span>
              )}

              {type === 'checkbox'
                ? section.items.map((item) => (
                    // item layer (checkbox variant):
                    // fill: --klp-bg-default → bg-klp-bg-default
                    // stroke: --klp-border-default → border border-klp-border-default
                    // cornerRadius: --klp-radius-m → rounded-klp-m
                    // paddingX: --klp-size-m → pl-klp-size-m pr-klp-size-m
                    // paddingY: --klp-size-xs → pt-klp-size-xs pb-klp-size-xs
                    // itemSpacing: --klp-size-m → gap-klp-size-m
                    // htmlFor wires the label to Radix Checkbox's internal <button>
                    // so clicks on the text toggle the checkbox.
                    <label
                      key={item.id}
                      htmlFor={`${item.id}-checkbox`}
                      className={cn(
                        'flex cursor-pointer items-center',
                        'bg-klp-bg-default  rounded-klp-m',
                        'pl-klp-size-m pr-klp-size-m pt-klp-size-xs pb-klp-size-xs',
                        'gap-klp-size-m',
                      )}
                    >
                      <Checkbox
                        id={`${item.id}-checkbox`}
                        checked={item.checked}
                        onCheckedChange={item.onCheckedChange}
                        aria-label={item.label}
                      />
                      <span
                        role="menuitemcheckbox"
                        aria-checked={item.checked === true ? true : item.checked === 'indeterminate' ? 'mixed' : false}
                        className="text-klp-text-small font-klp-label text-klp-fg-default flex-1"
                      >
                        {item.label}
                      </span>
                    </label>
                  ))
                : section.items.map((item) => (
                    // item layer (default/flat variants):
                    // fill: --klp-bg-invisible → bg-klp-bg-invisible (transparent)
                    // stroke: --klp-border-invisible → border-klp-border-invisible (transparent)
                    // cornerRadius: tokenGap resolved → rounded-klp-m (see spec tokenGaps)
                    // paddingX: --klp-size-m → pl-klp-size-m pr-klp-size-m
                    // paddingY: --klp-size-m → pt-klp-size-m pb-klp-size-m
                    // itemSpacing: --klp-size-s → gap-klp-size-s
                    // REUSED: ActionSheetItem klp component
                    <ActionSheetItem
                      key={item.id}
                      role="menuitem"
                      state={item.state ?? 'default'}
                      size="md"
                      firstIcon={item.leftIcon}
                      secondAction={item.rightIcon}
                      description={item.description}
                      onClick={item.onSelect}
                      className="rounded-klp-m"
                    >
                      {item.label}
                    </ActionSheetItem>
                  ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    )
  }
)
ActionSheetMenu.displayName = 'ActionSheetMenu'

// ---------------------------------------------------------------------------
// Popover-wrapped convenience exports (Root, Trigger, Content)
// Uses @radix-ui/react-popover for positioning + a11y
// ---------------------------------------------------------------------------
const ActionSheetMenuRoot = Popover.Root
const ActionSheetMenuTrigger = Popover.Trigger
const ActionSheetMenuPortal = Popover.Portal
const ActionSheetMenuAnchor = Popover.Anchor

// ActionSheetMenuContentProps inherits sections (required) and type (optional) from ActionSheetMenuProps.
// Only those inline props are annotated; Omit<Popover.Content, 'children'> props are native Radix props.
export interface ActionSheetMenuContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Popover.Content>, 'children'>,
    ActionSheetMenuProps {}

const ActionSheetMenuContent = React.forwardRef<
  React.ElementRef<typeof Popover.Content>,
  ActionSheetMenuContentProps
>(({ className, type, sections, sideOffset = 4, ...props }, ref) => (
  <Popover.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn('z-50 shadow-md outline-none', className)}
    {...props}
  >
    <ActionSheetMenu type={type} sections={sections} />
  </Popover.Content>
))
ActionSheetMenuContent.displayName = 'ActionSheetMenuContent'

export {
  rootVariants,
  sectionVariants,
  titleVariants,
  separatorVariants,
  ActionSheetMenuRoot,
  ActionSheetMenuTrigger,
  ActionSheetMenuPortal,
  ActionSheetMenuAnchor,
  ActionSheetMenuContent,
  ActionSheetSeparator,
}
