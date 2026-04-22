import { SideBar } from './SideBar'

export function SideBarExample() {
  return (
    <div className="flex gap-8 items-start p-6">
      {/* Default — no active item */}
      <SideBar
        contextLabel="Centre Commercial"
        userName="Baptiste M."
        onNavigate={(key, parentKey) =>
          console.log('navigate', { key, parentKey })
        }
      />

      {/* Active leaf */}
      <SideBar
        contextLabel="Centre Commercial"
        userName="Baptiste M."
        activeKey="my-documents"
        onNavigate={(key, parentKey) =>
          console.log('navigate', { key, parentKey })
        }
      />

      {/* Active sub-item — parent auto-expands */}
      <SideBar
        contextLabel="Centre Commercial"
        userName="Baptiste M."
        activeKey="my-shopping-center"
        activeChildKey="newsfeed"
        onNavigate={(key, parentKey) =>
          console.log('navigate', { key, parentKey })
        }
      />

      {/* Phone */}
      <SideBar
        device="phone"
        contextLabel="Centre Commercial"
        userName="Baptiste M."
        activeKey="customer-excellence"
        activeChildKey="ace"
      />
    </div>
  )
}
