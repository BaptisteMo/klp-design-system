import { useEffect } from 'react'
import { Bold, Italic, Underline, Link as LinkIcon, List } from 'lucide-react'
import { TextArea, type ToolbarAction } from '@/components/text-area'

const CAPTURE_BRAND = 'wireframe'

const DEMO_TOOLBAR: ToolbarAction[] = [
  { label: 'Bold',          icon: <Bold strokeWidth={1.5} /> },
  { label: 'Italic',        icon: <Italic strokeWidth={1.5} /> },
  { label: 'Underline',     icon: <Underline strokeWidth={1.5} /> },
  { label: 'Bulleted list', icon: <List strokeWidth={1.5} /> },
  { label: 'Link',          icon: <LinkIcon strokeWidth={1.5} /> },
]

export function TextAreaRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">
        Text Area — captured in {CAPTURE_BRAND}
      </h1>

      <h2 className="text-base font-semibold mt-2">Rich Text</h2>
      <div className="grid grid-cols-3 gap-6">
        <div
          data-variant-id="rich-text-default"
          className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <TextArea
            feature="rich-text"
            resize='both'
            label="Label"
            showHeader
            showInfoIcon
            placeholder="Placeholder (interactive — type to see filled state)"
            id="rt-default"
            rows={3}
            toolbarActions={DEMO_TOOLBAR}
            className="w-full"
          />
        </div>

        <div
          data-variant-id="rich-text-focus"
          className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <TextArea
            feature="rich-text"
            state="focus"
            label="Label"
            showHeader
            showInfoIcon
            placeholder="Placeholder"
            id="rt-focus"
            rows={3}
            toolbarActions={DEMO_TOOLBAR}
            className="w-full"
          />
        </div>

        <div
          data-variant-id="rich-text-filled"
          className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <TextArea
            feature="rich-text"
            state="filled"
            label="Label"
            showHeader
            showInfoIcon
            placeholder="Filled text"
            id="rt-filled"
            rows={3}
            toolbarActions={DEMO_TOOLBAR}
            className="w-full"
          />
        </div>

        <div
          data-variant-id="rich-text-danger"
          className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <TextArea
            feature="rich-text"
            state="danger"
            label="Label"
            showHeader
            showInfoIcon
            placeholder="Error text"
            id="rt-danger"
            rows={3}
            toolbarActions={DEMO_TOOLBAR}
            className="w-full"
          />
        </div>

        <div
          data-variant-id="rich-text-success"
          className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <TextArea
            feature="rich-text"
            state="success"
            label="Label"
            showHeader
            showInfoIcon
            placeholder="Success text"
            id="rt-success"
            rows={3}
            toolbarActions={DEMO_TOOLBAR}
            className="w-full"
          />
        </div>

        <div
          data-variant-id="rich-text-disable"
          className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <TextArea
            feature="rich-text"
            state="disable"
            label="Label"
            showHeader
            showInfoIcon
            placeholder="Disabled"
            id="rt-disable"
            rows={3}
            toolbarActions={DEMO_TOOLBAR}
            className="w-full"
          />
        </div>
      </div>

      <h2 className="text-base font-semibold mt-4">Simple</h2>
      <div className="grid grid-cols-3 gap-6">
        <div
          data-variant-id="simple-default"
          className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <TextArea
            feature="simple"
            label="Label"
            showHeader
            showInfoIcon
            placeholder="Placeholder (interactive — type to see filled state)"
            id="s-default"
            rows={3}
            className="w-full"
          />
        </div>

        <div
          data-variant-id="simple-focus"
          className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <TextArea
            feature="simple"
            state="focus"
            label="Label"
            showHeader
            showInfoIcon
            placeholder="Placeholder"
            id="s-focus"
            rows={3}
            className="w-full"
          />
        </div>

        <div
          data-variant-id="simple-filled"
          className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <TextArea
            feature="simple"
            state="filled"
            label="Label"
            showHeader
            showInfoIcon
            placeholder="Filled text"
            id="s-filled"
            rows={3}
            className="w-full"
          />
        </div>

        <div
          data-variant-id="simple-danger"
          className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <TextArea
            feature="simple"
            state="danger"
            label="Label"
            showHeader
            showInfoIcon
            placeholder="Error text"
            id="s-danger"
            rows={3}
            className="w-full"
          />
        </div>

        <div
          data-variant-id="simple-success"
          className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <TextArea
            feature="simple"
            state="success"
            label="Label"
            showHeader
            showInfoIcon
            placeholder="Success text"
            id="s-success"
            rows={3}
            className="w-full"
          />
        </div>

        <div
          data-variant-id="simple-disable"
          className="flex items-start justify-center rounded-klp-m border border-klp-border-default p-4"
        >
          <TextArea
            feature="simple"
            state="disable"
            label="Label"
            showHeader
            showInfoIcon
            placeholder="Disabled"
            id="s-disable"
            rows={3}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
