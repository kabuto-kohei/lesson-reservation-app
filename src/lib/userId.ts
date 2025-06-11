// src/lib/userId.ts
import { getAuth } from "firebase/auth";

export function getUserId(): string | null {
  const user = getAuth().currentUser;
  return user?.uid ?? null;
}
