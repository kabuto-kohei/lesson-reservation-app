// src/app/admin/dashboard/page.tsx
"use client";

import Link from "next/link";
import "./home.css";

export default function AdminDashboard() {
  return (
    <div className="container">
      <h1 className="title">管理者HOME</h1>
      <div className="menu">
        <Link href="/admin/select">講師選択</Link>
        <Link href="/admin/bookings">予約一覧</Link>
      </div>
    </div>
  );
}
