import { CalendarButton } from './CalendarButton'

export function CalendarButtonExample() {
  return (
    <div className="flex gap-2">
      <CalendarButton day={1} />
      <CalendarButton day={30} otherMonth />
      <CalendarButton day={12} disabled />
      <CalendarButton day={4} today />
      <CalendarButton day={9} selected />
    </div>
  )
}
