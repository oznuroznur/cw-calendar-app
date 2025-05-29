// components/calendar/MonthCalendar.tsx
"use client"

import {
  eachWeekOfInterval,
  endOfMonth,
  format,
  getISOWeek,
  startOfMonth,
  startOfWeek,
  addDays,
  isSameDay,
} from "date-fns"
import { useState } from "react"
import { tr } from "date-fns/locale"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Product {
  code: string
  desc: string
}

interface MonthCalendarProps {
  year: number
  month: number // 0 = Ocak
  events: { [cw: number]: Product[] }
}

export function MonthCalendar({ year, month, events }: MonthCalendarProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[] | null>(null)

  const firstDay = startOfMonth(new Date(year, month))
  const lastDay = endOfMonth(firstDay)

  const weeks = eachWeekOfInterval({ start: firstDay, end: lastDay }, { weekStartsOn: 1 })

  return (
    <div className="border rounded-md shadow-sm p-2 bg-white">
      <h3 className="text-center font-semibold mb-2 text-sm">
        {format(firstDay, "MMMM yyyy", { locale: tr })}
      </h3>

      <div className="grid grid-cols-7 gap-1 text-xs font-medium text-gray-500 mb-1">
        <div>Pzt</div><div>Sal</div><div>Çar</div><div>Per</div><div>Cum</div><div>Cmt</div><div>Paz</div>
      </div>

      {weeks.map((weekStart, i) => {
        const days = Array.from({ length: 7 }).map((_, d) => addDays(weekStart, d))
        const cw = getISOWeek(weekStart)
        const weekEvents = events[cw] || []

        return (
          <div key={i} className="grid grid-cols-7 gap-1 mb-1">
            {days.map((day, j) => {
              const isCurrentMonth = day.getMonth() === month
              const hasEvent = weekEvents.length > 0 && j === 0 // Pzt = ilk gün
              return (
                <div
                  key={j}
                  className={`relative text-center rounded p-1 text-xs cursor-pointer
                    ${isCurrentMonth ? "text-gray-800" : "text-gray-300"}
                    ${hasEvent ? "bg-blue-100 hover:bg-blue-200" : ""}
                  `}
                  onClick={() => hasEvent && setSelectedProducts(weekEvents)}
                >
                  {format(day, "d")}
                  {j === 0 && (
                    <div className="absolute -top-2 -left-2 text-[10px] text-blue-500 font-bold">
                      CW {cw}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}

      <Dialog open={!!selectedProducts} onOpenChange={() => setSelectedProducts(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>📦 Ürün Detayları</DialogTitle>
          </DialogHeader>
          {selectedProducts?.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between py-1">
              <span className="text-sm">{p.code}</span>
              <Badge variant="secondary">{p.desc}</Badge>
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  )
}
