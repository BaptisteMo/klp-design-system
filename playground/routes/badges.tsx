import { useEffect } from 'react'
import { Badge, type BadgeType, type BadgeSize, type BadgeStyle } from '@/components/badges'

const CAPTURE_BRAND = 'wireframe'

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

type VariantSpec = {
  id: string
  badgeType: BadgeType
  size: BadgeSize
  badgeStyle: BadgeStyle
}

const VARIANTS: VariantSpec[] = [
  // primary — 6 variants (3 sizes × 2 styles)
  { id: 'primary-sm-bordered',   badgeType: 'primary',    size: 'small',  badgeStyle: 'bordered' },
  { id: 'primary-sm-light',      badgeType: 'primary',    size: 'small',  badgeStyle: 'light' },
  { id: 'primary-md-bordered',   badgeType: 'primary',    size: 'medium', badgeStyle: 'bordered' },
  { id: 'primary-md-light',      badgeType: 'primary',    size: 'medium', badgeStyle: 'light' },
  { id: 'primary-lg-bordered',   badgeType: 'primary',    size: 'large',  badgeStyle: 'bordered' },
  { id: 'primary-lg-light',      badgeType: 'primary',    size: 'large',  badgeStyle: 'light' },
  // secondary — 6 variants
  { id: 'secondary-sm-bordered', badgeType: 'secondary',  size: 'small',  badgeStyle: 'bordered' },
  { id: 'secondary-sm-light',    badgeType: 'secondary',  size: 'small',  badgeStyle: 'light' },
  { id: 'secondary-md-bordered', badgeType: 'secondary',  size: 'medium', badgeStyle: 'bordered' },
  { id: 'secondary-md-light',    badgeType: 'secondary',  size: 'medium', badgeStyle: 'light' },
  { id: 'secondary-lg-bordered', badgeType: 'secondary',  size: 'large',  badgeStyle: 'bordered' },
  { id: 'secondary-lg-light',    badgeType: 'secondary',  size: 'large',  badgeStyle: 'light' },
  // tertiary — 6 variants
  { id: 'tertiary-sm-bordered',  badgeType: 'tertiary',   size: 'small',  badgeStyle: 'bordered' },
  { id: 'tertiary-sm-light',     badgeType: 'tertiary',   size: 'small',  badgeStyle: 'light' },
  { id: 'tertiary-md-bordered',  badgeType: 'tertiary',   size: 'medium', badgeStyle: 'bordered' },
  { id: 'tertiary-md-light',     badgeType: 'tertiary',   size: 'medium', badgeStyle: 'light' },
  { id: 'tertiary-lg-bordered',  badgeType: 'tertiary',   size: 'large',  badgeStyle: 'bordered' },
  { id: 'tertiary-lg-light',     badgeType: 'tertiary',   size: 'large',  badgeStyle: 'light' },
  // success — 6 variants
  { id: 'success-sm-bordered',   badgeType: 'success',    size: 'small',  badgeStyle: 'bordered' },
  { id: 'success-sm-light',      badgeType: 'success',    size: 'small',  badgeStyle: 'light' },
  { id: 'success-md-bordered',   badgeType: 'success',    size: 'medium', badgeStyle: 'bordered' },
  { id: 'success-md-light',      badgeType: 'success',    size: 'medium', badgeStyle: 'light' },
  { id: 'success-lg-bordered',   badgeType: 'success',    size: 'large',  badgeStyle: 'bordered' },
  { id: 'success-lg-light',      badgeType: 'success',    size: 'large',  badgeStyle: 'light' },
  // info — 6 variants
  { id: 'info-sm-bordered',      badgeType: 'info',       size: 'small',  badgeStyle: 'bordered' },
  { id: 'info-sm-light',         badgeType: 'info',       size: 'small',  badgeStyle: 'light' },
  { id: 'info-md-bordered',      badgeType: 'info',       size: 'medium', badgeStyle: 'bordered' },
  { id: 'info-md-light',         badgeType: 'info',       size: 'medium', badgeStyle: 'light' },
  { id: 'info-lg-bordered',      badgeType: 'info',       size: 'large',  badgeStyle: 'bordered' },
  { id: 'info-lg-light',         badgeType: 'info',       size: 'large',  badgeStyle: 'light' },
  // warning — 6 variants
  { id: 'warning-sm-bordered',   badgeType: 'warning',    size: 'small',  badgeStyle: 'bordered' },
  { id: 'warning-sm-light',      badgeType: 'warning',    size: 'small',  badgeStyle: 'light' },
  { id: 'warning-md-bordered',   badgeType: 'warning',    size: 'medium', badgeStyle: 'bordered' },
  { id: 'warning-md-light',      badgeType: 'warning',    size: 'medium', badgeStyle: 'light' },
  { id: 'warning-lg-bordered',   badgeType: 'warning',    size: 'large',  badgeStyle: 'bordered' },
  { id: 'warning-lg-light',      badgeType: 'warning',    size: 'large',  badgeStyle: 'light' },
  // danger — 6 variants
  { id: 'danger-sm-bordered',    badgeType: 'danger',     size: 'small',  badgeStyle: 'bordered' },
  { id: 'danger-sm-light',       badgeType: 'danger',     size: 'small',  badgeStyle: 'light' },
  { id: 'danger-md-bordered',    badgeType: 'danger',     size: 'medium', badgeStyle: 'bordered' },
  { id: 'danger-md-light',       badgeType: 'danger',     size: 'medium', badgeStyle: 'light' },
  { id: 'danger-lg-bordered',    badgeType: 'danger',     size: 'large',  badgeStyle: 'bordered' },
  { id: 'danger-lg-light',       badgeType: 'danger',     size: 'large',  badgeStyle: 'light' },
  // on-emphasis — light only (3 sizes)
  { id: 'on-emphasis-sm-light',  badgeType: 'on-emphasis', size: 'small',  badgeStyle: 'light' },
  { id: 'on-emphasis-md-light',  badgeType: 'on-emphasis', size: 'medium', badgeStyle: 'light' },
  { id: 'on-emphasis-lg-light',  badgeType: 'on-emphasis', size: 'large',  badgeStyle: 'light' },
  // outlined — light only (3 sizes)
  { id: 'outlined-sm-light',     badgeType: 'outlined',   size: 'small',  badgeStyle: 'light' },
  { id: 'outlined-md-light',     badgeType: 'outlined',   size: 'medium', badgeStyle: 'light' },
  { id: 'outlined-lg-light',     badgeType: 'outlined',   size: 'large',  badgeStyle: 'light' },
]

export function BadgesRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Badge — captured in {CAPTURE_BRAND}</h1>
      <p className="text-sm text-klp-fg-muted">
        9 types × 3 sizes × 2 styles (on-emphasis and outlined: light only) = 48 variants
      </p>

      <div className="grid grid-cols-4 gap-4">
        {VARIANTS.map(({ id, badgeType, size, badgeStyle }) => (
          <div
            key={id}
            data-variant-id={id}
            className="flex flex-col items-center justify-center gap-2 rounded-[4px] border border-klp-border-default p-4"
          >
            <span className="text-xs text-klp-fg-muted">{id}</span>
            <Badge
              badgeType={badgeType}
              size={size}
              badgeStyle={badgeStyle}
              leftIcon={<CheckIcon />}
              rightIcon={<CheckIcon />}
            >
              Label
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
