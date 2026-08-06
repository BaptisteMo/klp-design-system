import { useEffect } from 'react'
import { Home } from 'lucide-react'
import { NavItem } from '@/components/nav-item'

const CAPTURE_BRAND = 'showup'

export function NavItemRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Nav Item — captured in {CAPTURE_BRAND}</h1>
      <div className="grid grid-cols-4 gap-4 rounded-klp-m bg-klp-bg-brand p-6">
        <div data-variant-id="default" className="flex items-center justify-center">
          <NavItem>My offer</NavItem>
        </div>
        <div data-variant-id="active" className="flex items-center justify-center">
          <NavItem active>My offer</NavItem>
        </div>
        <div data-variant-id="default-with-icon" className="flex items-center justify-center">
          <NavItem icon={<Home />}>My offer</NavItem>
        </div>
        <div data-variant-id="active-with-icon" className="flex items-center justify-center">
          <NavItem active icon={<Home />}>My offer</NavItem>
        </div>
        <div data-variant-id="default-with-counter" className="flex items-center justify-center">
          <NavItem counter={3}>My offer</NavItem>
        </div>
        <div data-variant-id="active-with-counter" className="flex items-center justify-center">
          <NavItem active counter={3}>My offer</NavItem>
        </div>
        <div data-variant-id="default-with-icon-and-counter" className="flex items-center justify-center">
          <NavItem icon={<Home />} counter={3}>My offer</NavItem>
        </div>
        <div data-variant-id="active-with-icon-and-counter" className="flex items-center justify-center">
          <NavItem active icon={<Home />} counter={3}>My offer</NavItem>
        </div>
      </div>
    </div>
  )
}
