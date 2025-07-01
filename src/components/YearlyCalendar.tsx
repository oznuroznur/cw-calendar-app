"use client"

import { useState } from "react"
import { MonthCalendar } from "./MonthCalendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"


export function YearViewCalendar({ year: initialYear = 2025 }: { year?: number }) {
  const [selectedYear, setSelectedYear] = useState(initialYear)
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const isCurrentYear = selectedYear === currentYear

  // Generate year options (current year ± 10 years)
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  const handlePreviousYear = () => {
    setSelectedYear((prev) => prev - 1)
  }

  const handleNextYear = () => {
    setSelectedYear((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* Year Controls */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousYear}
            className="h-10 w-10 rounded-full bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-4">
            <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {selectedYear}
            </div>
            {isCurrentYear && (
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                GÜNCEL YIL
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextYear}
            className="h-10 w-10 rounded-full bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Year Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Hızlı Seçim:</span>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year} {year === currentYear && "(Şu an)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isCurrentYear && (
          <p className="text-sm text-gray-600">
            Bugün:{" "}
            {currentDate.toLocaleDateString("tr-TR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <MonthCalendar key={`${selectedYear}-${i}`} year={selectedYear} month={i}  />
        ))}
      </div>

      {/* Summary Info */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">📊 {selectedYear} Yılı Özeti</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-blue-700 font-medium">Ay</div>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-green-600">52</div>
            <div className="text-sm text-green-700 font-medium">Hafta</div>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">7</div>
            <div className="text-sm text-purple-700 font-medium">Aktif Ürün</div>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">5</div>
            <div className="text-sm text-orange-700 font-medium">Planlı Teslimat</div>
          </div>
        </div>
      </div>
    </div>
  )
}
