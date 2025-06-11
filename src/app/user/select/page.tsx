"use client";

import { useEffect, useState } from "react";
import UserTeacherSelector from "@/components/User/UserTeacherSelector";
import { getUserId } from "@/lib/userId";
import BackButton from "@/components/Common/BackButton";


export default function UserHomePage() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const uid = getUserId();
    setUserId(uid);
  }, []);

  if (!userId) return null; // 初期化待ち

  return (
    <div>
      <BackButton href="/user/home" />
      <UserTeacherSelector />
      </div>
      );
}
