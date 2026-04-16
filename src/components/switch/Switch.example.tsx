import { Switch } from './Switch'

/**
 * Switch example — copy this into your app.
 *
 * The Switch renders as a native button with role=switch and aria-checked.
 * Always pair with a visible label (or aria-label).
 */
export function SwitchExample() {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="notifications"
        className="text-klp-text-medium font-klp-label text-klp-fg-default"
      >
        Enable notifications
      </label>
      <Switch id="notifications" defaultChecked aria-label="Enable notifications" />
    </div>
  )
}
