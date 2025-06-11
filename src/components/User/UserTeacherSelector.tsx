"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import styles from "./UserTeacherSelector.module.css";

type Teacher = {
  id: string;
  name: string;
  description: string;
};

export default function UserTeacherSelector() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      const querySnapshot = await getDocs(collection(db, "teachers"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Teacher[];
      setTeachers(data);
    };

    fetchTeachers();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🧗 講師選択</h1>
  
      <select
          className={styles.select}
          onChange={(e) => {
            const selectedId = e.target.value;
            if (selectedId) {
              window.location.href = `/user/booking/${selectedId}`;
            }
          }}
          defaultValue=""
        >

        <option value="" disabled>
          講師を選択してください
        </option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.name}
          </option>
        ))}
      </select>
    </div>
  );
  
}
