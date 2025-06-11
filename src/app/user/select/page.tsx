"use client";

import UserTeacherSelector from "@/components/User/UserTeacherSelector";
import BackButton from "@/components/Common/BackButton";

export default function UserHomePage() {
  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <BackButton href="/user/home" />
      <UserTeacherSelector />
    </div>
  );
}
