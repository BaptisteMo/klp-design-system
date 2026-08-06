import { useEffect } from 'react'
import { Search } from 'lucide-react'
import { NavbarItem } from '@/components/navbar-item'

const CAPTURE_BRAND = 'atlas'

export function NavbarItemRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Navbar Item — captured in {CAPTURE_BRAND}</h1>
      <div className="flex gap-4 rounded-klp-m bg-klp-bg-navrail p-6">
        <div data-variant-id="default" className="flex items-center justify-center">
          <NavbarItem icon={<Search strokeWidth={1.5} />} state="default">
            Search
          </NavbarItem>
        </div>
        <div data-variant-id="hover" className="flex items-center justify-center">
          <NavbarItem icon={<Search strokeWidth={1.5} />} state="hover">
            Search
          </NavbarItem>
        </div>
        <div data-variant-id="selected" className="flex items-center justify-center">
          <NavbarItem icon={<Search strokeWidth={1.5} />} state="selected">
            Search
          </NavbarItem>
        </div>
        <div className="flex items-center justify-center">
          <NavbarItem icon={<Search strokeWidth={1.5} />}>Search</NavbarItem>
        </div>
      </div>
      <p className="text-klp-text-small text-klp-fg-muted">
        The rightmost item is uncontrolled — hover it with a real pointer to check the
        white-10% surface via the actual CSS <code>:hover</code> pseudo-class. The three
        labeled cells force each state statically via the <code>state</code> prop.
      </p>
    </div>
  )
}
