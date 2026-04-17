import * as React from 'react'
import { cva } from 'class-variance-authority'
import { AlertTriangle, Check, Info, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'

// ---------------------------------------------------------------------------
// Root layer — derived from spec.variants[].layers.root
// fill → bg-klp-*  |  stroke → border + border-klp-*  |  paddingX → px-klp-size-*
// paddingY → py-klp-size-*  |  itemSpacing → gap-klp-size-*
// cornerRadius token is null for all variants (tokenGap); raw value 8px → rounded-[8px]
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'flex flex-row items-center rounded-klp-l border bg-klp-bg-default shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10)]',
  {
    variants: {
      state: {
        danger:      'border-klp-border-danger-emphasis',
        warning:     'border-klp-border-warning-emphasis',
        information: 'border-klp-border-info-emphasis',
        success:     'border-klp-border-success',
      },
      size: {
        sm: 'px-klp-size-xs py-klp-size-xs gap-klp-size-xs',
        md: 'px-klp-size-m  py-klp-size-m  gap-klp-size-s',
        lg: 'px-klp-size-l  py-klp-size-l  gap-klp-size-m',
      },
    },
    defaultVariants: { state: 'information', size: 'md' },
  }
)

// ---------------------------------------------------------------------------
// icon-highlight layer — fill changes per state; size/radius are literals
// ---------------------------------------------------------------------------
const iconHighlightVariants = cva(
  'flex shrink-0 items-center justify-center rounded-klp-m h-[36px] w-[36px] p-[8px]',
  {
    variants: {
      state: {
        danger:      'bg-klp-bg-danger',
        warning:     'bg-klp-bg-warning',
        information: 'bg-klp-bg-info',
        success:     'bg-klp-bg-success',
      },
    },
    defaultVariants: { state: 'information' },
  }
)

// ---------------------------------------------------------------------------
// icon layer — color (text-klp-*) per state; icon size is a literal (20px)
// ---------------------------------------------------------------------------
const iconVariants = cva('[&>svg]:h-[20px] [&>svg]:w-[20px]', {
  variants: {
    state: {
      danger:      'text-klp-fg-danger',
      warning:     'text-klp-fg-warning',
      information: 'text-klp-fg-info',
      success:     'text-klp-fg-success-contrasted',
    },
  },
  defaultVariants: { state: 'information' },
})

// ---------------------------------------------------------------------------
// content layer — color + fontSize + fontFamily + fontWeight per size/variant
// color: --klp-fg-default (same across all variants)
// fontSize: sm → text-klp-text-medium, md/lg → text-klp-text-large
// fontFamily: --klp-font-family-body → font-klp-body
// fontWeight: --klp-font-weight-body → font-klp-body (Tailwind v4 font-weight-* maps to font-*)
// ---------------------------------------------------------------------------
const contentVariants = cva('flex-1 text-klp-fg-default font-klp-body font-klp-body', {
  variants: {
    size: {
      sm: 'text-klp-text-medium',
      md: 'text-klp-text-large',
      lg: 'text-klp-text-large',
    },
  },
  defaultVariants: { size: 'md' },
})

// ---------------------------------------------------------------------------
// State → Lucide icon mapping
// ---------------------------------------------------------------------------
const STATE_ICONS = {
  danger:      <X aria-hidden="true" strokeWidth={1.5} />,
  warning:     <AlertTriangle aria-hidden="true" strokeWidth={1.5} />,
  information: <Info aria-hidden="true" strokeWidth={1.5} />,
  success:     <Check aria-hidden="true" strokeWidth={1.5} />,
} as const

// ---------------------------------------------------------------------------
// Public props
// ---------------------------------------------------------------------------
export interface FloatingAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: 'danger' | 'warning' | 'information' | 'success'
  size?: 'sm' | 'md' | 'lg'
  onDismiss?: () => void
  children?: React.ReactNode
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const FloatingAlert = React.forwardRef<HTMLDivElement, FloatingAlertProps>(
  (
    {
      className,
      state = 'information',
      size = 'md',
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(rootVariants({ state, size }), className)}
        {...props}
      >
        {/* icon-highlight + icon */}
        <span className={iconHighlightVariants({ state })}>
          <span className={iconVariants({ state })}>
            {STATE_ICONS[state]}
          </span>
        </span>

        {/* content */}
        <span className={contentVariants({ size })}>
          {children}
        </span>

        {/* dismiss-button — reuses the DS Button (tertiary × icon) */}
        {onDismiss && (
          <Button
            variant="tertiary"
            size="icon"
            aria-label="Dismiss"
            onClick={onDismiss}
          >
            <X strokeWidth={1.5} />
          </Button>
        )}
      </div>
    )
  }
)
FloatingAlert.displayName = 'FloatingAlert'

export {
  rootVariants,
  iconHighlightVariants,
  iconVariants,
  contentVariants,
}
