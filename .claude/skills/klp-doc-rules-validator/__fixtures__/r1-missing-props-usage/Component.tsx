import * as React from 'react'
import { cva } from 'class-variance-authority'

const rootVariants = cva('base', { variants: {}, defaultVariants: {} })

export interface ComponentProps {
  /**
   * Field label.
   * @propClass optional
   */
  label?: string
  /**
   * @propClass required
   */
  children: React.ReactNode
}

export const Component = (props: ComponentProps) => <div>{props.children}</div>
