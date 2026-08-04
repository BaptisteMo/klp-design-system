import { Separator } from './Separator'

export function SeparatorExample() {
  return (
    <div className="flex w-[240px] flex-col">
      <span>Section A</span>
      <Separator direction="horizontal" margin="medium" />
      <span>Section B</span>
    </div>
  )
}
