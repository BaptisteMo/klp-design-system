import { Home } from 'lucide-react'
import { NavItem } from '@/components/nav-item'

export function NavItemExample() {
  return (
    <nav className="flex gap-2 bg-klp-bg-brand px-4">
      <NavItem href="/" active icon={<Home />} counter={3}>
        Home
      </NavItem>
      <NavItem href="/offers">My offer</NavItem>
    </nav>
  )
}
