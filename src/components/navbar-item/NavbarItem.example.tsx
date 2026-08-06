import { Search } from 'lucide-react'
import { NavbarItem } from '@/components/navbar-item'

export function NavbarItemExample() {
  return (
    <nav className="flex flex-col gap-2 bg-klp-bg-navrail p-2">
      <NavbarItem icon={<Search strokeWidth={1.5} />} selected>
        Search
      </NavbarItem>
      <NavbarItem href="/search" icon={<Search strokeWidth={1.5} />}>
        Search
      </NavbarItem>
    </nav>
  )
}
