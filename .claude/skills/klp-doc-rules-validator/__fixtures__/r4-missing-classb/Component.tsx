import * as React from 'react'
import { cva } from 'class-variance-authority'

const rootVariants = cva('base', {
  variants: {
    state: {
      rest: 'bg-rest',
      active: 'bg-active',
    },
  },
  defaultVariants: { state: 'rest' },
})

export interface ComponentProps {
  /** @propClass optional */
  label?: string
}

export const Component = (props: ComponentProps) => <div>{props.label}</div>
