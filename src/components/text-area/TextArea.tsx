import * as React from 'react'
import { cva } from 'class-variance-authority'
import { Info } from 'lucide-react'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// root layer — vertical flex wrapper; gap driven by --klp-size-m (all states)
// ---------------------------------------------------------------------------
const rootVariants = cva('flex flex-col gap-klp-size-m', {
  variants: {
    feature: {
      simple: '',
      'rich-text': '',
    },
    state: {
      default: '',
      focus: '',
      filled: '',
      danger: '',
      success: '',
      disable: '',
    },
  },
  defaultVariants: { feature: 'simple', state: 'default' },
})

// ---------------------------------------------------------------------------
// head layer — header row: label + optional info icon; gap --klp-size-xs
// ---------------------------------------------------------------------------
const headVariants = cva('flex items-center gap-klp-size-xs', {
  variants: {
    feature: {
      simple: '',
      'rich-text': '',
    },
    state: {
      default: '',
      focus: '',
      filled: '',
      danger: '',
      success: '',
      disable: '',
    },
  },
  defaultVariants: { feature: 'simple', state: 'default' },
})

// ---------------------------------------------------------------------------
// label layer — field label text
// All variants: --klp-fg-default / text-medium / font-family-label / font-weight-label
// ---------------------------------------------------------------------------
const labelVariants = cva(
  'text-klp-text-medium font-klp-label font-klp-label text-klp-fg-default leading-[24px]',
  {
    variants: {
      feature: {
        simple: '',
        'rich-text': '',
      },
      state: {
        default: 'text-klp-fg-default',
        focus: 'text-klp-fg-default',
        filled: 'text-klp-fg-default',
        danger: 'text-klp-fg-default',
        success: 'text-klp-fg-default',
        disable: 'text-klp-fg-default',
      },
    },
    defaultVariants: { feature: 'simple', state: 'default' },
  }
)

// ---------------------------------------------------------------------------
// info-icon layer — info icon; color --klp-fg-muted (all variants)
// ---------------------------------------------------------------------------
const infoIconVariants = cva('inline-flex shrink-0 items-center justify-center text-klp-fg-muted', {
  variants: {
    feature: {
      simple: '',
      'rich-text': '',
    },
    state: {
      default: 'text-klp-fg-muted',
      focus: 'text-klp-fg-muted',
      filled: 'text-klp-fg-muted',
      danger: 'text-klp-fg-muted',
      success: 'text-klp-fg-muted',
      disable: 'text-klp-fg-muted',
    },
  },
  defaultVariants: { feature: 'simple', state: 'default' },
})

// ---------------------------------------------------------------------------
// input layer — main textarea container; fill + stroke change per state
// Padding: pt-klp-size-m pr-klp-size-m pb-klp-size-m pl-klp-size-m (all states)
// cornerRadius literal: 8px → rounded-[8px]
// itemSpacing (gap between toolbar and textarea): gap-klp-size-m
// ---------------------------------------------------------------------------
const inputVariants = cva(
  'flex flex-col gap-klp-size-m rounded-klp-l border pt-klp-size-m pr-klp-size-m pb-klp-size-m pl-klp-size-m',
  {
    variants: {
      feature: {
        simple: '',
        'rich-text': '',
      },
      state: {
        default: 'bg-klp-bg-default border-klp-border-default',
        focus: 'bg-klp-bg-default border-klp-border-brand',
        filled: 'bg-klp-bg-default border-klp-border-brand',
        danger: 'bg-klp-bg-default border-klp-border-danger-emphasis',
        success: 'bg-klp-bg-default border-klp-border-success-emphasis',
        disable: 'bg-klp-bg-inset border-klp-border-default',
      },
    },
    defaultVariants: { feature: 'simple', state: 'default' },
  }
)

// ---------------------------------------------------------------------------
// toolbar layer — rich-text formatting row; hidden for feature=simple
// itemSpacing: gap-klp-size-xs
// ---------------------------------------------------------------------------
const toolbarVariants = cva('flex items-center gap-klp-size-xs', {
  variants: {
    feature: {
      simple: 'hidden',
      'rich-text': 'flex',
    },
    state: {
      default: '',
      focus: '',
      filled: '',
      danger: '',
      success: '',
      disable: '',
    },
  },
  defaultVariants: { feature: 'simple', state: 'default' },
})

// ---------------------------------------------------------------------------
// placeholder layer — placeholder/text content inside the input area
// Color varies per state
// ---------------------------------------------------------------------------
const placeholderVariants = cva(
  'text-klp-text-medium font-klp-label leading-[24px]',
  {
    variants: {
      feature: {
        simple: '',
        'rich-text': '',
      },
      state: {
        default: 'text-klp-fg-subtle',
        focus: 'text-klp-fg-default',
        filled: 'text-klp-fg-default',
        danger: 'text-klp-fg-danger-contrasted',
        success: 'text-klp-fg-default',
        disable: 'text-klp-fg-muted',
      },
    },
    defaultVariants: { feature: 'simple', state: 'default' },
  }
)

// ---------------------------------------------------------------------------
// action-bar layer — bottom confirm/cancel row; hidden for feature=simple
// itemSpacing: gap-klp-size-xs
// ---------------------------------------------------------------------------
const actionBarVariants = cva('flex items-center gap-klp-size-xs', {
  variants: {
    feature: {
      simple: 'hidden',
      'rich-text': 'flex',
    },
    state: {
      default: '',
      focus: '',
      filled: '',
      danger: '',
      success: '',
      disable: '',
    },
  },
  defaultVariants: { feature: 'simple', state: 'default' },
})

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /** Feature variant: plain textarea or rich-text with toolbar + action bar */
  feature?: 'simple' | 'rich-text'
  /** Visual state — maps to Figma variant axis */
  state?: 'default' | 'focus' | 'filled' | 'danger' | 'success' | 'disable'
  /** Field label */
  label?: string
  /** Show the header row (label + optional info icon). Matches Figma Show header prop. */
  showHeader?: boolean
  /** Show the info icon next to the label. Matches Figma Show info icon prop. */
  showInfoIcon?: boolean
  /** Placeholder text shown inside the input area */
  placeholder?: string
  /** Accessible id linking label → textarea */
  id?: string
  /** Slot for the toolbar content (feature=rich-text only) */
  toolbar?: React.ReactNode
  /** Slot for the action bar content (feature=rich-text only) */
  actionBar?: React.ReactNode
  /** Extra className forwarded to the root wrapper */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      feature = 'simple',
      state = 'default',
      label,
      showHeader = true,
      showInfoIcon = true,
      placeholder,
      id,
      toolbar,
      actionBar,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const resolvedState: TextAreaProps['state'] = disabled ? 'disable' : state
    const inputId = id ?? 'textarea'

    return (
      <div className={cn(rootVariants({ feature, state: resolvedState }), className)}>
        {showHeader && (
          <div className={headVariants({ feature, state: resolvedState })}>
            {label && (
              <label
                htmlFor={inputId}
                className={labelVariants({ feature, state: resolvedState })}
              >
                {label}
              </label>
            )}
            {showInfoIcon && (
              <span
                className={infoIconVariants({ feature, state: resolvedState })}
                aria-label="More information"
              >
                <Info aria-hidden="true" className="h-[20px] w-[20px]" strokeWidth={1.5} />
              </span>
            )}
          </div>
        )}

        <div className={inputVariants({ feature, state: resolvedState })}>
          {feature === 'rich-text' && (
            <div className={toolbarVariants({ feature, state: resolvedState })}>
              {toolbar}
            </div>
          )}

          <textarea
            ref={ref}
            id={inputId}
            disabled={resolvedState === 'disable' || disabled}
            placeholder={placeholder}
            className={cn(
              'w-full resize-none bg-transparent outline-none',
              placeholderVariants({ feature, state: resolvedState })
            )}
            {...props}
          />

          {feature === 'rich-text' && (
            <div className={actionBarVariants({ feature, state: resolvedState })}>
              {actionBar}
            </div>
          )}
        </div>
      </div>
    )
  }
)
TextArea.displayName = 'TextArea'

export {
  rootVariants,
  headVariants,
  labelVariants,
  infoIconVariants,
  inputVariants,
  toolbarVariants,
  placeholderVariants,
  actionBarVariants,
}
