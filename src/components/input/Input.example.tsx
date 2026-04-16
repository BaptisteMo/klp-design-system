import { Input } from './Input'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function InputExample() {
  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Large / default */}
      <Input
        label="Label of the input"
        size="large"
        state="default"
        showInfoIcon
        iconLeft={<SearchIcon />}
        iconRight={<ChevronIcon />}
        placeholder="Placeholder"
      />

      {/* Medium / filled */}
      <Input
        label="Label of the input"
        size="medium"
        state="filled"
        showInfoIcon
        iconLeft={<SearchIcon />}
        iconRight={<ChevronIcon />}
        defaultValue="Filled value"
      />

      {/* Small / danger with description */}
      <Input
        label="Label of the input"
        size="small"
        state="danger"
        aria-invalid="true"
        showInfoIcon
        iconLeft={<SearchIcon />}
        iconRight={<ChevronIcon />}
        placeholder="Placeholder"
        description="This field is required."
      />

      {/* Disabled */}
      <Input
        label="Label of the input"
        size="medium"
        disabled
        iconLeft={<SearchIcon />}
        placeholder="Disabled"
      />
    </div>
  )
}
