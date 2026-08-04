import { useState } from 'react'
import { Calendar } from '@/components/calendar'

export function CalendarExample() {
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <Calendar
      value={date}
      onValueChange={setDate}
      isDateDisabled={(d) => d.getDay() === 0}
    />
  )
}
