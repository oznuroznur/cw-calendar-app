import { Card } from "@/components/ui/card";
import { YearViewCalendar } from "@/components/YearlyCalendar";

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-center py-6">📅 Yıllık CW Takvimi</h1>
      <YearViewCalendar year={2025} />
    </main>
  )
}



