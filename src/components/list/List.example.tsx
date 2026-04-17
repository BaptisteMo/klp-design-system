import { List } from '@/components/list'

export function ListExample() {
  return (
    <div className="flex flex-col gap-8 p-6 max-w-md">
      {/* Default style */}
      <List
        listStyle="default"
        listTitle="Recommended"
        buttonLabel="See all"
        itemSize="medium"
        items={[
          { key: 'item-1', label: 'First item', sublabel: 'Sublabel' },
          { key: 'item-2', label: 'Second item', sublabel: 'Sublabel' },
          { key: 'item-3', label: 'Third item', sublabel: 'Sublabel' },
        ]}
      />

      {/* Condensed style */}
      <List
        listStyle="condensed"
        listTitle="Recent"
        buttonLabel="See all"
        itemSize="small"
        items={[
          { key: 'item-1', label: 'First item', sublabel: 'Sublabel' },
          { key: 'item-2', label: 'Second item', sublabel: 'Sublabel' },
        ]}
      />
    </div>
  )
}
