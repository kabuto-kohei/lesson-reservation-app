// src/app/admin/bookings/[teacherId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import styles from "./page.module.css";
import BackButton from "@/components/Common/BackButton";

type Booking = {
  id: string;
  scheduleId: string;
  userName: string;
};

type Schedule = {
  id: string;
  date: string;
};

export default function BookingListPage() {
  const { teacherId } = useParams();
  const [grouped, setGrouped] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      // スケジュール取得
      const scheduleSnap = await getDocs(
        query(collection(db, "lessonSchedules"), where("teacherId", "==", teacherId))
      );
      const schedules: Schedule[] = scheduleSnap.docs.map((doc) => ({
        id: doc.id,
        date: doc.data().date,
      }));
      const scheduleMap = Object.fromEntries(schedules.map(s => [s.id, s.date]));

      // 予約取得（userNameで取得）
      const bookingSnap = await getDocs(collection(db, "bookings"));
      const bookings: Booking[] = bookingSnap.docs.map((doc) => ({
        id: doc.id,
        scheduleId: doc.data().scheduleId,
        userName: doc.data().userName || "（名前未入力）",
      })).filter(b => scheduleMap[b.scheduleId]);

      // 日付ごとに名前でグループ化
      const groupedByDate: Record<string, string[]> = {};
      for (const b of bookings) {
        const date = scheduleMap[b.scheduleId];
        if (!groupedByDate[date]) groupedByDate[date] = [];
        groupedByDate[date].push(b.userName);
      }

      setGrouped(groupedByDate);
      setLoading(false);
    };

    fetchAll();
  }, [teacherId]);

  return (
    <main className={styles.container}>
      <BackButton href={`/admin/home/[teacherId]`} />
      <h1 className={styles.title}>予約一覧</h1>
      {loading ? (
        <p>読み込み中...</p>
      ) : Object.keys(grouped).length === 0 ? (
        <p>予約はまだありません。</p>
      ) : (
        <ul className={styles.list}>
          {Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, names]) => (
              <li key={date} className={styles.item}>
                <strong>{date}（{names.length}名）</strong>
                <ul className={styles.nameList}>
                  {names.map((name, idx) => (
                    <li key={idx}>{name}</li>
                  ))}
                </ul>
              </li>
            ))}
        </ul>
      )}
    </main>
  );
}
