"use client"

import type React from "react"

import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRightFromLine, Download, Upload, FileSpreadsheet, Eye, EyeOff } from "lucide-react"

export function FileProcessorTool() {
  const [selectedOption, setSelectedOption] = useState<"turkiye" | "other">("turkiye")
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [showWeeks, setShowWeeks] = useState(false)
  const [weeks, setWeeks] = useState<{ weekNumber: number; date: string }[]>([])

  const calculateTurkeyDate = (cw: string) => {
    try {
      if (!cw.startsWith("CW")) return cw
      const part = cw.split(" ")[1]
      const [week, year] = part.split("/").map(Number)
      const monday = new Date(year, 0, 1 + (week - 1) * 7)
      while (monday.getDay() !== 1) monday.setDate(monday.getDate() - 1)
      return monday.toLocaleDateString("tr-TR")
    } catch {
      return cw
    }
  }

  const calculateOtherDate = (cw: string) => {
    try {
      if (!cw.startsWith("CW")) return cw
      const part = cw.split(" ")[1]
      const [week, year] = part.split("/").map(Number)
      const monday = new Date(year, 0, 1 + (week - 1) * 7)
      while (monday.getDay() !== 1) monday.setDate(monday.getDate() - 1)
      const prevMonday = new Date(monday)
      prevMonday.setDate(prevMonday.getDate() - 14)
      const friday = new Date(prevMonday)
      friday.setDate(friday.getDate() + 4)
      return friday.toLocaleDateString("tr-TR")
    } catch {
      return cw
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setProcessing(true)
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json<{ Delivery_Date?: string }>(sheet)

        if (!json[0]?.Delivery_Date) {
          alert("'Delivery_Date' sütunu bulunamadı.")
          setProcessing(false)
          return
        }

        const processed = json.map((row) => ({
          ...row,
          Modified_Delivery_Date:
            selectedOption === "turkiye"
              ? calculateTurkeyDate(row.Delivery_Date ?? "")
              : calculateOtherDate(row.Delivery_Date ?? ""),
        }))

        const newSheet = XLSX.utils.json_to_sheet(processed)
        const newWorkbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Sheet1")
        const wbout = XLSX.write(newWorkbook, {
          bookType: "xlsx",
          type: "array",
        })
        const blob = new Blob([wbout], { type: "application/octet-stream" })
        const url = URL.createObjectURL(blob)
        setDownloadUrl(url)
      } catch (err) {
        console.error("Dosya işlenirken bir hata oluştu:", err)
        alert("Dosya işlenirken bir hata oluştu.")
      } finally {
        setProcessing(false)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const generatedWeeks = []
    for (let week = 1; week <= 52; week++) {
      const monday = new Date(currentYear, 0, 1 + (week - 1) * 7)
      while (monday.getDay() !== 1) monday.setDate(monday.getDate() - 1)
      if (selectedOption === "turkiye") {
        generatedWeeks.push({
          weekNumber: week,
          date: monday.toLocaleDateString("tr-TR"),
        })
      } else {
        const prevMonday = new Date(monday)
        prevMonday.setDate(prevMonday.getDate() - 14)
        const friday = new Date(prevMonday)
        friday.setDate(friday.getDate() + 4)
        generatedWeeks.push({
          weekNumber: week,
          date: friday.toLocaleDateString("tr-TR"),
        })
      }
    }
    setWeeks(generatedWeeks)
  }, [selectedOption])

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-violet-50 to-purple-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-violet-100 rounded-lg">
              <FileSpreadsheet className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                Teslimat Dosya İşleyici
                <ArrowRightFromLine className="h-5 w-5 text-violet-500" />
              </div>
              <Badge variant="secondary" className="mt-1 bg-violet-100 text-violet-700">
                {selectedOption === "turkiye" ? "Türkiye (Hafta Başı)" : "Diğer (2 Hafta Önceki Cuma)"}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Options Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Hesaplama Yöntemi</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedOption}
            onValueChange={(val) => setSelectedOption(val as "turkiye" | "other")}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="turkiye" id="turkiye" />
              <Label htmlFor="turkiye" className="cursor-pointer flex-1">
                <div className="font-medium">Türkiye</div>
                <div className="text-sm text-gray-600">Hafta Başı (Pazartesi)</div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other" className="cursor-pointer flex-1">
                <div className="font-medium">Diğer Ülkeler</div>
                <div className="text-sm text-gray-600">2 Hafta Önceki Cuma</div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* File Upload Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Dosya Yükleme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-violet-400 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer"
              />
              <p className="text-sm text-gray-600 mt-2">Excel dosyası seçin (.xlsx, .xls formatları desteklenir)</p>
            </div>

            {processing && (
              <div className="flex items-center gap-2 p-4 bg-violet-50 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-violet-500 border-t-transparent"></div>
                <p className="text-violet-700 font-medium">Dosya işleniyor...</p>
              </div>
            )}

            {downloadUrl && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-800 font-medium">Dosya hazır!</span>
                    </div>
                    <a
                      href={downloadUrl}
                      download="modified_file.xlsx"
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Dosyayı İndir
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Week List Card */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="p-1 bg-blue-100 rounded">
                <FileSpreadsheet className="h-4 w-4 text-blue-600" />
              </div>
              Hafta Listesi Önizleme
            </CardTitle>
            <Button
              onClick={() => setShowWeeks(!showWeeks)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {showWeeks ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showWeeks ? "Gizle" : "Göster"}
            </Button>
          </div>
        </CardHeader>
        {showWeeks && (
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto border rounded-lg bg-gray-50">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {weeks.map(({ weekNumber, date }) => (
                    <div
                      key={weekNumber}
                      className="flex items-center justify-between p-2 bg-white rounded border text-sm"
                    >
                      <Badge variant="outline" className="font-mono">
                        CW {weekNumber}
                      </Badge>
                      <span className="text-gray-700">{date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
