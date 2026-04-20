import { useEffect } from 'react'
import { Check, Search, PenLine, FolderPlus, FilePlus } from 'lucide-react'
import { HeaderDesktop } from '@/components/header-desktop'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { BreadCrumbs } from '@/components/breadcrumbs'

const CAPTURE_BRAND = 'klub'

const BREADCRUMB_STEPS = [
  { label: 'Home' },
  { label: 'Current page' },
]

export function HeaderDesktopRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Header Desktop — captured in {CAPTURE_BRAND}</h1>

      <div className="flex flex-col gap-8">
        {/* features-default */}
        <div
          data-variant-id="features-default"
          className="rounded-klp-m border border-klp-border-default p-6"
        >
          <p className="mb-4 text-xs text-klp-fg-muted">features=default</p>
          {/* Mirror the Figma layout: title + [Check][Search][PenLine][FolderPlus] [New + FilePlus] + breadcrumbs below */}
          <div className="flex flex-col gap-[4px]">
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-klp-fg-brand-contrasted text-klp-heading-h1 font-klp-title leading-[36px]">
                Page title
              </h1>
              <div className="flex flex-row items-center">
                <Button variant="tertiary" size="icon" aria-label="Check">
                  <Check className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
                </Button>
                <Button variant="tertiary" size="icon" aria-label="Search">
                  <Search className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
                </Button>
                <Button variant="tertiary" size="icon" aria-label="Edit">
                  <PenLine className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
                </Button>
                <Button variant="tertiary" size="icon" aria-label="New folder">
                  <FolderPlus className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  rightIcon={<FilePlus className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />}
                >
                  New
                </Button>
              </div>
            </div>
            <BreadCrumbs steps={BREADCRUMB_STEPS} showDropdownAffordance />
          </div>
        </div>

        {/* features-search-active */}
        <div
          data-variant-id="features-search-active"
          className="rounded-klp-m border border-klp-border-default p-6"
        >
          <p className="mb-4 text-xs text-klp-fg-muted">features=search-active</p>
          {/* Mirror the Figma layout: title + search input replacing action row + breadcrumbs below */}
          <div className="flex flex-col gap-[4px]">
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-klp-fg-brand-contrasted text-klp-heading-h1 font-klp-title leading-[36px]">
                Page title
              </h1>
              <Input
                size="small"
                state="default"
                type="search"
                placeholder="Search…"
                iconLeft={<Search className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />}
              />
            </div>
            <BreadCrumbs steps={BREADCRUMB_STEPS} showDropdownAffordance />
          </div>
        </div>

        {/* Full component — default */}
        <div className="rounded-klp-m border border-klp-border-default p-6">
          <p className="mb-4 text-xs text-klp-fg-muted">HeaderDesktop component — features=default</p>
          <HeaderDesktop
            features="default"
            title="Page title"
            breadcrumbSteps={BREADCRUMB_STEPS}
          />
        </div>

        {/* Full component — search-active */}
        <div className="rounded-klp-m border border-klp-border-default p-6">
          <p className="mb-4 text-xs text-klp-fg-muted">HeaderDesktop component — features=search-active</p>
          <HeaderDesktop
            features="search-active"
            title="Page title"
            breadcrumbSteps={BREADCRUMB_STEPS}
          />
        </div>
      </div>
    </div>
  )
}
