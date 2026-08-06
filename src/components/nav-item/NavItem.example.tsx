import { Home } from 'lucide-react'
import { NavItem } from '@/components/nav-item'

export function NavItemExample() {
  return (
    <nav className="flex gap-2 bg-klp-bg-brand px-4">
      <NavItem asChild active icon={<Home />} counter={3}>
        <a href="/">Home</a>
      </NavItem>
      <NavItem asChild>
        <a href="/offers">My offer</a>
      </NavItem>
    </nav>
  )
}
