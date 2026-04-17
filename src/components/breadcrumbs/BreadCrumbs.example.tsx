import { BreadCrumbs } from './BreadCrumbs'

export function BreadCrumbsExample() {
  return (
    <BreadCrumbs
      steps={[
        { label: 'Home', href: '/' },
        { label: 'Category', href: '/category' },
        { label: 'Current Page' },
      ]}
    />
  )
}
