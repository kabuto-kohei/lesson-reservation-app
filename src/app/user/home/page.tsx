"use client";

import Link from "next/link";
import "./home.css";

export default function UserHomeMenu() {
  return (
    <main className="home-container">
      <h1 className="home-heading">メニュー選択</h1>
      <div className="home-buttons">
      <Link href="/user/select" className="home-button blue">スクール予約</Link>
      <Link href="/user/trial" className="home-button green">スクール体験</Link>
      <Link href="/user/rope" className="home-button orange">ロープ講習</Link>
      <Link href="/user/booking" className="home-button purple">予約一覧</Link>
      </div>
    </main>
  );
}
