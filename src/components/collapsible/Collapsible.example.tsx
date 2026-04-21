import { ShoppingCart } from 'lucide-react'
import { Collapsible } from './Collapsible'

export function CollapsibleExample() {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-md">
      {/* Closed (default) */}
      <Collapsible
        icon={<ShoppingCart strokeWidth={1.5} />}
        title="My section"
        defaultOpen={false}
      >
        <p>This is the hidden content revealed when expanded.</p>
      </Collapsible>

      {/* Open */}
      <Collapsible
        icon={<ShoppingCart strokeWidth={1.5} />}
        title="My section"
        defaultOpen={true}
      >
        <p>This is the hidden content revealed when expanded.</p>
      </Collapsible>
    </div>
  )
}
