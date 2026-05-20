import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'

// ---------------------------------------------------------------------------
// Layer: root
// Controls background, border, corner-radius, gap between header/content/footer.
// Both variants share identical root styles.
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'flex flex-col rounded-[16px] border bg-klp-bg-default border-klp-border-default overflow-hidden',
  {
    variants: {
      type: {
        'options-actions': 'gap-[0px]',
        '2-actions': 'gap-[0px]',
      },
    },
    defaultVariants: { type: 'options-actions' },
  }
)

// ---------------------------------------------------------------------------
// Layer: header
// Inset background, 24px padding on all sides.
// ---------------------------------------------------------------------------
const headerVariants = cva(
  'flex flex-col gap-[8px] bg-klp-bg-inset px-[24px] py-[24px]',
  {
    variants: {
      type: {
        'options-actions': '',
        '2-actions': '',
      },
    },
    defaultVariants: { type: 'options-actions' },
  }
)

// ---------------------------------------------------------------------------
// Layer: title
// Heading text — fg/default color, literal 20px/600 Inter.
// ---------------------------------------------------------------------------
const titleVariants = cva(
  'text-klp-fg-default text-[20px] font-[600] leading-[28px] font-[Inter,sans-serif]',
  {
    variants: {
      type: {
        'options-actions': '',
        '2-actions': '',
      },
    },
    defaultVariants: { type: 'options-actions' },
  }
)

// ---------------------------------------------------------------------------
// Layer: content
// Body area — bg/default fill, 24px padding, 24px gap between children.
// ---------------------------------------------------------------------------
const contentVariants = cva(
  'flex flex-col gap-[24px] bg-klp-bg-default px-[24px] py-[24px]',
  {
    variants: {
      type: {
        'options-actions': '',
        '2-actions': '',
      },
    },
    defaultVariants: { type: 'options-actions' },
  }
)

// ---------------------------------------------------------------------------
// Layer: label
// Body copy text — fg/default, klp label typography system.
// ---------------------------------------------------------------------------
const labelVariants = cva(
  'text-klp-fg-default text-klp-text-medium font-klp-label font-klp-label leading-[24px]',
  {
    variants: {
      type: {
        'options-actions': '',
        '2-actions': '',
      },
    },
    defaultVariants: { type: 'options-actions' },
  }
)

// ---------------------------------------------------------------------------
// Layer: footer
// Frosted glass — semi-transparent white + backdrop blur, bd/inset top border.
// 16px horizontal padding, 24px vertical padding.
// ---------------------------------------------------------------------------
const footerVariants = cva(
  'flex flex-row items-center justify-between border-t px-[16px] py-[24px] bg-white/70 backdrop-blur-xl border-klp-bg-inset',
  {
    variants: {
      type: {
        'options-actions': '',
        '2-actions': '',
      },
    },
    defaultVariants: { type: 'options-actions' },
  }
)

// ---------------------------------------------------------------------------
// Layer: left-buttons
// Left slot — HUG sizing, 16px gap between sibling buttons.
// Only visible in options-actions variant.
// ---------------------------------------------------------------------------
const leftButtonsVariants = cva('flex flex-row items-center gap-[16px]', {
  variants: {
    type: {
      'options-actions': '',
      '2-actions': 'hidden',
    },
  },
  defaultVariants: { type: 'options-actions' },
})

// ---------------------------------------------------------------------------
// Layer: right-buttons
// Right slot — FILL in 2-actions, HUG in options-actions, 16px gap.
// ---------------------------------------------------------------------------
const rightButtonsVariants = cva('flex flex-row items-center gap-[16px]', {
  variants: {
    type: {
      'options-actions': '',
      '2-actions': 'flex-1',
    },
  },
  defaultVariants: { type: 'options-actions' },
})

// ---------------------------------------------------------------------------
// Public prop types
// ---------------------------------------------------------------------------
export type ModalVariationType = 'options-actions' | '2-actions'

export interface ModalVariationProps extends VariantProps<typeof rootVariants> {
  /** @propClass optional */
  type?: ModalVariationType
  /** @propClass optional */
  open?: boolean
  /** @propClass optional */
  defaultOpen?: boolean
  /** @propClass optional */
  onOpenChange?: (open: boolean) => void
  /** @propClass required */
  title: React.ReactNode
  /** @propClass required */
  children: React.ReactNode
  /** @propClass optional */
  primaryActionLabel?: string
  /** @propClass optional */
  onPrimaryAction?: () => void
  /** @propClass optional */
  secondaryActionLabel?: string
  /** @propClass optional */
  onSecondaryAction?: () => void
  /** @propClass optional — visible only in options-actions variant */
  optionActionLabel?: string
  /** @propClass optional */
  onOptionAction?: () => void
  /** @propClass optional */
  className?: string
}

// ---------------------------------------------------------------------------
// Compound parts — exported for advanced composition
// ---------------------------------------------------------------------------
export const ModalVariationRoot = Dialog.Root
export const ModalVariationTrigger = Dialog.Trigger
export const ModalVariationPortal = Dialog.Portal
export const ModalVariationOverlay = Dialog.Overlay
export const ModalVariationClose = Dialog.Close

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export const ModalVariation = React.forwardRef<HTMLDivElement, ModalVariationProps>(
  (
    {
      type = 'options-actions',
      open,
      defaultOpen,
      onOpenChange,
      title,
      children,
      primaryActionLabel = 'Confirm',
      onPrimaryAction,
      secondaryActionLabel = 'Cancel',
      onSecondaryAction,
      optionActionLabel = 'Option',
      onOptionAction,
      className,
    },
    ref
  ) => {
    return (
      <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            ref={ref}
            className={cn(
              'fixed left-[50%] top-[50%] w-full max-w-[480px] translate-x-[-50%] translate-y-[-50%]',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              rootVariants({ type }),
              className
            )}
          >
            {/* header */}
            <div className={headerVariants({ type })}>
              <Dialog.Title className={titleVariants({ type })}>
                {title}
              </Dialog.Title>
            </div>

            {/* content */}
            <div className={contentVariants({ type })}>
              <p className={labelVariants({ type })}>{children}</p>
            </div>

            {/* footer */}
            <div className={footerVariants({ type })}>
              {/* left-buttons (options-actions only) */}
              <div className={leftButtonsVariants({ type })}>
                <Button
                  variant="tertiary"
                  size="md"
                  onClick={onOptionAction}
                >
                  {optionActionLabel}
                </Button>
              </div>

              {/* right-buttons */}
              <div className={rightButtonsVariants({ type })}>
                <Button
                  variant="tertiary"
                  size="md"
                  onClick={onSecondaryAction}
                  className={type === '2-actions' ? 'flex-1' : undefined}
                >
                  {secondaryActionLabel}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={onPrimaryAction}
                  className={type === '2-actions' ? 'flex-1' : undefined}
                >
                  {primaryActionLabel}
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }
)
ModalVariation.displayName = 'ModalVariation'

export {
  rootVariants as modalVariationRootVariants,
  headerVariants as modalVariationHeaderVariants,
  titleVariants as modalVariationTitleVariants,
  contentVariants as modalVariationContentVariants,
  labelVariants as modalVariationLabelVariants,
  footerVariants as modalVariationFooterVariants,
  leftButtonsVariants as modalVariationLeftButtonsVariants,
  rightButtonsVariants as modalVariationRightButtonsVariants,
}
