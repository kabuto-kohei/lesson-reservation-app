"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import Calendar from "@/components/Calendar/Calendar";
import styles from "./ScheduleManager.module.css";
import BackButton from "@/components/Common/BackButton";
import { getLessonTypeLabel } from "@/lib/lessonUtils";



export type Schedule = {
  id: string;
  date: string;
  time: string;
  capacity: number;
  lessonType?: string;
  memo?: string;
};

export default function ScheduleManager() {
  const params = useParams();
  const teacherId = params.teacherId as string;

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [lessonType, setLessonType] = useState("");
  const [memo, setMemo] = useState("");

  const selectedDateStr = selectedDate?.toISOString().split("T")[0];
  const filteredSchedules = allSchedules.filter((s) => s.date === selectedDateStr);

  const fetchSchedules = useCallback(async () => {
    const q = query(
      collection(db, "lessonSchedules"),
      where("teacherId", "==", teacherId)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc): Schedule => {
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
  }, [teacherId]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleAdd = async () => {
    if (!selectedDateStr || !time || capacity === "" || !lessonType) {
      alert("すべて入力してください");
      return;
    }

    const capacityNum = Number(capacity);
    if (isNaN(capacityNum) || capacityNum < 0) {
      alert("定員は0以上の数値で入力してください");
      return;
    }

    await addDoc(collection(db, "lessonSchedules"), {
      teacherId,
      date: selectedDateStr,
      time,
      capacity: capacityNum,
      lessonType,
      memo,
      createdAt: Timestamp.now(),
    });

    setTime("");
    setCapacity("");
    setLessonType("");
    setMemo("");
    await fetchSchedules();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "lessonSchedules", id));
    await fetchSchedules();
  };

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
    <div className={styles.container}>
      <BackButton href={`/admin/home/${teacherId}`} />
      <h1 className={styles.heading}>📅 予約枠の管理</h1>

      <Calendar
        year={year}
        month={month}
        selectedDate={selectedDate}
        availableDates={availableDates}
        onDateSelect={(date) => setSelectedDate(date)}
        goPrev={goPrev}
        goNext={goNext}
        mode="admin"
      />

      <h2 className={styles.subheading}>🕒 選択中の日付の予約枠</h2>
      <div className={styles.slots}>
      {filteredSchedules.length === 0 ? (
          <div className={styles.noSlot}>この日には予約枠がありません</div>
        ) : (
          filteredSchedules.map((s) => (
            <div key={s.id} className={styles.slotCard}>
              {s.time}（定員：{s.capacity}）
              {s.lessonType && ` - ${getLessonTypeLabel(s.lessonType)}`}
              <button onClick={() => handleDelete(s.id)}>削除</button>
            </div>
          ))
        )}
      </div>

      <h2 className={styles.subheading}>➕ 予約枠を追加</h2>
      <div className={styles.form}>
        <label>
          <span>開始時間</span>
          <select value={time} onChange={(e) => setTime(e.target.value)} className={styles.input}>
            {Array.from({ length: (22.5 - 9 + 1) * 2 }).map((_, i) => {
              const hour = 9 + Math.floor(i / 2);
              const minute = i % 2 === 0 ? "00" : "30";
              const h = String(hour).padStart(2, "0");
              const timeStr = `${h}:${minute}`;
              return (
                <option key={timeStr} value={timeStr}>
                  {timeStr}
                </option>
              );
            })}
          </select>
        </label>

        <label>
          <span>定員</span>
          <input
            type="number"
            className={styles.input}
            placeholder="定員"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            min="0"
          />
        </label>

        <label>
          <span>種別</span>
          <select
            value={lessonType}
            onChange={(e) => setLessonType(e.target.value)}
            className={styles.input}
          >
            <option value="">選択してください</option>
            <option value="reserve">スクール</option>
            <option value="trial">スクール体験</option>
            <option value="rope">ロープ講習</option>
          </select>
        </label>

        <label>
          <span>メモ</span>
          <input
            type="text"
            className={styles.input}
            placeholder="メモ"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </label>

        <button onClick={handleAdd} className={styles.confirmButton}>追加</button>
      </div>
    </div>
  );
}
