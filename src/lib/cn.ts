import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'klp-text-large',
            'klp-text-medium',
            'klp-text-small',
            'klp-text-smaller',
            'klp-heading-h1',
            'klp-heading-h2',
            'klp-heading-h3',
            'klp-heading-h4',
          ],
        },
      ],
      'text-color': [
        {
          text: [
            'klp-fg-default',
            'klp-fg-muted',
            'klp-fg-subtle',
            'klp-fg-on-emphasis',
            'klp-fg-disable',
            'klp-fg-brand',
            'klp-fg-brand-contrasted',
            'klp-fg-secondary-brand',
            'klp-fg-secondary-brand-contrasted',
            'klp-fg-success',
            'klp-fg-success-contrasted',
            'klp-fg-danger',
            'klp-fg-danger-contrasted',
            'klp-fg-warning',
            'klp-fg-warning-contrasted',
            'klp-fg-info',
            'klp-fg-info-contrasted',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
