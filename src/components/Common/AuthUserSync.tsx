// src/components/Common/AuthUserSync.tsx
"use client";

import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

export default function AuthUserSync() {
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          await setDoc(userRef, {
            displayName: user.displayName || "未設定",
            email: user.email || "",
            photoURL: user.photoURL || "",
            createdAt: Timestamp.now(),
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
