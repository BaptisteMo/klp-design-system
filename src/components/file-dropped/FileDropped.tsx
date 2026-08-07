import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { FileText, Loader2, Check, Download, Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'

// ─── root layer ─────────────────────────────────────────────────────────────
// 925x76 capture is an artifact of the Figma frame, not an enforced width —
// the row is rendered as a flexible-width, fixed-height-by-content strip.
// cornerRadius (8px), paddingX/Y (16px) and itemSpacing (24px) were literal
// (unbound) values in Figma; they snap 1:1 onto existing --klp-* aliases —
// see gaps[] in the adapter report.
// Mirrors Figma's `Frame 194`: HORIZONTAL, itemSpacing 8, counterAxis MIN.
const rootVariants = cva(
  'inline-flex w-full items-start rounded-klp-l border border-klp-border-brand px-klp-size-m py-klp-size-m gap-klp-size-xs'
)

// ─── meta layer (filename + filesize) ───────────────────────────────────────
// Figma's `Frame 193`: VERTICAL, itemSpacing 8, primaryAxis CENTER,
// counterAxis MIN, layoutGrow 1. The grow is what pins the two action buttons
// to the right edge — it eats all the slack between the text and the buttons.
// `min-w-0` lets the filename truncate instead of overflowing the row.
const metaVariants = cva('flex min-w-0 flex-1 flex-col items-start justify-center gap-klp-size-xs')

// ─── icon-highlight layer ───────────────────────────────────────────────────
// 40x40 rounded square housing the single active state icon. cornerRadius,
// padding and itemSpacing were also literal/unbound in Figma; snapped onto
// the same aliases as the root (see gaps[]). 40px width/height has no
// matching --klp-size-* alias (scale jumps s=12/m=16/l=24/xl=32/2xl=48) so it
// stays an arbitrary literal.
const iconHighlightVariants = cva(
  'inline-flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-klp-l bg-klp-bg-brand-low p-klp-size-xs'
)

// ─── icon layer ─────────────────────────────────────────────────────────────
// Only one of the three stacked Figma state icons is ever rendered — driven
// by the `state` prop. All three share the same bg/brand color token.
const iconVariants = cva('text-klp-bg-brand', {
  variants: {
    state: {
      default: '',
      uploading: 'animate-spin',
      done: '',
    },
  },
  defaultVariants: { state: 'default' },
})

// ─── filename layer ─────────────────────────────────────────────────────────
// Figma had filename bound to literal 'Inter' 16px/400/20px — NOT the
// Family/Label or Sizing/Text/* variables used elsewhere. Snapped onto the
// nearest body-text alias (font-klp-body / font-klp-body weight, 16px exact
// match to --klp-font-size-text-medium). See gaps[].
const filenameVariants = cva(
  'truncate font-klp-body font-klp-body text-klp-text-medium text-klp-fg-default'
)

// ─── filesize layer ─────────────────────────────────────────────────────────
// Same literal-font caveat as filename.
// Same 16px size as the filename — the visual difference is colour only (fg-muted).
const filesizeVariants = cva(
  'font-klp-body font-klp-body text-klp-text-medium text-klp-fg-muted'
)

// ─── Public types ───────────────────────────────────────────────────────────

export type FileDroppedState = 'default' | 'uploading' | 'done'

export interface FileDroppedProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>,
    VariantProps<typeof rootVariants> {
  /** Filename displayed in the row (e.g. "contract_ready_signed.pdf")
   * @propClass required
   */
  name: string
  /** Pre-formatted file size string (e.g. "442kb")
   * @propClass required
   */
  size: string
  /** Which of the three mutually-exclusive state icons to render — synthesized
   * from Figma's stacked-icon frame (file-text / loader-circle / check)
   * @propClass persistent
   */
  state?: FileDroppedState
  /** Upload progress percentage (0-100). Only meaningful while `state="uploading"`;
   * surfaced as `aria-valuenow` on the row for assistive tech (no visual progress
   * bar exists in the Figma spec for this component — see `input-file`'s
   * `progress-indicator` layer for that pattern)
   * @propClass optional
   */
  progress?: number
  /** Called when the download action is activated. The download button is
   * hidden while `state="uploading"` (nothing to download yet); the delete
   * button stays available so an in-flight upload can be cancelled.
   * @propClass optional
   */
  onDownload?: () => void
  /** Called when the delete action is activated
   * @propClass optional
   */
  onDelete?: () => void
  /** Additional className applied to the outer root wrapper
   * @propClass optional
   */
  className?: string
}

export const FileDropped = React.forwardRef<HTMLDivElement, FileDroppedProps>(
  ({ name, size, state = 'default', progress, onDownload, onDelete, className, ...props }, ref) => {
    const isUploading = state === 'uploading'

    return (
      <div
        ref={ref}
        role="group"
        aria-label={name}
        aria-valuenow={isUploading ? progress : undefined}
        aria-valuemin={isUploading ? 0 : undefined}
        aria-valuemax={isUploading ? 100 : undefined}
        className={cn(rootVariants(), className)}
        {...props}
      >
        {/* icon-highlight layer */}
        <span className={iconHighlightVariants()}>
          {state === 'default' && (
            <FileText aria-hidden="true" className={iconVariants({ state })} strokeWidth={1.5} width={18} height={18} />
          )}
          {state === 'uploading' && (
            <Loader2 aria-hidden="true" className={iconVariants({ state })} strokeWidth={1.5} width={18} height={18} />
          )}
          {state === 'done' && (
            <Check aria-hidden="true" className={iconVariants({ state })} strokeWidth={1.5} width={18} height={18} />
          )}
        </span>

        {/* meta layer — filename stacked above filesize, 8px apart. flex-1 here is
            what pushes the action buttons to the right edge of the row. */}
        <span className={metaVariants()}>
          <span className={filenameVariants()}>{name}</span>
          <span className={filesizeVariants()}>{size}</span>
        </span>

        {/* download-button layer — DS Button (tertiary/icon), hidden while uploading */}
        {!isUploading && (
          <Button
            htmlType="button"
            variant="tertiary"
            size="icon"
            aria-label={`Download ${name}`}
            onClick={onDownload}
          >
            <Download aria-hidden="true" />
          </Button>
        )}

        {/* delete-button layer — DS Button (tertiary/icon), trash icon recolored to danger */}
        <Button
          htmlType="button"
          variant="tertiary"
          size="icon"
          aria-label={`Delete ${name}`}
          onClick={onDelete}
        >
          <Trash2 aria-hidden="true" className="text-klp-border-danger-emphasis" />
        </Button>
      </div>
    )
  }
)
FileDropped.displayName = 'FileDropped'

export {
  rootVariants,
  iconHighlightVariants,
  iconVariants,
  metaVariants,
  filenameVariants,
  filesizeVariants,
}
