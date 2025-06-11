// src/app/admin/home/[teacherId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import BackButton from "@/components/Common/BackButton";


export default function AdminTeacherHome() {
  const { teacherId } = useParams();

  return (
    <main className={styles.container}>
      <BackButton href={`/admin/select`} />

      <h1 className={styles.title}>講師メニュー</h1>
      <div className={styles.menu}>
        <Link href={`/admin/schedule/${teacherId}`} className={styles.link}>
          📅 予約追加
        </Link>
        <Link href={`/admin/bookings/${teacherId}`} className={styles.link}>
          📖 予約一覧
        </Link>
      </div>
    </main>
  );
}
