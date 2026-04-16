import { Button } from './Button'

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1l1.75 3.55 3.92.57-2.84 2.76.67 3.9L8 9.98l-3.5 1.84.67-3.9L2.33 5.12l3.92-.57L8 1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ButtonExample() {
  return (
    <div className="flex flex-wrap items-center gap-klp-size-s">
      <Button variant="primary" size="md" leftIcon={<StarIcon />}>Primary</Button>
      <Button variant="secondary" size="md">Secondary</Button>
      <Button variant="tertiary" size="md">Tertiary</Button>
      <Button variant="destructive" size="md">Destructive</Button>
      <Button variant="validation" size="md">Validation</Button>
      <Button variant="primary" size="icon" aria-label="Star">
        <StarIcon />
      </Button>
    </div>
  )
}
