import { Bold, Italic, Underline, Link as LinkIcon, List } from 'lucide-react'
import { TextArea, type ToolbarAction } from './TextArea'

const DEMO_TOOLBAR: ToolbarAction[] = [
  { label: 'Bold',      icon: <Bold strokeWidth={1.5} /> },
  { label: 'Italic',    icon: <Italic strokeWidth={1.5} /> },
  { label: 'Underline', icon: <Underline strokeWidth={1.5} /> },
  { label: 'Bulleted list', icon: <List strokeWidth={1.5} /> },
  { label: 'Link',      icon: <LinkIcon strokeWidth={1.5} /> },
]

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
        resize="none"
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
        resize="vertical"
        toolbarActions={DEMO_TOOLBAR}
      />
    </div>
  )
}
