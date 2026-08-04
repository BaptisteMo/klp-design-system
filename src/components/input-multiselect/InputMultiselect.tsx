import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { cva } from 'class-variance-authority'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Input } from '@/components/input'
import { Badge } from '@/components/badges'
import { ActionSheetMenu, type ActionSheetMenuSection } from '@/components/action-sheet-menu'

// ---------------------------------------------------------------------------
// Composition discipline
//   REUSED: input             → trigger (label + info-icon + input-box + placeholder)
//   REUSED: badges             → chips (selected values) + overflow "+N" chip
//   REUSED: action-sheet-menu (type="checkbox") → dropdown options panel
//   GAP: chip-remove-icon      → Badge's rightIcon slot is aria-hidden/decorative
//                                 only; wrapped the whole Badge in a native
//                                 <button> to provide the actual remove
//                                 affordance (partial-reuse, see registry stub).
//   GAP: dropdown role         → ActionSheetMenu renders role="menu" internally;
//                                 a true combobox pattern wants a listbox. Not
//                                 overridden (out of scope to edit the shared
//                                 DS component) — see registry stub.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// root layer
// fill: transparent (literal) — no background utility needed (default is transparent)
// itemSpacing: --klp-size-xs (uniform across all 5 captured variants) → gap-klp-size-xs
// ---------------------------------------------------------------------------
const rootVariants = cva('flex flex-col gap-klp-size-xs')

// ---------------------------------------------------------------------------
// chips-row layer (internal layout wrapper around the selected-value chips,
// rendered inside Input's `iconLeft` slot). Not a distinct anatomy part in
// the spec — the extractor modeled `chip` as repeated directly inside
// `input-box`. Gap between chips reuses the same --klp-size-xs token already
// used for input-box's own itemSpacing, for visual consistency.
// ---------------------------------------------------------------------------
const chipsRowVariants = cva('flex flex-wrap items-center gap-klp-size-xs')

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface InputMultiselectOption {
  /** Stable identifier for the option (matches values in `value`/`defaultValue`) */
  id: string
  /** Option label rendered in the dropdown row and in the trigger chip */
  label: string
}

export interface InputMultiselectSection {
  /** Optional section title (hidden when omitted) */
  title?: string
  /** Options rendered in this section */
  options: InputMultiselectOption[]
}

export interface InputMultiselectProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'size'
  > {
  /** Label text displayed above the trigger box
   * @propClass optional
   */
  label?: string
  /** Show the optional info icon next to the trigger label
   * @propClass optional
   */
  showInfoIcon?: boolean
  /** Placeholder text shown when no value is selected
   * @propClass optional
   */
  placeholder?: string
  /** Grouped, selectable options rendered in the dropdown panel
   * @propClass required
   */
  sections: InputMultiselectSection[]
  /** Controlled selected option ids
   * @propClass optional
   */
  value?: string[]
  /** Default selected option ids (uncontrolled)
   * @propClass optional
   */
  defaultValue?: string[]
  /** Callback fired whenever the selection changes
   * @propClass optional
   */
  onValueChange?: (value: string[]) => void
  /** Controlled dropdown open state
   * @propClass optional
   */
  open?: boolean
  /** Default dropdown open state (uncontrolled)
   * @propClass optional
   */
  defaultOpen?: boolean
  /** Callback fired when the dropdown open state changes
   * @propClass optional
   */
  onOpenChange?: (open: boolean) => void
  /** Maximum number of chips rendered before collapsing the rest into a "+N" overflow chip
   * @propClass optional
   */
  maxVisibleChips?: number
  /** Additional className applied to the outer root wrapper
   * @propClass optional
   */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const InputMultiselect = React.forwardRef<HTMLInputElement, InputMultiselectProps>(
  (
    {
      label,
      showInfoIcon = true,
      placeholder = 'This is the placeholder or input content',
      sections,
      value,
      defaultValue = [],
      onValueChange,
      open,
      defaultOpen = false,
      onOpenChange,
      maxVisibleChips = 4,
      className,
      ...props
    },
    ref
  ) => {
    // ── selection state (controlled/uncontrolled) ──────────────────────────
    const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue)
    const isValueControlled = value !== undefined
    const currentValue = isValueControlled ? value : internalValue

    const setValue = (next: string[]) => {
      if (!isValueControlled) setInternalValue(next)
      onValueChange?.(next)
    }
    const toggle = (id: string) => {
      const has = currentValue.includes(id)
      setValue(has ? currentValue.filter((v) => v !== id) : [...currentValue, id])
    }
    const remove = (id: string) => setValue(currentValue.filter((v) => v !== id))

    // ── dropdown open state (controlled/uncontrolled) ──────────────────────
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const isOpen = open !== undefined ? open : internalOpen
    const handleOpenChange = (next: boolean) => {
      if (open === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    }

    // ── derived visuals ─────────────────────────────────────────────────────
    // content axis (filled | empty | full) is a *computed* prop class, not
    // author-facing — it only drives which chips/placeholder branch renders,
    // it never changes any token binding (input-box fill/stroke/radius/padding
    // are identical across filled/full; only "empty" differs — see spec).
    const hasSelection = currentValue.length > 0
    // state axis (open | close): border/ring tokens both resolve to
    // border-klp-border-brand for "filled" and "focused" in Input — using
    // "focused" while open and "filled" while closed+selected reproduces the
    // captured strokes for all 5 variants (only empty+closed uses "default").
    const derivedState = isOpen ? 'focused' : hasSelection ? 'filled' : 'default'
    // chevron-icon: literal capture is chevron-down when State=Open and
    // chevron-right when State=Close (confirmed intentional, not a rotate
    // affordance — see spec anatomy notes).
    const ChevronIcon = isOpen ? ChevronDown : ChevronRight

    const optionLabelById = React.useMemo(() => {
      const map = new Map<string, string>()
      for (const section of sections) {
        for (const option of section.options) map.set(option.id, option.label)
      }
      return map
    }, [sections])

    const selectedItems = currentValue.map((id) => ({
      id,
      label: optionLabelById.get(id) ?? id,
    }))
    const visibleChips = selectedItems.slice(0, maxVisibleChips)
    const overflowCount = selectedItems.length - visibleChips.length

    const menuSections: ActionSheetMenuSection[] = sections.map((section) => ({
      title: section.title,
      items: section.options.map((option) => ({
        id: option.id,
        label: option.label,
        checked: currentValue.includes(option.id),
        onCheckedChange: () => toggle(option.id),
      })),
    }))

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && selectedItems.length > 0) {
        e.preventDefault()
        remove(selectedItems[selectedItems.length - 1].id)
        return
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleOpenChange(!isOpen)
      }
    }

    return (
      <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
        {/* The anchor is the whole field, not the native <input>: the input
            shrinks and shifts as chips fill the box, which would drag the
            dropdown along with it. Anchoring on the root also makes
            --radix-popover-trigger-width resolve to the full field width. */}
        <Popover.Anchor asChild>
          <div className={cn(rootVariants(), className)}>
          {/* trigger layer — REUSED: input (label, info-icon, input-box, placeholder) */}
          <Popover.Trigger asChild>
            <Input
              ref={ref}
              label={label}
              showInfoIcon={showInfoIcon}
              size="small"
              state={derivedState}
              placeholder={hasSelection ? undefined : placeholder}
              iconLeft={
                hasSelection ? (
                  <div className={chipsRowVariants()}>
                    {visibleChips.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="contents"
                        aria-label={`Remove ${item.label}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          remove(item.id)
                        }}
                      >
                        {/* chip layer — REUSED: badges (Type=Tertiary/Size=Small/Style=Light) */}
                        <Badge
                          badgeType="tertiary"
                          size="small"
                          badgeStyle="light"
                          rightIcon={
                            <X aria-hidden="true" strokeWidth={1.5} className="h-[16px] w-[16px]" />
                          }
                        >
                          {item.label}
                        </Badge>
                      </button>
                    ))}
                    {overflowCount > 0 && (
                      <Badge badgeType="tertiary" size="small" badgeStyle="light">
                        {`+${overflowCount}`}
                      </Badge>
                    )}
                  </div>
                ) : undefined
              }
              iconRight={
                <ChevronIcon aria-hidden="true" strokeWidth={1.5} className="h-[16px] w-[16px]" />
              }
              readOnly
              // Popover.Trigger clones this element with type="button"; an
              // <input type="button"> renders as a button and drops the
              // placeholder. Slot lets the child's own prop win, so pin it back.
              type="text"
              role="combobox"
              aria-haspopup="listbox"
              value=""
              onKeyDown={handleKeyDown}
              {...props}
            />
          </Popover.Trigger>

          {/* dropdown layer — REUSED: action-sheet-menu (type="checkbox").
              Width is pinned to the anchor so the panel always spans the full
              field; ActionSheetMenu's own min-w must be neutralised for that
              to hold on narrow fields. */}
          <Popover.Portal>
            <Popover.Content
              sideOffset={4}
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
              className="z-50 w-[var(--radix-popover-trigger-width)] outline-none"
            >
              <ActionSheetMenu
                type="checkbox"
                sections={menuSections}
                className="w-full min-w-0"
              />
            </Popover.Content>
          </Popover.Portal>
          </div>
        </Popover.Anchor>
      </Popover.Root>
    )
  }
)
InputMultiselect.displayName = 'InputMultiselect'

export { rootVariants, chipsRowVariants }
