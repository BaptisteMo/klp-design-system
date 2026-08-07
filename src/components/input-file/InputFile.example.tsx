import * as React from 'react'
import { InputFile } from '@/components/input-file'
import { FileDropped, type FileDroppedState } from '@/components/file-dropped'

/**
 * The canonical file-upload pattern: `InputFile` selects, `FileDropped` displays.
 *
 * These two components are always used together. `InputFile` is a trigger and
 * nothing more — it never shows the selected filename, on either layout, whether
 * the file arrived via the OS picker or via drag-and-drop. Everything the user
 * picked is surfaced by the `FileDropped` list underneath.
 *
 * Never put a filename back inside the input.
 */

type UploadedFile = {
  id: string
  name: string
  size: string
  state: FileDroppedState
}

/** Turn "442000" bytes into the "442kb" string FileDropped expects. */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}b`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}kb`
  return `${(bytes / (1024 * 1024)).toFixed(1)}mo`
}

export function InputFileExample() {
  const [files, setFiles] = React.useState<UploadedFile[]>([])

  // The parent owns the list. This is the only place selection is recorded.
  const addFiles = (picked: File[]) => {
    setFiles((prev) => [
      ...prev,
      ...picked.map((f) => ({
        id: `${f.name}-${f.lastModified}`,
        name: f.name,
        size: formatSize(f.size),
        // Real apps start at 'uploading' and flip to 'done' when the request settles.
        state: 'default' as FileDroppedState,
      })),
    ])
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── DropZone + its file list ──────────────────────────────────────── */}
      <div className="flex flex-col gap-klp-size-xs">
        <InputFile
          layout="drop-zone"
          multiple
          accept="application/pdf,image/*"
          onFilesSelected={addFiles}
        />
        {/* Selected files appear HERE, never inside the input above. */}
        {files.map((f) => (
          <FileDropped
            key={f.id}
            name={f.name}
            size={f.size}
            state={f.state}
            onDelete={() => removeFile(f.id)}
          />
        ))}
      </div>

      {/* ── Simple layout — same contract, same list ──────────────────────── */}
      <div className="flex flex-col gap-klp-size-xs">
        <InputFile
          layout="simple"
          label="Power of attorney"
          description="PDF, JPG, PNG (20mo max)"
          accept="application/pdf,image/*"
          onFilesSelected={addFiles}
        />
      </div>
    </div>
  )
}
