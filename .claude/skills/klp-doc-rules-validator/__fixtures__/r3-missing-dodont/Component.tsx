import * as React from 'react'
import { cva } from 'class-variance-authority'

const rootVariants = cva('base', { variants: {}, defaultVariants: {} })

export interface ComponentProps {
  /**
   * Visual state override.
   * @propClass computed
   * @derivedFrom disabled, aria-invalid
   */
  state?: 'default' | 'danger'
  /** @propClass optional */
  label?: string
}

export const Component = (props: ComponentProps) => <div>{props.label}</div>
