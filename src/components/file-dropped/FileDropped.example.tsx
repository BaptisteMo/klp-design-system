import { FileDropped } from '@/components/file-dropped'

/**
 * The three states of a single file row, shown in isolation.
 *
 * In real usage `FileDropped` is never standalone: it is the display half of the
 * file-upload pattern, rendered as a list underneath an `InputFile`. `InputFile`
 * selects and never shows the filename; `FileDropped` shows it. See
 * `InputFile.example.tsx` for the composed pattern with state wiring.
 */
export function FileDroppedExample() {
  return (
    <div className="flex flex-col gap-3">
      <FileDropped
        name="contract_ready_signed.pdf"
        size="442kb"
        state="default"
        onDownload={() => console.info('download')}
        onDelete={() => console.info('delete')}
      />
      <FileDropped
        name="contract_ready_signed.pdf"
        size="442kb"
        state="uploading"
        progress={42}
        onDelete={() => console.info('cancel upload')}
      />
      <FileDropped
        name="contract_ready_signed.pdf"
        size="442kb"
        state="done"
        onDownload={() => console.info('download')}
        onDelete={() => console.info('delete')}
      />
    </div>
  )
}
