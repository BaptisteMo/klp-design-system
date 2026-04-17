import { TextArea } from './TextArea'

export function TextAreaExample() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-md">
      {/* Simple — default state */}
      <TextArea
        feature="simple"
        state="default"
        label="Label"
        showHeader
        showInfoIcon
        placeholder="Placeholder text"
        id="example-simple"
        rows={4}
      />

      {/* Simple — danger state */}
      <TextArea
        feature="simple"
        state="danger"
        label="Label"
        showHeader
        showInfoIcon
        placeholder="Error text"
        id="example-danger"
        rows={4}
      />

      {/* Rich text — default state */}
      <TextArea
        feature="rich-text"
        state="default"
        label="Label"
        showHeader
        showInfoIcon
        placeholder="Start typing…"
        id="example-rich-text"
        rows={4}
        toolbar={<span className="text-klp-text-small text-klp-fg-muted">B I U</span>}
        actionBar={<span className="text-klp-text-small text-klp-fg-muted">Cancel · Confirm</span>}
      />
    </div>
  )
}
