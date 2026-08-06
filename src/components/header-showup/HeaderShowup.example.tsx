import { Home, Search, Calendar, FileEdit, Activity } from 'lucide-react'
import { HeaderShowup } from './HeaderShowup'

export function HeaderShowupExample() {
  return (
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
        { id: 'mall-income', label: 'Mall income activity', icon: <Activity aria-hidden="true" /> },
      ]}
      onItemSelect={(id) => {
        // handle navigation, e.g. router.push(`/${id}`)
        void id
      }}
    />
  )
}
