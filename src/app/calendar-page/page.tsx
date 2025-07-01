import { YearViewCalendar } from "@/components/YearlyCalendar"

export default function CalendarPage() {
  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            📅 Yıllık CW Takvimi
          </h1>
          <p className="text-muted-foreground">Calendar Week bazlı ürün teslimat takip sistemi</p>
        </div>
        <YearViewCalendar year={2025} />
      </div>
    </main>
  )
}
