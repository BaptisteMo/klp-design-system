import * as React from 'react'
import { cva } from 'class-variance-authority'

const rootVariants = cva('base', { variants: {}, defaultVariants: {} })

export interface ComponentProps {
  /** @propClass optional */
  label?: string
  // no JSDoc at all
  foo?: string
}

export const Component = (props: ComponentProps) => <div>{props.label}</div>
