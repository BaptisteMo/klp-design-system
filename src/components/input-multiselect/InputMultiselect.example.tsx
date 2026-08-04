import { useState } from 'react'
import { InputMultiselect } from '@/components/input-multiselect'

const SECTIONS = [
  {
    title: 'Titre de section',
    options: [
      { id: 'opt-1', label: 'Label' },
      { id: 'opt-2', label: 'Label' },
      { id: 'opt-3', label: 'Label' },
    ],
  },
  {
    title: 'Titre de section',
    options: [
      { id: 'opt-4', label: 'Label' },
      { id: 'opt-5', label: 'Label' },
    ],
  },
]

export function InputMultiselectExample() {
  const [value, setValue] = useState<string[]>(['opt-1', 'opt-2'])

  return (
    <InputMultiselect
      label="Label of the input"
      placeholder="This is the placeholder or input content"
      sections={SECTIONS}
      value={value}
      onValueChange={setValue}
    />
  )
}
