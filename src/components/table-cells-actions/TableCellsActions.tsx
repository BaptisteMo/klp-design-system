import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'

// ---------------------------------------------------------------------------
// Layer: root — horizontal flex container
// height=2 → px-klp-size-s py-klp-size-s gap-klp-size-s   (min-h 60px literal)
// height=1 → px-klp-size-xs py-klp-size-xs gap-klp-size-xs (min-h 52px literal)
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'flex flex-row items-center bg-transparent',
  {
    variants: {
      height: {
        '2': 'pl-klp-size-s pr-klp-size-s pt-klp-size-s pb-klp-size-s gap-klp-size-s min-h-[60px]',
        '1': 'pl-klp-size-xs pr-klp-size-xs pt-klp-size-xs pb-klp-size-xs gap-klp-size-xs min-h-[52px]',
      },
    },
    defaultVariants: { height: '2' },
  }
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface TableCellsActionsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof rootVariants> {
  /**
   * Number of action buttons to render (1–4).
   * - actions=1: one icon-only button (button-1). No button-primary.
   * - actions=2: button-1 (icon) + button-primary (labelled).
   * - actions=3: button-1 + button-2 (icons) + button-primary (labelled).
   * - actions=4: button-1 + button-2 + button-3 (icons) + button-primary (labelled).
   */
  actions?: 1 | 2 | 3 | 4
  /** Icon for button-1 (icon-only, bg-invisible). Defaults to <Check />. */
  button1Icon?: React.ReactNode
  /** aria-label for button-1. */
  button1Label?: string
  /** onClick for button-1. */
  onButton1Click?: React.MouseEventHandler<HTMLButtonElement>
  /** Icon for button-2 (icon-only, bg-invisible). Defaults to <Check />. */
  button2Icon?: React.ReactNode
  /** aria-label for button-2. */
  button2Label?: string
  /** onClick for button-2. */
  onButton2Click?: React.MouseEventHandler<HTMLButtonElement>
  /** Icon for button-3 (icon-only, bg-invisible). Defaults to <Check />. */
  button3Icon?: React.ReactNode
  /** aria-label for button-3. */
  button3Label?: string
  /** onClick for button-3. */
  onButton3Click?: React.MouseEventHandler<HTMLButtonElement>
  /** Label text for the primary button. */
  primaryLabel?: string
  /** Right icon for the primary button. Defaults to <Check />. */
  primaryRightIcon?: React.ReactNode
  /** onClick for the primary button. */
  onPrimaryClick?: React.MouseEventHandler<HTMLButtonElement>
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const TableCellsActions = React.forwardRef<HTMLDivElement, TableCellsActionsProps>(
  (
    {
      className,
      height = '2',
      actions = 4,
      button1Icon,
      button1Label = 'Action 1',
      onButton1Click,
      button2Icon,
      button2Label = 'Action 2',
      onButton2Click,
      button3Icon,
      button3Label = 'Action 3',
      onButton3Click,
      primaryLabel = 'Action',
      primaryRightIcon,
      onPrimaryClick,
      ...props
    },
    ref
  ) => {
    const iconSlot1 = button1Icon ?? <Check aria-hidden="true" />
    const iconSlot2 = button2Icon ?? <Check aria-hidden="true" />
    const iconSlot3 = button3Icon ?? <Check aria-hidden="true" />
    const primaryRight = primaryRightIcon ?? <Check aria-hidden="true" />

    // button-primary is visible for all actions >= 2 (and for height=2 actions=1,
    // spec shows it hidden). Spec: actions=1 → button-primary hidden in both heights.
    const showButton2 = actions >= 3
    const showButton3 = actions >= 4
    const showPrimary = actions >= 2

    return (
      <div
        ref={ref}
        role="group"
        className={cn(rootVariants({ height }), className)}
        {...props}
      >
        {/* button-1: always visible (icon-only, bg-invisible via compound variant on Button) */}
        <Button
          variant="tertiary"
          size="icon"
          aria-label={button1Label}
          onClick={onButton1Click}
        >
          {iconSlot1}
        </Button>

        {/* button-2: visible when actions >= 3 */}
        {showButton2 && (
          <Button
            variant="tertiary"
            size="icon"
            aria-label={button2Label}
            onClick={onButton2Click}
          >
            {iconSlot2}
          </Button>
        )}

        {/* button-3: visible when actions >= 4 */}
        {showButton3 && (
          <Button
            variant="tertiary"
            size="icon"
            aria-label={button3Label}
            onClick={onButton3Click}
          >
            {iconSlot3}
          </Button>
        )}

        {/* button-primary: labelled tertiary/md with bg-inset, visible when actions >= 2 */}
        {showPrimary && (
          <Button
            variant="tertiary"
            size="md"
            rightIcon={primaryRight}
            onClick={onPrimaryClick}
          >
            {primaryLabel}
          </Button>
        )}
      </div>
    )
  }
)
TableCellsActions.displayName = 'TableCellsActions'

export { rootVariants as tableCellsActionsRootVariants }
