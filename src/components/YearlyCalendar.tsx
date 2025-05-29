// components/calendar/YearViewCalendar.tsx
import { MonthCalendar } from "./MonthCalendar"

const demoEvents = {
  2: [{ code: "X001", desc: "Ürün A" }],
  10: [{ code: "X002", desc: "Ürün B" }, { code: "X003", desc: "Ürün C" }],
  34: [{ code: "X004", desc: "Ürün D" }],
}

export function YearViewCalendar({ year = 2025 }: { year?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <MonthCalendar key={i} year={year} month={i} events={demoEvents} />
      ))}
    </div>
  )
}
