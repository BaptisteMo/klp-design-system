import { RadioGroup, RadioItem } from './Radio'

export function RadioExample() {
  return (
    <RadioGroup defaultValue="option-1" aria-label="Example radio group">
      <div className="flex items-center gap-klp-size-xs">
        <RadioItem value="option-1" id="option-1" />
        <label htmlFor="option-1" className="font-klp-label text-klp-fg-default cursor-pointer">
          Option 1
        </label>
      </div>
      <div className="flex items-center gap-klp-size-xs">
        <RadioItem value="option-2" id="option-2" />
        <label htmlFor="option-2" className="font-klp-label text-klp-fg-default cursor-pointer">
          Option 2
        </label>
      </div>
      <div className="flex items-center gap-klp-size-xs">
        <RadioItem value="option-3" id="option-3" disabled />
        <label htmlFor="option-3" className="font-klp-label text-klp-fg-disable cursor-not-allowed">
          Option 3 (disabled)
        </label>
      </div>
    </RadioGroup>
  )
}
