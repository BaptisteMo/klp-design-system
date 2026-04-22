import { useEffect } from 'react'
import { SideBar } from '@/components/sidebar'

const CAPTURE_BRAND = 'klub'

export function SideBarRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev
    }
  }, [])

  const handleNavigate = (key: string, parentKey?: string) => {
    console.log('[sidebar] navigate', { key, parentKey })
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-xl font-semibold">
        SideBar — captured in {CAPTURE_BRAND}
      </h1>

      <div className="flex flex-wrap gap-8 items-start">
        {/* default — no active */}
        <div data-variant-id="default" className="flex flex-col gap-2">
          <p className="text-sm text-klp-fg-muted font-klp-label">default</p>
          <SideBar
            contextLabel="Centre Commercial"
            userName="Baptiste M."
            onNavigate={handleNavigate}
          />
        </div>

        {/* active leaf */}
        <div data-variant-id="active-leaf" className="flex flex-col gap-2">
          <p className="text-sm text-klp-fg-muted font-klp-label">
            activeKey=my-documents
          </p>
          <SideBar
            contextLabel="Centre Commercial"
            userName="Baptiste M."
            activeKey="my-documents"
            onNavigate={handleNavigate}
          />
        </div>

        {/* active child */}
        <div data-variant-id="active-child" className="flex flex-col gap-2">
          <p className="text-sm text-klp-fg-muted font-klp-label">
            activeKey=my-shopping-center / activeChildKey=newsfeed
          </p>
          <SideBar
            contextLabel="Centre Commercial"
            userName="Baptiste M."
            activeKey="my-shopping-center"
            activeChildKey="newsfeed"
            onNavigate={handleNavigate}
          />
        </div>

        {/* phone */}
        <div data-variant-id="phone" className="flex flex-col gap-2">
          <p className="text-sm text-klp-fg-muted font-klp-label">
            device=phone, activeKey=customer-excellence / activeChildKey=ace
          </p>
          <SideBar
            device="phone"
            contextLabel="Centre Commercial"
            userName="Baptiste M."
            activeKey="customer-excellence"
            activeChildKey="ace"
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </div>
  )
}
