// src/lib/userId.ts
import { getAuth } from "firebase/auth";

export function getUserId(): string {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error("ユーザーがログインしていません");
  }
  return user.uid;
}
