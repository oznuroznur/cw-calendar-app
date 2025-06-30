"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRightFromLine, Download } from "lucide-react";

export function FileProcessorTool() {
  const [selectedOption, setSelectedOption] = useState<"turkiye" | "other">(
    "turkiye"
  );
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showWeeks, setShowWeeks] = useState(false);
  const [weeks, setWeeks] = useState<{ weekNumber: number; date: string }[]>(
    []
  );

  const calculateTurkeyDate = (cw: string) => {
    try {
      if (!cw.startsWith("CW")) return cw;
      const part = cw.split(" ")[1];
      const [week, year] = part.split("/").map(Number);
      const monday = new Date(year, 0, 1 + (week - 1) * 7);
      while (monday.getDay() !== 1) monday.setDate(monday.getDate() - 1);
      return monday.toLocaleDateString("tr-TR");
    } catch {
      return cw;
    }
  };

  const calculateOtherDate = (cw: string) => {
    try {
      if (!cw.startsWith("CW")) return cw;
      const part = cw.split(" ")[1];
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<{ Delivery_Date?: string }>(
          sheet
        );

        if (!json[0]?.Delivery_Date) {
          alert("'Delivery_Date' sütunu bulunamadı.");
          setProcessing(false);
          return;
        }

        const processed = json.map((row) => ({
          ...row,
          Modified_Delivery_Date:
            selectedOption === "turkiye"
              ? calculateTurkeyDate(row.Delivery_Date ?? "")
              : calculateOtherDate(row.Delivery_Date ?? ""),
        }));

        const newSheet = XLSX.utils.json_to_sheet(processed);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Sheet1");

        const wbout = XLSX.write(newWorkbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);

        setDownloadUrl(url);
      } catch (err) {
        console.error("Dosya işlenirken bir hata oluştu:", err);
        alert("Dosya işlenirken bir hata oluştu.");
      } finally {
        setProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const generatedWeeks = [];
    for (let week = 1; week <= 52; week++) {
      const monday = new Date(currentYear, 0, 1 + (week - 1) * 7);
      while (monday.getDay() !== 1) monday.setDate(monday.getDate() - 1);

      if (selectedOption === "turkiye") {
        generatedWeeks.push({
          weekNumber: week,
          date: monday.toLocaleDateString("tr-TR"),
        });
      } else {
        const prevMonday = new Date(monday);
        prevMonday.setDate(prevMonday.getDate() - 14);
        const friday = new Date(prevMonday);
        friday.setDate(friday.getDate() + 4);
        generatedWeeks.push({
          weekNumber: week,
          date: friday.toLocaleDateString("tr-TR"),
        });
      }
    }
    setWeeks(generatedWeeks);
  }, [selectedOption]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex flex-row justify-start items-center gap-x-2">
        Teslimat Dosya İşleyici <ArrowRightFromLine />{" "}
        <span className="text-violet-500">
          {selectedOption == "turkiye"
            ? "Türkiye (Hafta Başı)"
            : "Diğer (2 Hafta Önceki Cuma)"}{" "}
        </span>
      </h2>

      <RadioGroup
        value={selectedOption}
        onValueChange={(val) => setSelectedOption(val as "turkiye" | "other")}
        className="flex space-x-4"
      >
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
        className="w-full border rounded p-2"
      />

      {processing && (
        <p className="text-violet-500 animate-pulse">Dosya işleniyor...</p>
      )}

      {downloadUrl && (
        <a
          href={downloadUrl}
          download="modified_file.xlsx"
          className="block text-center bg-violet-500 text-white rounded p-2 hover:bg-violet-700 flex flex-row items-center justify-center gap-x-2  "
        >
          <Download /> Dosyayı İndir
        </a>
      )}

      <Button onClick={() => setShowWeeks(!showWeeks)}>
        {showWeeks ? "Hafta Listesini Gizle" : "Hafta Listesini Göster"}
      </Button>

      {showWeeks && (
        <div className="max-h-[400px] overflow-y-auto border rounded p-2 bg-gray-100">
          <ul className="space-y-1 text-sm">
            {weeks.map(({ weekNumber, date }) => (
              <li key={weekNumber}>
                <strong>CW {weekNumber}</strong>: {date}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
