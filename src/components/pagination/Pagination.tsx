import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/button'

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** 1-indexed current page.
   * @propClass required
   */
  page: number
  /** Items per page (used for the "X-Y of Z" label).
   * @propClass required
   */
  pageSize: number
  /** Total number of items across all pages.
   * @propClass required
   */
  total: number
  /** Called with the new 1-indexed page number.
   * @propClass required
   */
  onPageChange: (page: number) => void
  /** Number of pages shown on each side of the current page. Default 1.
   * @propClass optional
   */
  siblingCount?: number
  /** Toggle the "X-Y of Z" label on the left. Default true.
   * @propClass optional
   */
  showLabel?: boolean
}

// ---------------------------------------------------------------------------
// Page-list builder — returns an array of page numbers and 'dots' markers for
// ellipsis. Uses a pragmatic rule:
//   - show first + last always
//   - show siblingCount pages each side of the current page
//   - insert 'dots' between ranges when they are not contiguous
//
// Total visible slots = siblingCount * 2 + 5 (first + last + current + 2×sibling + 2×dots).
// If pageCount fits within that, return the full range with no dots.
// ---------------------------------------------------------------------------
export function buildPageList(
  page: number,
  pageCount: number,
  siblingCount: number
): (number | 'dots')[] {
  const totalSlots = siblingCount * 2 + 5
  if (pageCount <= totalSlots) {
    return Array.from({ length: pageCount }, (_, i) => i + 1)
  }
  const leftSibling = Math.max(page - siblingCount, 1)
  const rightSibling = Math.min(page + siblingCount, pageCount)
  const showLeftDots = leftSibling > 2
  const showRightDots = rightSibling < pageCount - 1

  if (!showLeftDots && showRightDots) {
    const leftCount = siblingCount * 2 + 3
    return [
      ...Array.from({ length: leftCount }, (_, i) => i + 1),
      'dots',
      pageCount,
    ]
  }
  if (showLeftDots && !showRightDots) {
    const rightCount = siblingCount * 2 + 3
    return [
      1,
      'dots',
      ...Array.from({ length: rightCount }, (_, i) => pageCount - rightCount + 1 + i),
    ]
  }
  // Both sides have dots
  return [
    1,
    'dots',
    ...Array.from(
      { length: rightSibling - leftSibling + 1 },
      (_, i) => leftSibling + i
    ),
    'dots',
    pageCount,
  ]
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page,
      pageSize,
      total,
      onPageChange,
      siblingCount = 1,
      showLabel = true,
      className,
      ...props
    },
    ref
  ) => {
    const pageCount = Math.max(1, Math.ceil(total / pageSize))
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1
    const end = Math.min(page * pageSize, total)
    const pages = buildPageList(page, pageCount, siblingCount)

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination"
        className={cn('flex items-center gap-klp-size-xs', className)}
        {...props}
      >
        {showLabel && (
          <span className="text-klp-text-small text-klp-fg-muted mr-klp-size-s">
            {start}-{end} of {total}
          </span>
        )}
        <Button
          variant="tertiary"
          size="icon"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft strokeWidth={1.5} />
        </Button>
        {pages.map((item, idx) =>
          item === 'dots' ? (
            <span
              key={`dots-${idx}`}
              aria-hidden="true"
              className="text-klp-fg-muted px-klp-size-xs"
            >
              …
            </span>
          ) : (
            <Button
              key={item}
              variant="tertiary"
              size="icon"
              aria-current={item === page ? 'page' : undefined}
              className={
                item === page ? 'bg-klp-bg-inset border-klp-border-brand' : ''
              }
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          )
        )}
        <Button
          variant="tertiary"
          size="icon"
          aria-label="Next page"
          disabled={page === pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight strokeWidth={1.5} />
        </Button>
      </nav>
    )
  }
)
Pagination.displayName = 'Pagination'
