// app/calendar/page.tsx
"use client";

import { useState } from "react";
import Calendar from "@/components/Calendar/Calendar";

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const goPrev = () => {
    const prev = new Date(year, month - 1);
    setYear(prev.getFullYear());
    setMonth(prev.getMonth());
  };

  const goNext = () => {
    const next = new Date(year, month + 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  };

  return (
    <Calendar
      year={year}
      month={month}
      selectedDate={selectedDate}
      availableDates={["2025-06-10", "2025-06-12", "2025-06-15"]}
      onDateSelect={setSelectedDate}
      goPrev={goPrev}
      goNext={goNext}
    />
  );
}
