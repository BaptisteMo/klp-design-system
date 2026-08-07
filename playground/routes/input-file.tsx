import { useEffect, useState } from 'react'
import { InputFile } from '@/components/input-file'
import { FileDropped, type FileDroppedState } from '@/components/file-dropped'

const CAPTURE_BRAND = 'klub'

type UploadedFile = { id: string; name: string; size: string; state: FileDroppedState }

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}b`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}kb`
  return `${(bytes / (1024 * 1024)).toFixed(1)}mo`
}

/**
 * Live demo of the intended pattern: InputFile selects, FileDropped displays.
 * Drop a file or use the picker on either layout — the input keeps its
 * placeholder, and the file shows up in the list below.
 */
function CompositionDemo({ layout }: { layout: 'drop-zone' | 'simple' }) {
  const [files, setFiles] = useState<UploadedFile[]>([])

  const addFiles = (picked: File[]) =>
    setFiles((prev) => [
      ...prev,
      ...picked.map((f) => ({
        id: `${f.name}-${f.lastModified}-${Math.random()}`,
        name: f.name,
        size: formatSize(f.size),
        state: 'default' as FileDroppedState,
      })),
    ])

  return (
    <div className="flex flex-col gap-klp-size-xs">
      <InputFile
        layout={layout}
        multiple
        accept="application/pdf,image/*"
        onFilesSelected={addFiles}
      />
      {files.map((f) => (
        <FileDropped
          key={f.id}
          name={f.name}
          size={f.size}
          state={f.state}
          onDelete={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
        />
      ))}
      {files.length === 0 && (
        <span className="font-klp-label text-klp-text-smaller text-klp-fg-subtle">
          Drop a file or click to pick one — it appears here, never in the input.
        </span>
      )}
    </div>
  )
}

export function InputFileRoute() {
  useEffect(() => {
    const prev = document.documentElement.dataset.brand
    document.documentElement.dataset.brand = CAPTURE_BRAND
    return () => {
      document.documentElement.dataset.brand = prev ?? ''
    }
  }, [])

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-xl font-semibold">Input File — captured in {CAPTURE_BRAND}</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Usage — always paired with FileDropped</h2>
        <p className="max-w-[70ch] font-klp-body text-klp-text-medium text-klp-fg-muted">
          InputFile is a trigger only. It never displays the selected filename — on
          either layout, from the picker or from a drop. Selected files leave through{' '}
          <code>onFilesSelected</code> and are rendered by the parent as a list of{' '}
          <code>FileDropped</code> rows. The two components are never used apart.
        </p>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4">
            <span className="font-klp-label text-klp-text-smaller text-klp-fg-muted">
              drop-zone + list (live)
            </span>
            <CompositionDemo layout="drop-zone" />
          </div>
          <div className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4">
            <span className="font-klp-label text-klp-text-smaller text-klp-fg-muted">
              simple + list (live)
            </span>
            <CompositionDemo layout="simple" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Variants</h2>
        <div className="grid grid-cols-2 gap-6">
          <div
            data-variant-id="drop-zone"
            className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
          >
            <span className="font-klp-label text-klp-text-smaller text-klp-fg-muted">drop-zone</span>
            <InputFile layout="drop-zone" multiple accept="application/pdf,image/*" />
          </div>
          <div
            data-variant-id="simple"
            className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4"
          >
            <span className="font-klp-label text-klp-text-smaller text-klp-fg-muted">simple</span>
            <InputFile layout="simple" accept="application/pdf,image/*" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Disabled</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4">
            <span className="font-klp-label text-klp-text-smaller text-klp-fg-muted">drop-zone — disabled</span>
            <InputFile layout="drop-zone" disabled />
          </div>
          <div className="flex flex-col gap-2 rounded-klp-m border border-klp-border-default p-4">
            <span className="font-klp-label text-klp-text-smaller text-klp-fg-muted">simple — disabled</span>
            <InputFile layout="simple" disabled />
          </div>
        </div>
      </section>
    </div>
  )
}
