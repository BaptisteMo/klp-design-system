import { useEffect } from 'react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'
import {
  modalVariationRootVariants,
  modalVariationHeaderVariants,
  modalVariationTitleVariants,
  modalVariationContentVariants,
  modalVariationLabelVariants,
  modalVariationFooterVariants,
  modalVariationLeftButtonsVariants,
  modalVariationRightButtonsVariants,
} from '@/components/modal-variation'
import type { ModalVariationType } from '@/components/modal-variation'

const CAPTURE_BRAND = 'wireframe'

/** Renders the modal card layout inline (no portal/overlay) so all variants are visible side-by-side. */
function ModalCard({
  type,
  title,
  body,
  primaryLabel,
  secondaryLabel,
  optionLabel,
}: {
  type: ModalVariationType
  title: string
  body: string
  primaryLabel: string
  secondaryLabel: string
  optionLabel?: string
}) {
  return (
    <div className={cn(modalVariationRootVariants({ type }), 'w-full max-w-[480px]')}>
      {/* header */}
      <div className={modalVariationHeaderVariants({ type })}>
        <h2 className={modalVariationTitleVariants({ type })}>{title}</h2>
      </div>

      {/* content */}
      <div className={modalVariationContentVariants({ type })}>
        <p className={modalVariationLabelVariants({ type })}>{body}</p>
      </div>

      {/* footer */}
      <div className={modalVariationFooterVariants({ type })}>
        {/* left-buttons slot (options-actions only) */}
        <div className={modalVariationLeftButtonsVariants({ type })}>
          {optionLabel && (
            <Button variant="tertiary" size="md">
              {optionLabel}
            </Button>
          )}
        </div>

        {/* right-buttons slot */}
        <div className={modalVariationRightButtonsVariants({ type })}>
          <Button
            variant="tertiary"
            size="md"
            className={type === '2-actions' ? 'flex-1' : undefined}
          >
            {secondaryLabel}
          </Button>
          <Button
            variant="primary"
            size="md"
            className={type === '2-actions' ? 'flex-1' : undefined}
          >
            {primaryLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ModalVariationRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Modal Variation — captured in {CAPTURE_BRAND}</h1>

      <div className="flex flex-col gap-8">
        {/* options-actions-default */}
        <div
          data-variant-id="options-actions-default"
          className="flex flex-col gap-2"
        >
          <span className="text-xs text-klp-fg-muted font-klp-label">options-actions-default</span>
          <ModalCard
            type="options-actions"
            title="Confirm your choice"
            body="Are you sure you want to proceed with this action? This cannot be undone."
            optionLabel="More options"
            secondaryLabel="Cancel"
            primaryLabel="Confirm"
          />
        </div>

        {/* 2-actions-default */}
        <div
          data-variant-id="2-actions-default"
          className="flex flex-col gap-2"
        >
          <span className="text-xs text-klp-fg-muted font-klp-label">2-actions-default</span>
          <ModalCard
            type="2-actions"
            title="Delete item"
            body="This will permanently delete the item. Are you sure you want to continue?"
            secondaryLabel="Cancel"
            primaryLabel="Delete"
          />
        </div>
      </div>
    </div>
  )
}
