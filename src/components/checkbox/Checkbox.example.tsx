import { useState } from 'react'
import { Checkbox } from './Checkbox'

/**
 * Checkbox usage example.
 *
 * The Checkbox component wraps Radix Checkbox.Root + Checkbox.Indicator.
 * Pass `checked` (boolean | 'indeterminate') and `onCheckedChange` to
 * control the state. Associate with a label via `aria-label` or `<label htmlFor>`.
 */
export function CheckboxExample() {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(false)

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Uncontrolled */}
      <div className="flex items-center gap-2">
        <Checkbox id="uncontrolled-demo" aria-label="Accept terms" />
        <label
          htmlFor="uncontrolled-demo"
          className="text-klp-text-medium font-klp-label text-klp-fg-default cursor-pointer select-none"
        >
          Accept terms (uncontrolled)
        </label>
      </div>

      {/* Controlled */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="controlled-demo"
          checked={checked}
          onCheckedChange={(value) => setChecked(value === true ? true : value === 'indeterminate' ? 'indeterminate' : false)}
        />
        <label
          htmlFor="controlled-demo"
          className="text-klp-text-medium font-klp-label text-klp-fg-default cursor-pointer select-none"
        >
          Controlled: {String(checked)}
        </label>
      </div>

      {/* Indeterminate */}
      <div className="flex items-center gap-2">
        <Checkbox id="mixed-demo" checked="indeterminate" aria-label="Indeterminate" />
        <label
          htmlFor="mixed-demo"
          className="text-klp-text-medium font-klp-label text-klp-fg-default cursor-pointer select-none"
        >
          Indeterminate (mixed)
        </label>
      </div>

      {/* Disabled */}
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-demo" disabled aria-label="Disabled checkbox" />
        <label
          htmlFor="disabled-demo"
          className="text-klp-text-medium font-klp-label text-klp-fg-disable cursor-not-allowed select-none"
        >
          Disabled
        </label>
      </div>
    </div>
  )
}
