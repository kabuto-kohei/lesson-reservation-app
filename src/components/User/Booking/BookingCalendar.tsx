"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import styles from "./BookingCalendar.module.css";
import type { Schedule } from "@/types/schedule";
import Calendar from "@/components/Calendar/Calendar";
import { getLessonTypeLabel } from "@/lib/lessonUtils";

export default function BookingCalendar({
  teacherId,
  lessonType,
}: {
  teacherId?: string;
  lessonType?: string;
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const [userName, setUserName] = useState<string>("");

  const selectedDateStr = selectedDate?.toISOString().split("T")[0];
  const schedulesForDay = allSchedules.filter((s) => s.date === selectedDateStr);

  const fetchSchedules = useCallback(async () => {
    const conditions = [];

    if (teacherId) {
      conditions.push(where("teacherId", "==", teacherId));
    }

    if (lessonType) {
      conditions.push(where("lessonType", "==", lessonType));
    }

    const q = query(collection(db, "lessonSchedules"), ...conditions);
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        date: d.date,
        time: d.time,
        capacity: d.capacity,
        lessonType: d.lessonType,
        memo: d.memo,
      };
    });

    setAllSchedules(data);
    setAvailableDates([...new Set(data.map((d) => d.date))]);
  }, [teacherId, lessonType]);

  const fetchBookingCounts = useCallback(async () => {
    const snapshot = await getDocs(collection(db, "bookings"));
    const countMap: Record<string, number> = {};
    snapshot.docs.forEach((doc) => {
      const d = doc.data();
      if (d.scheduleId) {
        countMap[d.scheduleId] = (countMap[d.scheduleId] || 0) + 1;
      }
    });
    setBookingCounts(countMap);
  }, []);

  useEffect(() => {
    fetchSchedules();
    fetchBookingCounts();
  }, [fetchSchedules, fetchBookingCounts]);

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

  const handleConfirm = async () => {
    if (!selectedScheduleId || !userName.trim()) {
      alert("予約枠とお名前を入力してください");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        scheduleId: selectedScheduleId,
        userName: userName.trim(),
        createdAt: Timestamp.now(),
      });
      alert("予約が完了しました！");
      setSelectedScheduleId(null);
      setUserName("");
      fetchBookingCounts();
    } catch (error) {
      console.error("予約失敗:", error);
      alert("予約に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🗓️予約日を選択</h1>
      <Calendar
        year={year}
        month={month}
        selectedDate={selectedDate}
        availableDates={availableDates}
        onDateSelect={(date) => {
          setSelectedDate(date);
          setSelectedScheduleId(null);
        }}
        goPrev={goPrev}
        goNext={goNext}
      />

      <h2 className={styles.subheading}>⏰時間帯を選択</h2>
      <div className={styles.slots}>
        {schedulesForDay.length === 0 ? (
          <div className={styles.noSlot}>この日には予約枠がありません</div>
        ) : (
          schedulesForDay.map((s) => {
            const count = bookingCounts[s.id] || 0;
            const isFull = count >= s.capacity;
            return (
              <label
                key={s.id}
                className={`${styles.slot} ${selectedScheduleId === s.id ? styles.selected : ""} ${isFull ? styles.full : ""}`}
              >
                <input
                  type="radio"
                  name="slot"
                  disabled={isFull}
                  checked={selectedScheduleId === s.id}
                  onChange={() => setSelectedScheduleId(s.id)}
                />
                {s.time}（定員：{s.capacity}・予約済：{count}）
                {s.lessonType && ` - ${getLessonTypeLabel(s.lessonType)}`}
                {isFull && " ❌満席"}
              </label>
            );
          })
        )}
      </div>

      <div className={styles.inputWrapper}>
        <label>
          お名前：
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="お名前を入力"
            className={styles.inputField}
          />
        </label>
      </div>

      <div className={styles.footer}>
        <button
          disabled={!selectedScheduleId || !userName.trim()}
          className={styles.confirmButton}
          onClick={handleConfirm}
        >
          予約確認
        </button>
      </div>
    </div>
  );
}
