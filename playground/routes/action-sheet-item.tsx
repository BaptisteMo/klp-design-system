import { useEffect } from 'react'
import { Plus } from 'lucide-react'
import { ActionSheetItem } from '@/components/action-sheet-item'

const CAPTURE_BRAND = 'wireframe'

export function ActionSheetItemRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev
    }
  }, [])

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-xl font-semibold">ActionSheet Item — captured in {CAPTURE_BRAND}</h1>

      {/* LG size */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-klp-fg-muted">Size: LG</h2>
        <div className="flex flex-col gap-2 w-80">
          <div data-variant-id="default-lg-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="default" size="lg" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="default-lg-hover" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="hover" size="lg" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="default-lg-active" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="active" size="lg" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="emphased-lg-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="emphased" size="lg" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="disabled-lg-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="disabled" size="lg" disabled firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="destructive-lg-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="destructive" size="lg" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="creation-lg-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="creation" size="lg" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
        </div>
      </section>

      {/* MD size */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-klp-fg-muted">Size: MD</h2>
        <div className="flex flex-col gap-2 w-80">
          <div data-variant-id="default-md-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="default" size="md" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="default-md-hover" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="hover" size="md" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="default-md-active" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="active" size="md" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="emphased-md-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="emphased" size="md" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="disabled-md-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="disabled" size="md" disabled firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="destructive-md-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="destructive" size="md" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="creation-md-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="creation" size="md" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
        </div>
      </section>

      {/* SM size */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-klp-fg-muted">Size: SM</h2>
        <div className="flex flex-col gap-2 w-80">
          <div data-variant-id="default-sm-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="default" size="sm" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="default-sm-hover" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="hover" size="sm" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="default-sm-active" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="active" size="sm" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="emphased-sm-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="emphased" size="sm" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="disabled-sm-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="disabled" size="sm" disabled firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="destructive-sm-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="destructive" size="sm" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
          <div data-variant-id="creation-sm-default" className="rounded-klp-m border border-klp-border-default p-2">
            <ActionSheetItem state="creation" size="sm" firstIcon={<Plus strokeWidth={1.5} />} secondAction={<Plus strokeWidth={1.5} />}>
              Label action
            </ActionSheetItem>
          </div>
        </div>
      </section>
    </div>
  )
}
