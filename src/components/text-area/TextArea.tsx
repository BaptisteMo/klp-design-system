import * as React from 'react'
import { cva } from 'class-variance-authority'
import { Info } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'

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
// cornerRadius: rounded-klp-l, itemSpacing: gap-klp-size-m
//
// Real focus styling: `focus-within:*` on the wrapper lights up the brand
// border + ring whenever the inner <textarea> is focused, regardless of the
// derived cva state. `group` lets children react via `group-focus-within:*`.
// The explicit `focus` cva variant mirrors the same styling so the playground
// matrix still renders the focus ring when the state prop is locked.
// ---------------------------------------------------------------------------
const inputVariants = cva(
  'group relative flex flex-col gap-klp-size-m rounded-klp-l border overflow-hidden pt-klp-size-m pr-klp-size-m pb-klp-size-m pl-klp-size-m transition-[colors,box-shadow] focus-within:border-klp-border-brand focus-within:ring-4 focus-within:ring-klp-bg-brand-low',
  {
    variants: {
      feature: {
        simple: '',
        'rich-text': '',
      },
      state: {
        default: 'bg-klp-bg-default border-klp-border-default',
        focus: 'bg-klp-bg-default border-klp-border-brand ring-4 ring-klp-bg-brand-low',
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
// Public types
// ---------------------------------------------------------------------------

export type TextAreaResize = 'none' | 'vertical' | 'horizontal' | 'both'

/** A single action in the rich-text toolbar. Renders as a tertiary icon Button. */
export interface ToolbarAction {
  /** Accessible label (used as aria-label + title for the button) */
  label: string
  /** Icon element — pass a lucide-react icon, e.g. <Bold strokeWidth={1.5} /> */
  icon: React.ReactNode
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** Disabled state */
  disabled?: boolean
  /** Stable key (falls back to index when omitted) */
  key?: string
}

export type TextAreaState = 'default' | 'focus' | 'filled' | 'danger' | 'success' | 'disable'

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /** Feature variant: plain textarea or rich-text with toolbar + action bar */
  feature?: 'simple' | 'rich-text'
  /**
   * Explicit visual state override. When omitted, state is derived from
   * native attributes (disabled → "disable", aria-invalid → "danger") and
   * from focus/value events (hasValue → "filled", isFocused → "focus").
   */
  state?: TextAreaState
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
  /** Rich-text toolbar actions (feature=rich-text only). Each action renders
   *  as a tertiary icon Button with its icon + aria-label. */
  toolbarActions?: ToolbarAction[]
  /** Extra className forwarded to the root wrapper */
  className?: string
  /** Resize handle behavior on the textarea (mirrors Radix Themes' TextArea API) */
  resize?: TextAreaResize
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      feature = 'simple',
      state: stateProp,
      label,
      showHeader = true,
      showInfoIcon = true,
      placeholder,
      id,
      toolbarActions,
      className,
      disabled,
      resize = 'none',
      'aria-invalid': ariaInvalid,
      onFocus,
      onBlur,
      onChange,
      defaultValue,
      value,
      ...props
    },
    ref
  ) => {
    // Track interactive state so `focus` and `filled` derive automatically
    // when no explicit stateProp is passed.
    const [isFocused, setIsFocused] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState<string>(
      defaultValue !== undefined ? String(defaultValue) : ''
    )
    const isControlled = value !== undefined
    const currentValue = isControlled ? String(value) : internalValue
    const hasValue = currentValue.length > 0

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setInternalValue(e.target.value)
      onChange?.(e)
    }

    // Derive state with explicit priority:
    // 1. stateProp wins (used by playground matrix + consumer overrides)
    // 2. disabled / aria-invalid (declarative HTML state)
    // 3. hasValue → filled
    // 4. isFocused → focus
    // 5. default
    const resolvedState: TextAreaState = (() => {
      if (stateProp) return stateProp
      if (disabled) return 'disable'
      if (ariaInvalid === true || ariaInvalid === 'true') return 'danger'
      if (hasValue) return 'filled'
      if (isFocused) return 'focus'
      return 'default'
    })()

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

        <div
          className={inputVariants({ feature, state: resolvedState })}
          style={{ resize }}
        >
          {feature === 'rich-text' && (
            <div className={toolbarVariants({ feature, state: resolvedState })}>
              {toolbarActions?.map((action, index) => (
                <Button
                  key={action.key ?? index}
                  variant="tertiary"
                  size="icon"
                  aria-label={action.label}
                  title={action.label}
                  onClick={action.onClick}
                  disabled={action.disabled || resolvedState === 'disable'}
                >
                  {action.icon}
                </Button>
              ))}
            </div>
          )}

          <textarea
            ref={ref}
            id={inputId}
            disabled={resolvedState === 'disable' || disabled}
            aria-invalid={ariaInvalid}
            placeholder={placeholder}
            style={{ resize: 'none' }}
            className={cn(
              'block w-full flex-1 bg-transparent outline-none',
              placeholderVariants({ feature, state: resolvedState })
            )}
            value={isControlled ? value : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />

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
}
