import { Card } from './Cards'

export function CardExample() {
  return (
    <div className="flex flex-wrap items-start gap-klp-size-m">
      <Card paddingSize="8px">
        <p className="text-klp-text-small text-klp-fg-default">Compact card content</p>
      </Card>
      <Card paddingSize="16px">
        <p className="text-klp-text-medium text-klp-fg-default">Regular card content</p>
      </Card>
    </div>
  )
}
