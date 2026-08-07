import { useEffect } from 'react'
import {
  Search,
  MapPin,
  Home,
  ListTodo,
  AlignHorizontalJustifyCenter,
  Puzzle,
  Handshake,
  FileSignature,
  BarChartBig,
  UserCog,
} from 'lucide-react'
import { SidebarAtlas, type SidebarAtlasItem } from '@/components/sidebar-atlas'

const CAPTURE_BRAND = 'atlas'

const ITEMS: SidebarAtlasItem[] = [
  { id: 'search', label: 'Search', icon: <Search strokeWidth={1.5} /> },
  { id: 'map', label: 'Map', icon: <MapPin strokeWidth={1.5} /> },
  { id: 'dashboard', label: 'Dashboard', icon: <Home strokeWidth={1.5} />, selected: true },
  { id: 'todo', label: 'Todo', icon: <ListTodo strokeWidth={1.5} /> },
  {
    id: 'benchmark',
    label: 'Benchmark',
    icon: <AlignHorizontalJustifyCenter strokeWidth={1.5} />,
    state: 'hover',
  },
  { id: 'matching', label: 'Matching', icon: <Puzzle strokeWidth={1.5} /> },
  { id: 'operations', label: 'Operations', icon: <Handshake strokeWidth={1.5} /> },
  { id: 'contracts', label: 'Contracts', icon: <FileSignature strokeWidth={1.5} /> },
  { id: 'reporting', label: 'Reporting', icon: <BarChartBig strokeWidth={1.5} /> },
  { id: 'admin', label: 'Admin', icon: <UserCog strokeWidth={1.5} /> },
]

export function SidebarAtlasRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Sidebar (Atlas) — captured in {CAPTURE_BRAND}</h1>
      <div data-variant-id="default" className="h-[720px] w-fit rounded-klp-m border border-klp-border-default">
        <SidebarAtlas items={ITEMS} />
      </div>
      <p className="text-klp-text-small text-klp-fg-muted">
        &quot;Dashboard&quot; is forced <code>selected</code> (right-edge border); &quot;Benchmark&quot;
        is forced <code>state=&quot;hover&quot;</code> (white-10% surface) so all three navbar-item
        states are visible at once without a pointer. Every other item is real CSS
        <code> :hover</code> — reachable with a genuine pointer or keyboard focus.
      </p>
    </div>
  )
}
