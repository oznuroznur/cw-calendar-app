"use client"

import { eachWeekOfInterval, endOfMonth, format, getISOWeek, startOfMonth, addDays, isToday } from "date-fns"
import { tr } from "date-fns/locale"
import { Card } from "@/components/ui/card"

interface MonthCalendarProps {
  year: number
  month: number
}

export function MonthCalendar({ year, month }: MonthCalendarProps) {
  const firstDay = startOfMonth(new Date(year, month))
  const lastDay = endOfMonth(firstDay)
  const weeks = eachWeekOfInterval({ start: firstDay, end: lastDay }, { weekStartsOn: 1 })

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-white/90 backdrop-blur-sm">
      <div className="p-4">
        <h3 className="text-center font-bold mb-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {format(firstDay, "MMMM yyyy", { locale: tr })}
        </h3>

        {/* Header with CW column */}
        <div className="grid grid-cols-8 gap-1 text-xs font-semibold text-gray-600 mb-2">
          <div className="text-center p-1">CW</div>
          <div className="text-center p-1">Pzt</div>
          <div className="text-center p-1">Sal</div>
          <div className="text-center p-1">Çar</div>
          <div className="text-center p-1">Per</div>
          <div className="text-center p-1">Cum</div>
          <div className="text-center p-1 text-red-500">Cmt</div>
          <div className="text-center p-1 text-red-500">Paz</div>
        </div>

        {weeks.map((weekStart, i) => {
          const days = Array.from({ length: 7 }).map((_, d) => addDays(weekStart, d))
          const cw = getISOWeek(weekStart)

          return (
            <div key={i} className="grid grid-cols-8 gap-1 mb-1">
              {/* CW Number Column */}
              <div className="text-center rounded-lg p-2 text-sm font-bold flex items-center justify-center bg-gray-100 text-gray-700">
                {cw}
              </div>

              {/* Days Grid */}
              {days.map((day, j) => {
                const isCurrentMonth = day.getMonth() === month
                const isWeekend = j >= 5
                const isTodayDate = isToday(day)

                return (
                  <div
                    key={j}
                    className={`text-center rounded-lg p-2 text-sm transition-all duration-200 min-h-[32px] flex items-center justify-center
                      ${isCurrentMonth ? "text-gray-800" : "text-gray-300"}
                      ${isTodayDate ? "bg-gradient-to-br from-blue-500 to-gray-500 text-white font-bold shadow-lg ring ring-blue-300" : ""}
                      ${isWeekend && isCurrentMonth && !isTodayDate ? "text-blue-600" : ""}
                      ${!isTodayDate ? "hover:bg-gray-50" : ""}
                    `}
                  >
                    <div className="relative">
                      {format(day, "d")}
                      {isTodayDate && (
                        <div className="absolute -top-3 -right-3.5 text-[8px] bg-white text-blue-500 px-1 rounded-full font-bold shadow-sm whitespace-nowrap">
                          BUGÜN
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
