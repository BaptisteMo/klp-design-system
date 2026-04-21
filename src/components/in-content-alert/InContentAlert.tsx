import * as React from 'react'
import { cva } from 'class-variance-authority'
import { AlertCircle, CheckCircle2, HelpCircle, Info } from 'lucide-react'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// root layer — derived from spec.variants[].layers.root
// fill → bg-klp-bg-* (per content)
// paddingX → px-klp-size-* (per size)
// paddingY → py-klp-size-* (per size)
// itemSpacing → gap-klp-size-xs (same across all variants)
// cornerRadius:
//   lg: literal "16px" → rounded-[16px]
//   md: token --klp-size-s → rounded-[var(--klp-size-s)]
//   sm: token --klp-size-xs → rounded-[var(--klp-size-xs)]
// ---------------------------------------------------------------------------
const rootVariants = cva('flex flex-col', {
  variants: {
    content: {
      info:    'bg-klp-bg-info',
      success: 'bg-klp-bg-success',
      danger:  'bg-klp-bg-danger',
      warning: 'bg-klp-bg-warning',
    },
    size: {
      lg: 'px-klp-size-m py-klp-size-m gap-klp-size-xs rounded-klp-xl',
      md: 'px-klp-size-s py-klp-size-s gap-klp-size-xs rounded-[var(--klp-size-s)]',
      sm: 'px-klp-size-xs py-klp-size-xs gap-klp-size-xs rounded-klp-l',
    },
  },
  defaultVariants: { content: 'info', size: 'md' },
})

// ---------------------------------------------------------------------------
// header layer — horizontal flex row; itemSpacing is a literal "8px" (same all variants)
// ---------------------------------------------------------------------------
const headerVariants = cva('flex flex-row items-center gap-[8px]')

// ---------------------------------------------------------------------------
// icon layer — color → text-klp-fg-* (per content); size literal 20px via [&>svg]
// ---------------------------------------------------------------------------
const iconVariants = cva('[&>svg]:h-[20px] [&>svg]:w-[20px] shrink-0', {
  variants: {
    content: {
      info:    'text-klp-fg-info',
      success: 'text-klp-fg-success',
      danger:  'text-klp-fg-danger',
      warning: 'text-klp-fg-warning',
    },
  },
  defaultVariants: { content: 'info' },
})

// ---------------------------------------------------------------------------
// title layer — color → text-klp-fg-* (per content)
// fontSize: --klp-font-size-text-medium → text-klp-text-medium (font-size- dropped)
// fontFamily: --klp-font-family-label → font-klp-label
// fontWeight: --klp-font-weight-label-bold → font-klp-label-bold (font-weight- dropped)
// (same across all sizes; only color varies by content)
// ---------------------------------------------------------------------------
const titleVariants = cva('text-klp-text-medium font-klp-label font-klp-label-bold', {
  variants: {
    content: {
      info:    'text-klp-fg-info',
      success: 'text-klp-fg-success',
      danger:  'text-klp-fg-danger',
      warning: 'text-klp-fg-warning',
    },
  },
  defaultVariants: { content: 'info' },
})

// ---------------------------------------------------------------------------
// body layer — color: --klp-fg-default → text-klp-fg-default (same all variants)
// fontSize: --klp-font-size-text-medium → text-klp-text-medium
// fontFamily: --klp-font-family-body → font-klp-body
// fontWeight: --klp-font-weight-body → font-klp-body (font-weight- dropped)
// ---------------------------------------------------------------------------
const bodyVariants = cva('text-klp-fg-default text-klp-text-medium font-klp-body font-klp-body')

// ---------------------------------------------------------------------------
// Content type → Lucide icon mapping
// spec literals: info → Info, check-circle-2 → CheckCircle2,
//                alert-circle → AlertCircle, help-circle → HelpCircle
// ---------------------------------------------------------------------------
const CONTENT_ICONS = {
  info:    <Info    aria-hidden="true" strokeWidth={1.5} />,
  success: <CheckCircle2 aria-hidden="true" strokeWidth={1.5} />,
  danger:  <AlertCircle  aria-hidden="true" strokeWidth={1.5} />,
  warning: <HelpCircle   aria-hidden="true" strokeWidth={1.5} />,
} as const

// ---------------------------------------------------------------------------
// Public props
// ---------------------------------------------------------------------------
export interface InContentAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * @propClass optional
   */
  content?: 'info' | 'success' | 'danger' | 'warning'
  /**
   * @propClass optional
   */
  size?: 'lg' | 'md' | 'sm'
  /**
   * @propClass required
   */
  title: string
  /**
   * @propClass optional
   */
  body?: React.ReactNode
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const InContentAlert = React.forwardRef<HTMLDivElement, InContentAlertProps>(
  ({ className, content = 'info', size = 'md', title, body, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(rootVariants({ content, size }), className)}
        {...props}
      >
        {/* header: icon + title */}
        <div className={headerVariants()}>
          <span className={iconVariants({ content })}>
            {CONTENT_ICONS[content]}
          </span>
          <span className={titleVariants({ content })}>{title}</span>
        </div>

        {/* body (optional) */}
        {body && <p className={bodyVariants()}>{body}</p>}
      </div>
    )
  }
)
InContentAlert.displayName = 'InContentAlert'

export { rootVariants, headerVariants, iconVariants, titleVariants, bodyVariants }
