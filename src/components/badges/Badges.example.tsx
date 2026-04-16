import { Badge } from './Badges'

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function BadgeExample() {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Primary badge — bordered, medium (default) */}
      <Badge badgeType="primary" size="medium" badgeStyle="bordered" leftIcon={<CheckIcon />} rightIcon={<CheckIcon />}>
        Label
      </Badge>

      {/* Primary badge — light */}
      <Badge badgeType="primary" size="medium" badgeStyle="light" leftIcon={<CheckIcon />} rightIcon={<CheckIcon />}>
        Label
      </Badge>

      {/* Success badge */}
      <Badge badgeType="success" size="medium" badgeStyle="bordered" leftIcon={<CheckIcon />}>
        Label
      </Badge>

      {/* Danger badge */}
      <Badge badgeType="danger" size="small" badgeStyle="bordered">
        Label
      </Badge>

      {/* Warning badge */}
      <Badge badgeType="warning" size="large" badgeStyle="bordered" leftIcon={<CheckIcon />} rightIcon={<CheckIcon />}>
        Label
      </Badge>

      {/* On-emphasis badge */}
      <Badge badgeType="on-emphasis" size="medium" badgeStyle="light" leftIcon={<CheckIcon />} rightIcon={<CheckIcon />}>
        Label
      </Badge>

      {/* Outlined badge */}
      <Badge badgeType="outlined" size="medium" badgeStyle="light" leftIcon={<CheckIcon />} rightIcon={<CheckIcon />}>
        Label
      </Badge>
    </div>
  )
}
