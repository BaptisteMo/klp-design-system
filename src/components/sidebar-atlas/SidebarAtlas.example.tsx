import { useState } from 'react'
import { Search, MapPin, Home } from 'lucide-react'
import { SidebarAtlas } from '@/components/sidebar-atlas'

export function SidebarAtlasExample() {
  const [activeId, setActiveId] = useState('dashboard')

  return (
    <div className="h-[600px]">
      <SidebarAtlas
        items={[
          { id: 'search', label: 'Search', icon: <Search strokeWidth={1.5} />, selected: activeId === 'search' },
          { id: 'map', label: 'Map', icon: <MapPin strokeWidth={1.5} />, selected: activeId === 'map' },
          { id: 'dashboard', label: 'Dashboard', icon: <Home strokeWidth={1.5} />, selected: activeId === 'dashboard' },
        ]}
        onItemSelect={setActiveId}
      />
    </div>
  )
}
