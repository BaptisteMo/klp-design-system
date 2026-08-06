import { useEffect } from 'react'
import { Home, Search, Calendar, FileEdit, Activity } from 'lucide-react'
import { HeaderShowup } from '@/components/header-showup'

const CAPTURE_BRAND = 'showup'

export function HeaderShowupRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">
        Header Showup — captured in {CAPTURE_BRAND}
      </h1>

      <div data-variant-id="default" className="rounded-klp-m border border-klp-border-default">
        <HeaderShowup
          items={[
            { id: 'home', label: 'Home', icon: <Home aria-hidden="true" /> },
            { id: 'search', label: 'Search', icon: <Search aria-hidden="true" /> },
            { id: 'calendar', label: 'Calendar', icon: <Calendar aria-hidden="true" /> },
            {
              id: 'my-draft',
              label: 'My draft',
              icon: <FileEdit aria-hidden="true" />,
              counter: 3,
              active: true,
            },
            {
              id: 'mall-income',
              label: 'Mall income activity',
              icon: <Activity aria-hidden="true" />,
            },
          ]}
        />
      </div>
    </div>
  )
}
