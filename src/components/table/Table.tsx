import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Root (<table>) — full width, collapsed borders. No variants.
// ---------------------------------------------------------------------------
const rootVariants = cva('w-full border-collapse')

// ---------------------------------------------------------------------------
// Row (<tr>) — bottom border + variant for visual state.
// `default`  : idle, hover activates bg-subtle via real CSS hover.
// `selected` : locked bg-secondary-brand-low (row selection V2 preview).
// `muted`    : locked bg-subtle (for static matrix display).
// ---------------------------------------------------------------------------
const rowVariants = cva(
  'border-b border-klp-border-default transition-colors',
  {
    variants: {
      variant: {
        default:  'hover:bg-klp-bg-subtle',
        selected: 'bg-klp-bg-secondary-brand-low',
        muted:    'bg-klp-bg-subtle',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

// ---------------------------------------------------------------------------
// Head (<th>) — header cell with muted bold label typography.
// ---------------------------------------------------------------------------
const headVariants = cva(
  'pt-klp-size-s pb-klp-size-s pl-klp-size-s pr-klp-size-s text-left font-klp-label font-klp-label-bold text-klp-fg-muted text-klp-text-medium'
)

// ---------------------------------------------------------------------------
// Cell (<td>) — data cell with body typography + comfortable vertical padding.
// ---------------------------------------------------------------------------
const cellVariants = cva(
  'pt-klp-size-m pb-klp-size-m pl-klp-size-s pr-klp-size-s font-klp-body text-klp-fg-default text-klp-text-medium'
)

// ---------------------------------------------------------------------------
// Caption (<caption>) — subtle caption text, mostly for a11y.
// ---------------------------------------------------------------------------
const captionVariants = cva(
  'text-klp-text-small text-klp-fg-muted pt-klp-size-s pb-klp-size-s text-left'
)

// ---------------------------------------------------------------------------
// Sub-components — each a thin forwardRef on the matching HTML element.
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table ref={ref} className={cn(rootVariants(), className)} {...props} />
  )
)
Root.displayName = 'Table.Root'

const Header = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={className} {...props} />
))
Header.displayName = 'Table.Header'

const Body = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={className} {...props} />
))
Body.displayName = 'Table.Body'

const Footer = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={className} {...props} />
))
Footer.displayName = 'Table.Footer'

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /**
   * @propClass optional
   */
  variant?: 'default' | 'selected' | 'muted'
}
const Row = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, variant, ...props }, ref) => (
    <tr ref={ref} className={cn(rowVariants({ variant }), className)} {...props} />
  )
)
Row.displayName = 'Table.Row'

const Head = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn(headVariants(), className)} {...props} />
  )
)
Head.displayName = 'Table.Head'

const Cell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn(cellVariants(), className)} {...props} />
  )
)
Cell.displayName = 'Table.Cell'

const Caption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn(captionVariants(), className)} {...props} />
))
Caption.displayName = 'Table.Caption'

// ---------------------------------------------------------------------------
// Compound export — idiomatic `Table.Root`, `Table.Header`, etc. at call sites.
// ---------------------------------------------------------------------------
export const Table = { Root, Header, Body, Footer, Row, Head, Cell, Caption }

// Named cva exports (for token validator / consumer overrides).
export {
  rootVariants as tableRootVariants,
  rowVariants as tableRowVariants,
  headVariants as tableHeadVariants,
  cellVariants as tableCellVariants,
  captionVariants as tableCaptionVariants,
}
