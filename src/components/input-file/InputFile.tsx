import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Plus, Camera } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { InputFileIllustration } from './InputFileIllustration'

// ─── root layer ─────────────────────────────────────────────────────────────
// DropZone: dashed brand-low panel. Simple: transparent vertical stack.
//
// The dashed outline is NOT a CSS border: `border-style: dashed` gives no control
// over dash length (the browser derives it from the border width), and Figma
// specifies an exact 16/16 pattern. It is drawn by DropZoneDashedBorder below.
const rootVariants = cva('flex', {
  variants: {
    layout: {
      'drop-zone':
        'relative flex-row items-center justify-center rounded-klp-l bg-klp-bg-brand-low px-klp-size-m py-klp-size-xs gap-klp-size-xs',
      simple: 'flex-col bg-transparent gap-klp-size-l',
    },
    dragActive: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    // Visual feedback while a file is dragged over the DropZone panel. The outline
    // colour shift lives on the SVG stroke (see dashedBorderVariants), not here.
    { layout: 'drop-zone', dragActive: true, className: 'bg-klp-bg-brand-low ring-4 ring-klp-bg-brand-low' },
  ],
  defaultVariants: { layout: 'drop-zone', dragActive: false },
})

// ─── root layer, dashed outline ─────────────────────────────────────────────
const dashedBorderVariants = cva('transition-[stroke] duration-150', {
  variants: {
    dragActive: {
      true: 'stroke-klp-border-brand-emphasis',
      false: 'stroke-klp-border-brand',
    },
  },
  defaultVariants: { dragActive: false },
})

/**
 * The DropZone's dashed outline, drawn as an SVG rect so the dash pattern matches
 * Figma exactly (`dashPattern: [16, 16]`, `strokeWeight: 1`, `strokeAlign: INSIDE`).
 * CSS cannot express this — `border-style: dashed` derives dash length from the
 * border width and offers no knob. The rect is inset by half the stroke width so
 * the 1px line sits fully inside the box, matching Figma's INSIDE stroke alignment.
 */
function DropZoneDashedBorder({ dragActive }: { dragActive?: boolean }) {
  return (
    // allow-inline-svg: geometric border primitive, not an icon — no lucide equivalent exists.
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    >
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx="7.5"
        fill="none"
        strokeWidth="1"
        strokeDasharray="16 16"
        className={dashedBorderVariants({ dragActive })}
      />
    </svg>
  )
}

// ─── dropzone-label layer ───────────────────────────────────────────────────
const dropzoneLabelVariants = cva(
  'font-klp-label font-klp-label text-klp-text-large text-klp-fg-muted'
)

// ─── Public types ───────────────────────────────────────────────────────────

type InputFileLayout = 'drop-zone' | 'simple'

/**
 * File selection trigger — either a dashed drag-and-drop panel (`drop-zone`) or a
 * labeled field with a camera action (`simple`).
 *
 * ## Intended usage: always paired with `FileDropped`
 *
 * `InputFile` is a *trigger only*. It never shows what was selected: the field and
 * the drop-zone label keep their placeholder at all times, whether the user picked
 * files through the OS dialog or dropped them onto the panel. Both paths behave
 * identically.
 *
 * Selected files leave through `onFilesSelected` and nowhere else. The parent owns
 * the list and renders one `<FileDropped>` row per file, below the input. In the
 * Klépierre tools these two components are never used apart — an `InputFile`
 * without a `FileDropped` list gives the user no feedback that anything happened.
 *
 * ```tsx
 * const [files, setFiles] = useState<UploadedFile[]>([])
 *
 * <InputFile
 *   layout="drop-zone"
 *   multiple
 *   onFilesSelected={(picked) =>
 *     setFiles((prev) => [...prev, ...picked.map(toUploadedFile)])
 *   }
 * />
 * {files.map((f) => (
 *   <FileDropped
 *     key={f.id}
 *     name={f.name}
 *     size={f.size}
 *     state={f.state}
 *     onDelete={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
 *   />
 * ))}
 * ```
 *
 * Do NOT render the filename inside the input, and do not add a prop to do so —
 * that is `FileDropped`'s job. See `InputFile.example.tsx` for the full pattern.
 */
export interface InputFileProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'>,
    VariantProps<typeof rootVariants> {
  /** Which visual layout to render: dashed drag-and-drop panel or a labeled Input row
   * @propClass optional
   */
  layout?: InputFileLayout
  /** Label rendered above the field in the `simple` layout (forwarded to the DS `Input`)
   * @propClass optional
   */
  label?: string
  /** Helper text rendered below the field in the `simple` layout (forwarded to the DS `Input`)
   * @propClass optional
   */
  description?: string
  /** Placeholder text for the `simple` layout's Input field
   * @propClass optional
   */
  placeholder?: string
  /** Label for the 'Take picture' action button, only rendered in the `simple` layout
   * @propClass optional
   */
  actionLabel?: string
  /** MIME types / extensions accepted by the underlying `<input type="file">`
   * @propClass optional
   */
  accept?: string
  /** Allow selecting more than one file
   * @propClass optional
   */
  multiple?: boolean
  /** Disable both the field and drag-and-drop interaction
   * @propClass optional
   */
  disabled?: boolean
  /** Called with the array of selected files, from either the file picker or a drop
   * event. This is the ONLY way selection leaves the component — `InputFile` keeps
   * no internal record of it and never displays it. Own the list in the parent and
   * render one `<FileDropped>` per entry.
   * @propClass optional
   */
  onFilesSelected?: (files: File[]) => void
  /** Additional className applied to the outer root wrapper
   * @propClass optional
   */
  className?: string
}

export const InputFile = React.forwardRef<HTMLInputElement, InputFileProps>(
  (
    {
      layout = 'drop-zone',
      label = 'Power of attorney',
      description = 'PDF, JPG, PNG (20mo max)',
      placeholder = 'Choose your files',
      actionLabel = 'Take picture',
      accept,
      multiple,
      disabled,
      onFilesSelected,
      className,
      id,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null)
    const cameraInputRef = React.useRef<HTMLInputElement>(null)
    const [dragActive, setDragActive] = React.useState(false)

    React.useImperativeHandle(forwardedRef, () => internalRef.current as HTMLInputElement)

    const inputId = id ?? 'input-file'

    // InputFile deliberately keeps NO record of what was selected: the field and
    // the drop-zone label always show their placeholder. Selected files are
    // handed to the parent, which renders them as a list of <FileDropped> rows.
    // See the component-level docblock.
    const handleFiles = (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return
      const files = Array.from(fileList)
      onFilesSelected?.(files)
      // Reset the native input so re-selecting the same file fires `change` again.
      if (internalRef.current) internalRef.current.value = ''
      if (cameraInputRef.current) cameraInputRef.current.value = ''
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
    }

    const openPicker = () => {
      if (disabled) return
      internalRef.current?.click()
    }

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault()
      if (disabled) return
      setDragActive(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault()
      setDragActive(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault()
      setDragActive(false)
      if (disabled) return
      handleFiles(e.dataTransfer.files)
    }

    if (layout === 'simple') {
      return (
        <div className={cn(rootVariants({ layout, dragActive: false }), className)}>
          {/* file-input layer — reuses the DS Input component (size=small, state=default) */}
          <Input
            size="small"
            state={disabled ? 'disable' : 'default'}
            label={label}
            description={description}
            iconLeft={<Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />}
            // Always the placeholder — never the selected filename. See docblock.
            placeholder={placeholder}
            readOnly
            disabled={disabled}
            onClick={openPicker}
          />
          {/* Visually hidden (not display:none) but focusable native file input —
              keyboard users can Tab to it and press Enter/Space to open the native
              picker (default <input type="file"> behavior). */}
          <input
            ref={internalRef}
            id={inputId}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleChange}
            className="sr-only"
            {...props}
          />
          {/* action-button layer — reuses the DS Button component (variant=tertiary, size=sm) */}
          <Button
            htmlType="button"
            variant="tertiary"
            size="sm"
            disabled={disabled}
            rightIcon={<Camera aria-hidden="true" />}
            onClick={() => cameraInputRef.current?.click()}
            className="self-start"
          >
            {actionLabel}
          </Button>
          <input
            ref={cameraInputRef}
            type="file"
            accept={accept ?? 'image/*'}
            capture="environment"
            disabled={disabled}
            onChange={handleChange}
            className="sr-only"
          />
        </div>
      )
    }

    return (
      // The <label> makes the whole panel (illustration + text) a native click
      // target for the hidden file input — no manual click/keydown wiring needed.
      // Drag-and-drop handlers stay on the same element for a single hit area.
      <label
        htmlFor={inputId}
        aria-disabled={disabled}
        className={cn(
          rootVariants({ layout, dragActive }),
          disabled ? 'pointer-events-none opacity-60' : 'cursor-pointer',
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <DropZoneDashedBorder dragActive={dragActive} />
        {/* illustration layer — decorative, only rendered in the drop-zone layout */}
        <InputFileIllustration />
        {/* dropzone-label layer — always the placeholder, never the selected
            filename. Selected files surface as <FileDropped> rows rendered by
            the parent. See the component-level docblock. */}
        <span className={dropzoneLabelVariants()}>{placeholder}</span>
        {/* Visually hidden (not display:none) but focusable native file input —
            keyboard users can Tab to it and press Enter/Space to open the native
            picker (default <input type="file"> behavior). */}
        <input
          ref={internalRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
      </label>
    )
  }
)
InputFile.displayName = 'InputFile'

export { rootVariants, dropzoneLabelVariants, dashedBorderVariants }
