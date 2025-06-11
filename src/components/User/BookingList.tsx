"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import styles from "./BookingList.module.css";
import { getLessonTypeLabel } from "@/lib/lessonUtils";

interface Booking {
  id: string;
  scheduleId: string;
  createdAt: Timestamp;
}

interface Schedule {
  id: string;
  date: string;
  time: string;
  lessonType?: string;
  memo?: string;
  capacity: number;
}

export default function BookingList({ userId }: { userId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [scheduleMap, setScheduleMap] = useState<Record<string, Schedule>>({});

  useEffect(() => {
    const fetchBookings = async () => {
      const q = query(collection(db, "bookings"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const data: Booking[] = snapshot.docs.map((doc) => {
        const d = doc.data() as Omit<Booking, "id">;
        return {
          ...d,
          id: doc.id,
        };
      });
      setBookings(data);

      const schedulePromises = data.map((b) =>
        getDoc(doc(db, "lessonSchedules", b.scheduleId))
      );
      const scheduleSnapshots = await Promise.all(schedulePromises);

      const map: Record<string, Schedule> = {};
      scheduleSnapshots.forEach((snap, index) => {
        if (snap.exists()) {
          const schedule = snap.data() as Schedule;
          map[data[index].scheduleId] = {
            ...schedule,
            id: data[index].scheduleId,
          };
        }
      });
      setScheduleMap(map);
    };

    fetchBookings();
  }, [userId]);

  const handleCancel = async (id: string) => {
    if (!confirm("本当にキャンセルしますか？")) return;
    await deleteDoc(doc(db, "bookings", id));
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📋 予約一覧</h2>
      {bookings.length === 0 ? (
        <p className={styles.empty}>予約はありません</p>
      ) : (
        <ul className={styles.list}>
          {bookings.map((b) => {
            const s = scheduleMap[b.scheduleId];
            if (!s) return null;

            return (
              <li key={b.id} className={styles.item}>
                <div>
                  <strong>
                    {s.date} {s.time}
                  </strong>
                  （{getLessonTypeLabel(s.lessonType ?? "")}）
                  {s.memo && (
                    <>
                      <br />
                      <span>📝 {s.memo}</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => handleCancel(b.id)}
                  className={styles.cancel}
                >
                  キャンセル
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
