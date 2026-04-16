import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Info } from 'lucide-react'
import { cn } from '@/lib/cn'

// ─── root layer ───────────────────────────────────────────────────────────────
// root: flex-col container; gap is uniform across all variants (--klp-size-xs)
const rootVariants = cva('flex flex-col gap-klp-size-xs', {
  variants: {
    size: {
      large: '',
      medium: '',
      small: '',
    },
    state: {
      default: '',
      filled: '',
      focused: '',
      success: '',
      danger: '',
      disable: '',
    },
  },
  defaultVariants: { size: 'medium', state: 'default' },
})

// ─── head layer ───────────────────────────────────────────────────────────────
// head: row containing label + optional info icon; gap --klp-size-xs (uniform)
const headVariants = cva('flex flex-row items-center gap-klp-size-xs', {
  variants: {
    size: {
      large: '',
      medium: '',
      small: '',
    },
    state: {
      default: '',
      filled: '',
      focused: '',
      success: '',
      danger: '',
      disable: '',
    },
  },
  defaultVariants: { size: 'medium', state: 'default' },
})

// ─── label layer ──────────────────────────────────────────────────────────────
// label color: always --klp-fg-default across all variants
// fontSize+weight differ by size:
//   large  → text-klp-text-large + font-klp-label-bold
//   medium → text-klp-text-large + font-klp-label
//   small  → text-klp-text-medium + font-klp-label
const labelVariants = cva('font-klp-label text-klp-fg-default', {
  variants: {
    size: {
      large: 'text-klp-text-large font-klp-label-bold',
      medium: 'text-klp-text-large font-klp-label',
      small: 'text-klp-text-medium font-klp-label',
    },
    state: {
      default: '',
      filled: '',
      focused: '',
      success: '',
      danger: '',
      disable: '',
    },
  },
  defaultVariants: { size: 'medium', state: 'default' },
})

// ─── info-icon layer ──────────────────────────────────────────────────────────
// color: --klp-fg-brand in all non-disable states; disable still uses fg-brand token
// (disable variant in Figma shows fg-brand but maps to a muted value via brand switching)
const infoIconVariants = cva(
  'inline-flex shrink-0 items-center justify-center text-klp-fg-brand',
  {
    variants: {
      state: {
        default: '',
        filled: '',
        focused: '',
        success: '',
        danger: '',
        disable: '',
      },
    },
    defaultVariants: { state: 'default' },
  }
)

// ─── input-box layer ──────────────────────────────────────────────────────────
// fill: bg-klp-bg-default for all except disable (bg-klp-bg-disable)
// stroke: varies by state; cornerRadius: rounded-klp-l (uniform)
// padding varies by size; gap varies by size
const inputBoxVariants = cva(
  // Base + interactive focus ring: 4px brand-low ring on real focus, regardless
  // of derived cva state (so the ring stays visible after the user starts
  // typing, when state would have flipped from focused → filled).
  // `group` enables children (icon-left, icon-right) to react to focus-within
  // via `group-focus-within:` selectors.
  'group flex flex-row items-center border rounded-klp-l transition-[colors,box-shadow] focus-within:ring-4 focus-within:ring-klp-bg-brand-low',
  {
    variants: {
      size: {
        large: 'px-klp-size-m py-klp-size-m gap-klp-size-s',
        medium: 'px-klp-size-s py-klp-size-s gap-klp-size-s',
        small: 'px-klp-size-xs py-klp-size-xs gap-klp-size-xs',
      },
      state: {
        default: 'bg-klp-bg-default border-klp-border-default',
        filled: 'bg-klp-bg-default border-klp-border-brand',
        // Static demo: when state="focused" is locked via prop (no real focus),
        // mirror the focus ring so the playground grid still shows the effect.
        focused: 'bg-klp-bg-default border-klp-border-brand ring-4 ring-klp-bg-brand-low',
        success: 'bg-klp-bg-default border-klp-border-success-emphasis',
        danger: 'bg-klp-bg-default border-klp-border-danger-emphasis',
        disable: 'bg-klp-bg-disable border-klp-border-default',
      },
    },
    defaultVariants: { size: 'medium', state: 'default' },
  }
)

// ─── icon-left layer ──────────────────────────────────────────────────────────
// color: --klp-fg-subtle in non-disable states; --klp-fg-disable in disable.
// On real focus (input-box has focus-within), icon flips to --klp-fg-brand —
// kept as long as the field is focused (regardless of derived state).
const iconLeftVariants = cva(
  'inline-flex shrink-0 items-center justify-center group-focus-within:text-klp-fg-brand',
  {
    variants: {
      state: {
        default: 'text-klp-fg-subtle',
        filled: 'text-klp-fg-subtle',
        // Static demo: state="focused" lock mirrors the focus-within behavior.
        focused: 'text-klp-fg-brand',
        success: 'text-klp-fg-subtle',
        danger: 'text-klp-fg-subtle',
        disable: 'text-klp-fg-disable',
      },
    },
    defaultVariants: { state: 'default' },
  }
)

// ─── placeholder layer ────────────────────────────────────────────────────────
// color: --klp-fg-subtle for default/focused; --klp-fg-default for filled/success/danger; --klp-fg-disable for disable
// fontSize: --klp-font-size-text-medium (uniform across all variants)
// fontFamily: --klp-font-family-label, fontWeight: --klp-font-weight-label (uniform)
const placeholderVariants = cva(
  'flex-1 font-klp-label text-klp-text-medium font-klp-label bg-transparent outline-none border-none min-w-0 placeholder:text-klp-fg-subtle',
  {
    variants: {
      state: {
        default: 'text-klp-fg-subtle',
        filled: 'text-klp-fg-default',
        focused: 'text-klp-fg-subtle',
        success: 'text-klp-fg-default',
        danger: 'text-klp-fg-default',
        disable: 'text-klp-fg-disable',
      },
    },
    defaultVariants: { state: 'default' },
  }
)

// ─── icon-right layer ─────────────────────────────────────────────────────────
// Same color rules as icon-left including the focus-within → brand flip.
const iconRightVariants = cva(
  'inline-flex shrink-0 items-center justify-center group-focus-within:text-klp-fg-brand',
  {
    variants: {
      state: {
        default: 'text-klp-fg-subtle',
        filled: 'text-klp-fg-subtle',
        focused: 'text-klp-fg-brand',
        success: 'text-klp-fg-subtle',
        danger: 'text-klp-fg-subtle',
        disable: 'text-klp-fg-disable',
      },
    },
    defaultVariants: { state: 'default' },
  }
)

// ─── description layer ────────────────────────────────────────────────────────
// In all captured variants description has `display: none` (Figma BOOLEAN prop, default false)
// We render it only when `showDescription` + `description` prop is provided
const descriptionVariants = cva(
  'font-klp-label text-klp-text-medium font-klp-label',
  {
    variants: {
      state: {
        default: 'text-klp-fg-subtle',
        filled: 'text-klp-fg-subtle',
        focused: 'text-klp-fg-subtle',
        success: 'text-klp-fg-subtle',
        danger: 'text-klp-fg-danger',
        disable: 'text-klp-fg-disable',
      },
    },
    defaultVariants: { state: 'default' },
  }
)

// ─── Public types ─────────────────────────────────────────────────────────────

type InputSize = 'large' | 'medium' | 'small'
type InputState = 'default' | 'filled' | 'focused' | 'success' | 'danger' | 'disable'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputBoxVariants> {
  /** Label text displayed above the input */
  label?: string
  /** Helper / description text displayed below the input */
  description?: string
  /** Show the optional info icon next to the label */
  showInfoIcon?: boolean
  /** Icon rendered on the left inside the input box */
  iconLeft?: React.ReactNode
  /** Icon rendered on the right inside the input box */
  iconRight?: React.ReactNode
  /** Visual size of the input */
  size?: InputSize
  /**
   * Explicit visual state override. When omitted the component derives state
   * from native HTML attributes (disabled → "disable", aria-invalid → "danger")
   * and focus/value events.
   */
  state?: InputState
  /** Additional className applied to the outer root wrapper */
  className?: string
  /** Additional className applied to the input-box container */
  inputBoxClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      showInfoIcon = false,
      iconLeft,
      iconRight,
      size = 'medium',
      state: stateProp,
      className,
      inputBoxClassName,
      id,
      disabled,
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
    // Track interactive state so `focused` and `filled` derive automatically
    // when no explicit stateProp is passed. Controlled vs uncontrolled value
    // tracking: if `value` is provided we read it; otherwise we shadow it
    // internally from defaultValue + onChange.
    const [isFocused, setIsFocused] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState<string>(
      defaultValue !== undefined ? String(defaultValue) : ''
    )
    const isControlled = value !== undefined
    const currentValue = isControlled ? String(value) : internalValue
    const hasValue = currentValue.length > 0

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value)
      onChange?.(e)
    }

    // Derive state with explicit priority:
    // 1. stateProp wins (used by playground variant grid + consumer overrides)
    // 2. disabled / aria-invalid (declarative HTML state)
    // 3. hasValue → filled  (so typed text gets the readable color)
    // 4. isFocused → focused (empty + focused)
    // 5. default
    const derivedState: InputState = (() => {
      if (stateProp) return stateProp
      if (disabled) return 'disable'
      if (ariaInvalid === true || ariaInvalid === 'true') return 'danger'
      if (hasValue) return 'filled'
      if (isFocused) return 'focused'
      return 'default'
    })()

    const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

    return (
      <div className={cn(rootVariants({ size, state: derivedState }), className)}>
        {/* head layer */}
        {label && (
          <div className={headVariants({ size, state: derivedState })}>
            <label
              htmlFor={inputId}
              className={labelVariants({ size, state: derivedState })}
            >
              {label}
            </label>
            {showInfoIcon && (
              <span
                aria-hidden="true"
                className={infoIconVariants({ state: derivedState })}
              >
                {/* default info icon (16px); color flows through currentColor from parent */}
                <Info className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden="true" />
              </span>
            )}
          </div>
        )}

        {/* input-box layer */}
        <div className={cn(inputBoxVariants({ size, state: derivedState }), inputBoxClassName)}>
          {/* icon-left layer */}
          {iconLeft && (
            <span
              aria-hidden="true"
              className={iconLeftVariants({ state: derivedState })}
            >
              {iconLeft}
            </span>
          )}

          {/* placeholder / native input (the "placeholder" anatomy layer) */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={ariaInvalid}
            className={cn(placeholderVariants({ state: derivedState }))}
            value={isControlled ? value : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />

          {/* icon-right layer */}
          {iconRight && (
            <span
              aria-hidden="true"
              className={iconRightVariants({ state: derivedState })}
            >
              {iconRight}
            </span>
          )}
        </div>

        {/* description layer */}
        {description && (
          <p className={descriptionVariants({ state: derivedState })}>
            {description}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export {
  rootVariants,
  headVariants,
  labelVariants,
  infoIconVariants,
  inputBoxVariants,
  iconLeftVariants,
  placeholderVariants,
  iconRightVariants,
  descriptionVariants,
}
