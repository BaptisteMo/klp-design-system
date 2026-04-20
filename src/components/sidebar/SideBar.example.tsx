import { FolderOpen, Home, Settings, Users } from 'lucide-react'
import { SideBar } from './SideBar'

export function SideBarExample() {
  return (
    <SideBar
      device="desktop"
      contextLabel="Klub! — Centre Commercial"
      userName="Baptiste M."
      menuItems={[
        {
          key: 'home',
          label: 'Accueil',
          icon: <Home aria-hidden="true" strokeWidth={1.5} />,
          feature: 'static',
          state: 'active',
        },
        {
          key: 'files',
          label: 'Fichiers',
          icon: <FolderOpen aria-hidden="true" strokeWidth={1.5} />,
          feature: 'collapsible',
          state: 'rest',
        },
        {
          key: 'team',
          label: 'Équipe',
          icon: <Users aria-hidden="true" strokeWidth={1.5} />,
          feature: 'static',
          state: 'rest',
        },
        {
          key: 'settings',
          label: 'Paramètres',
          icon: <Settings aria-hidden="true" strokeWidth={1.5} />,
          feature: 'static',
          state: 'rest',
        },
      ]}
    />
  )
}
