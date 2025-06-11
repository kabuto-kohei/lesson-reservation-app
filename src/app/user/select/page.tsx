"use client";

import UserTeacherSelector from "@/components/User/UserTeacherSelector";
import BackButton from "@/components/Common/BackButton";

export default function UserHomePage() {
  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <BackButton href="/" />
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        スクールを選んでください
      </h1>
      <UserTeacherSelector />
    </div>
  );
}
