"use client"
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

function getWeekNumber(date) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
}

export default function Home() {
  const [selectedOption, setSelectedOption] = useState("turkiye");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const getWeekMonday = (cw) => {
    try {
      if (!cw.startsWith("CW")) return cw;
      const [_, part] = cw.split(" ");
      const [week, year] = part.split("/").map(Number);
      const monday = new Date(year, 0, 1 + (week - 1) * 7);
      while (monday.getDay() !== 1) monday.setDate(monday.getDate() - 1);
      return monday.toLocaleDateString("tr-TR");
    } catch {
      return cw;
    }
  };

  const getPreviousFriday = (cw) => {
    try {
      if (!cw.startsWith("CW")) return cw;
      const [_, part] = cw.split(" ");
      const [week, year] = part.split("/").map(Number);
      const monday = new Date(year, 0, 1 + (week - 1) * 7);
      while (monday.getDay() !== 1) monday.setDate(monday.getDate() - 1);
      const prevMonday = new Date(monday);
      prevMonday.setDate(prevMonday.getDate() - 14);
      const friday = new Date(prevMonday);
      friday.setDate(friday.getDate() + 4);
      return friday.toLocaleDateString("tr-TR");
    } catch {
      return cw;
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProcessing(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      if (!json[0]?.Delivery_Date) {
        alert("'Delivery_Date' sütunu bulunamadı.");
        setProcessing(false);
        return;
      }

      const processed = json.map(row => ({
        ...row,
        Modified_Delivery_Date: selectedOption === "turkiye"
          ? getWeekMonday(row.Delivery_Date)
          : getPreviousFriday(row.Delivery_Date)
      }));

      const newSheet = XLSX.utils.json_to_sheet(processed);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Sheet1");
      const blob = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'blob' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessing(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const generateWeeklyCalendar = () => {
    const currentYear = new Date().getFullYear();
    const weeks = [];
    for (let week = 1; week <= 52; week++) {
      const monday = new Date(currentYear, 0, 1 + (week - 1) * 7);
      while (monday.getDay() !== 1) monday.setDate(monday.getDate() - 1);
      weeks.push({
        weekNumber: week,
        date: monday.toLocaleDateString("tr-TR")
      });
    }
    return weeks;
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-xl">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Delivery Date Processor</h1>
          <p className="text-gray-600">Excel dosyanızı yükleyin ve işlem modunu seçin.</p>

          <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="turkiye" id="turkiye" />
              <Label htmlFor="turkiye">Türkiye (Hafta Başı)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Diğer (2 Hafta Önceki Cuma)</Label>
            </div>
          </RadioGroup>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="w-full border p-2 rounded"
          />

          {processing && <p className="text-blue-500">Dosya işleniyor...</p>}

          {downloadUrl && (
            <a
              href={downloadUrl}
              download="modified_file.xlsx"
              className="block text-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              📥 Dosyayı İndir
            </a>
          )}

          <Button onClick={() => setShowCalendar(!showCalendar)}>
            {showCalendar ? "Takvimi Gizle" : "Haftalık Takvimi Göster"}
          </Button>

          {showCalendar && (
            <div className="mt-4 max-h-[300px] overflow-y-auto border p-4 rounded bg-gray-100">
              <ul className="space-y-1">
                {generateWeeklyCalendar().map(({ weekNumber, date }) => (
                  <li key={weekNumber} className="text-sm">
                    <strong>CW {weekNumber}</strong>: {date}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
