// src/app/user/booking/page.tsx
"use client";

import { useEffect, useState } from "react";
import BookingList from "@/components/User/BookingList";
import { getUserId } from "@/lib/userId";
import BackButton from "@/components/Common/BackButton";

export default function UserBookingListPage() {
  const [userId, setUserId] = useState<string | null>(null); // ← null 許可

useEffect(() => {
  const uid = getUserId();
  setUserId(uid); // ← uid が null でもOKになる
}, []);


  if (!userId) return null;

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <BackButton href="/user/home" />
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        あなたの予約一覧
      </h1>
      <BookingList userId={userId} />
    </div>
  );
}
