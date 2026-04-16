import { Badge } from './Badges'
import { Check } from 'lucide-react'


export function BadgeExample() {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Primary badge — bordered, medium (default) */}
      <Badge badgeType="primary" size="medium" badgeStyle="bordered" leftIcon={<Check />} rightIcon={<Check />}>
        Label
      </Badge>

      {/* Primary badge — light */}
      <Badge badgeType="primary" size="medium" badgeStyle="light" leftIcon={<Check />} rightIcon={<Check />}>
        Label
      </Badge>

      {/* Success badge */}
      <Badge badgeType="success" size="medium" badgeStyle="bordered" leftIcon={<Check />}>
        Label
      </Badge>

      {/* Danger badge */}
      <Badge badgeType="danger" size="small" badgeStyle="bordered">
        Label
      </Badge>

      {/* Warning badge */}
      <Badge badgeType="warning" size="large" badgeStyle="bordered" leftIcon={<Check />} rightIcon={<Check />}>
        Label
      </Badge>

      {/* On-emphasis badge */}
      <Badge badgeType="on-emphasis" size="medium" badgeStyle="light" leftIcon={<Check />} rightIcon={<Check />}>
        Label
      </Badge>

      {/* Outlined badge */}
      <Badge badgeType="outlined" size="medium" badgeStyle="light" leftIcon={<Check />} rightIcon={<Check />}>
        Label
      </Badge>
    </div>
  )
}
