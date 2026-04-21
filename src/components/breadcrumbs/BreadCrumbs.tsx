import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Store, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Layer: root
// Horizontal flex container; gap literal 4px from spec.
// Identical across all steps variants.
// ---------------------------------------------------------------------------
const rootVariants = cva(
  'flex flex-row items-center gap-[4px]',
  {
    variants: {
      steps: {
        '0': '',
        '1': '',
        '2': '',
        '3': '',
      },
    },
    defaultVariants: { steps: '0' },
  }
)

// ---------------------------------------------------------------------------
// Layer: step-item
// paddingLeft=8px paddingRight=8px paddingTop=4px paddingBottom=4px
// cornerRadius=8px (literal — no klp-radius alias maps to 8px exactly)
// gap=4px (literal)
// Spec uses paddingLeft/paddingRight/paddingTop/paddingBottom — emit pl-/pr-/pt-/pb-.
// ---------------------------------------------------------------------------
const stepItemVariants = cva(
  'flex flex-row items-center gap-[4px] pl-[8px] pr-[8px] pt-[4px] pb-[4px] rounded-klp-l cursor-pointer',
  {
    variants: {
      steps: {
        '0': '',
        '1': '',
        '2': '',
        '3': '',
      },
    },
    defaultVariants: { steps: '0' },
  }
)

// ---------------------------------------------------------------------------
// Layer: step-icon
// color: --klp-fg-muted → text-klp-fg-muted
// wrapperSize: 20px (literal); iconSize: 16px (literal)
// Only shown on first step.
// ---------------------------------------------------------------------------
const stepIconVariants = cva(
  'inline-flex shrink-0 items-center justify-center h-[20px] w-[20px] text-klp-fg-muted',
  {
    variants: {
      steps: {
        '0': '',
        '1': '',
        '2': '',
        '3': '',
      },
    },
    defaultVariants: { steps: '0' },
  }
)

// ---------------------------------------------------------------------------
// Layer: step-label
// fontSize: --klp-font-size-text-medium → text-klp-text-medium
// fontFamily: --klp-font-family-body → font-klp-body
// fontWeight: --klp-font-weight-body → font-klp-body (weight)
// color (ancestor): --klp-fg-muted → text-klp-fg-muted
// color (current):  --klp-fg-default → text-klp-fg-default
// ---------------------------------------------------------------------------
const stepLabelVariants = cva(
  'text-klp-text-medium font-klp-body',
  {
    variants: {
      isCurrent: {
        true: 'text-klp-fg-default',
        false: 'text-klp-fg-muted',
      },
      steps: {
        '0': '',
        '1': '',
        '2': '',
        '3': '',
      },
    },
    defaultVariants: { isCurrent: false as boolean, steps: '0' },
  }
)

// ---------------------------------------------------------------------------
// Layer: step-separator
// color: --klp-fg-muted → text-klp-fg-muted
// size: 16px (literal)
// icon: chevron-right for ancestors; chevron-down for current step.
// ---------------------------------------------------------------------------
const stepSeparatorVariants = cva(
  'inline-flex shrink-0 items-center justify-center text-klp-fg-muted',
  {
    variants: {
      steps: {
        '0': '',
        '1': '',
        '2': '',
        '3': '',
      },
    },
    defaultVariants: { steps: '0' },
  }
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface BreadCrumbStep {
  /** Text label for this step */
  label: string
  /** Optional href — renders as <a> when provided, otherwise <button> */
  href?: string
  /** Click handler for button-style steps */
  onClick?: () => void
}

export interface BreadCrumbsProps extends React.HTMLAttributes<HTMLElement> {
  /** Ordered list of steps from root → current
   * @propClass required
   */
  steps: BreadCrumbStep[]
  /** Whether the current (last) step shows a chevron-down dropdown affordance
   * @propClass optional
   */
  showDropdownAffordance?: boolean
  /** Override the steps variant key (derived from steps.length - 1 if omitted)
   * @propClass optional
   */
  stepsVariant?: VariantProps<typeof rootVariants>['steps']
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const BreadCrumbs = React.forwardRef<HTMLElement, BreadCrumbsProps>(
  (
    {
      className,
      steps,
      showDropdownAffordance = true,
      stepsVariant,
      ...props
    },
    ref
  ) => {
    const derivedVariant = (stepsVariant ??
      String(Math.max(0, steps.length - 1))) as VariantProps<typeof rootVariants>['steps']

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn(rootVariants({ steps: derivedVariant }), className)}
        {...props}
      >
        <ol className="flex flex-row items-center gap-[4px] list-none m-0 p-0">
          {steps.map((step, index) => {
            const isFirst = index === 0
            const isCurrent = index === steps.length - 1
            const isAncestor = !isCurrent

            const StepComp: React.ElementType = step.href ? 'a' : 'button'

            return (
              <li key={index} className="flex flex-row items-center gap-[4px]">
                {/* step-item */}
                <StepComp
                  href={step.href}
                  onClick={step.onClick}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(stepItemVariants({ steps: derivedVariant }))}
                >
                  {/* step-icon: home/store icon on first step only */}
                  {isFirst && (
                    <span
                      aria-hidden="true"
                      className={cn(stepIconVariants({ steps: derivedVariant }))}
                    >
                      <Store className="h-[16px] w-[16px]" strokeWidth={1.5} />
                    </span>
                  )}

                  {/* step-label */}
                  <span
                    className={cn(
                      stepLabelVariants({
                        steps: derivedVariant,
                        isCurrent,
                      })
                    )}
                  >
                    {step.label}
                  </span>

                  {/* step-separator: chevron-down on current step (inline), chevron-right on ancestors (after item below) */}
                  {isCurrent && showDropdownAffordance && (
                    <span
                      aria-hidden="true"
                      className={cn(stepSeparatorVariants({ steps: derivedVariant }))}
                    >
                      <ChevronDown className="h-[16px] w-[16px]" strokeWidth={1.5} />
                    </span>
                  )}
                </StepComp>

                {/* step-separator between ancestor steps: chevron-right */}
                {isAncestor && (
                  <span
                    aria-hidden="true"
                    className={cn(stepSeparatorVariants({ steps: derivedVariant }))}
                  >
                    <ChevronRight className="h-[16px] w-[16px]" strokeWidth={1.5} />
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }
)
BreadCrumbs.displayName = 'BreadCrumbs'

export {
  rootVariants as breadCrumbsRootVariants,
  stepItemVariants as breadCrumbsStepItemVariants,
  stepIconVariants as breadCrumbsStepIconVariants,
  stepLabelVariants as breadCrumbsStepLabelVariants,
  stepSeparatorVariants as breadCrumbsStepSeparatorVariants,
}
