"use client";

import React from "react";
import styles from "./Calendar.module.css";
import { getCalendarMatrix } from "@/components/utils/calendarUtils";

export type CalendarProps = {
  year: number;
  month: number;
  selectedDate: Date | null;
  availableDates: string[];
  onDateSelect: (date: Date) => void;
  goPrev: () => void;
  goNext: () => void;
  mode?: "user" | "admin";
};

export default function Calendar({
  year,
  month,
  selectedDate,
  availableDates,
  onDateSelect,
  goPrev,
  goNext,
  mode = "user",
}: CalendarProps) {
  const dates = getCalendarMatrix(year, month);

  const isClickable = (dateStr: string) => {
    return mode === "admin" || availableDates.includes(dateStr);
  };

  return (
    <div className={styles.wrapper}>
      {/* 月ナビゲーション表示 */}
      <div className={styles.nav}>
        <button onClick={goPrev}>＜</button>
        <span className={styles.monthLabel}>{year}年 {month + 1}月</span>
        <button onClick={goNext}>＞</button>
      </div>

      <div className={styles.grid}>
        {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
          <div
            key={d}
            className={`${styles.dayLabel} ${
              i === 0 ? styles.sunday : i === 6 ? styles.saturday : ""
            }`}
          >
            {d}
          </div>
        ))}

        {dates.map((date, i) => {
          if (!date) return <div key={i} className={styles.dateCell} />;

          const isThisMonth = date.getMonth() === month;
          const iso = date.toISOString().split("T")[0];
          const clickable = isThisMonth && isClickable(iso);
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          const isAvailable = availableDates.includes(iso);

          return (
            <div
              key={i}
              className={`
                ${styles.dateCell}
                ${isSelected ? styles.selected : ""}
                ${!clickable ? styles.disabled : ""}
                ${!isThisMonth ? styles.outsideMonth : ""}
              `}
              onClick={() => clickable && onDateSelect(date)}
            >
              {date.getDate()}
              {isAvailable && <div className={styles.circle}>◯</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
