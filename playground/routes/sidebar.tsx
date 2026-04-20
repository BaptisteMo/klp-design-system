import { useEffect } from 'react'
import { FolderOpen, Home, Settings, Users, BarChart2 } from 'lucide-react'
import { SideBar } from '@/components/sidebar'

const CAPTURE_BRAND = 'klub'

const MENU_ITEMS_DESKTOP = [
  {
    key: 'home',
    label: 'Accueil',
    icon: <Home aria-hidden="true" strokeWidth={1.5} />,
    feature: 'static' as const,
    state: 'active' as const,
  },
  {
    key: 'files',
    label: 'Fichiers',
    icon: <FolderOpen aria-hidden="true" strokeWidth={1.5} />,
    feature: 'collapsible' as const,
    state: 'rest' as const,
  },
  {
    key: 'team',
    label: 'Équipe',
    icon: <Users aria-hidden="true" strokeWidth={1.5} />,
    feature: 'static' as const,
    state: 'rest' as const,
  },
  {
    key: 'stats',
    label: 'Statistiques',
    icon: <BarChart2 aria-hidden="true" strokeWidth={1.5} />,
    feature: 'static' as const,
    state: 'hover' as const,
  },
  {
    key: 'settings',
    label: 'Paramètres',
    icon: <Settings aria-hidden="true" strokeWidth={1.5} />,
    feature: 'static' as const,
    state: 'rest' as const,
  },
]

export function SideBarRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev
    }
  }, [])

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-xl font-semibold">SideBar — captured in {CAPTURE_BRAND}</h1>

      <div className="flex flex-wrap gap-8 items-start">
        {/* desktop variant */}
        <div data-variant-id="desktop" className="flex flex-col gap-2">
          <p className="text-sm text-klp-fg-muted font-klp-label">device=desktop</p>
          <SideBar
            device="desktop"
            contextLabel="Centre Commercial"
            userName="Baptiste M."
            menuItems={MENU_ITEMS_DESKTOP}
          />
        </div>

        {/* phone variant */}
        <div data-variant-id="phone" className="flex flex-col gap-2">
          <p className="text-sm text-klp-fg-muted font-klp-label">device=phone</p>
          <SideBar
            device="phone"
            contextLabel="Centre Commercial"
            userName="Baptiste M."
            menuItems={MENU_ITEMS_DESKTOP}
          />
        </div>
      </div>
    </div>
  )
}
