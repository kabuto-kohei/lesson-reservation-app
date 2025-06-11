"use client";

import { useState } from "react";
import BookingList from "@/components/User/BookingList";
import BackButton from "@/components/Common/BackButton";

export default function UserBookingListPage() {
  const [userName, setUserName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert("お名前を入力してください");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <BackButton href="/user/home" />
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        あなたの予約一覧
      </h1>

      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <label>
            お名前を入力してください：
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="例：山田 太郎"
              style={{ display: "block", padding: "8px", fontSize: "16px", marginTop: "8px", width: "100%" }}
            />
          </label>
          <button
            type="submit"
            style={{
              marginTop: "12px",
              padding: "8px 16px",
              fontSize: "16px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            確認する
          </button>
        </form>
      ) : (
        <BookingList userName={userName.trim()} />
      )}
    </div>
  );
}
