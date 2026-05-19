import { ModalVariation, ModalVariationTrigger, ModalVariationRoot } from '@/components/modal-variation'
import { Button } from '@/components/button'

export function ModalVariationExample() {
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Options Actions variant — left option + right secondary/primary CTA */}
      <ModalVariationRoot>
        <ModalVariationTrigger asChild>
          <Button variant="secondary" size="md">Open Options Actions Modal</Button>
        </ModalVariationTrigger>
        <ModalVariation
          type="options-actions"
          title="Confirm your choice"
          optionActionLabel="More options"
          secondaryActionLabel="Cancel"
          primaryActionLabel="Confirm"
        >
          Are you sure you want to proceed with this action? This cannot be undone.
        </ModalVariation>
      </ModalVariationRoot>

      {/* 2-Actions variant — full-width secondary + primary CTA */}
      <ModalVariationRoot>
        <ModalVariationTrigger asChild>
          <Button variant="secondary" size="md">Open 2-Actions Modal</Button>
        </ModalVariationTrigger>
        <ModalVariation
          type="2-actions"
          title="Delete item"
          secondaryActionLabel="Cancel"
          primaryActionLabel="Delete"
        >
          This will permanently delete the item. Are you sure you want to continue?
        </ModalVariation>
      </ModalVariationRoot>
    </div>
  )
}
