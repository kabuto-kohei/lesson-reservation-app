"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import styles from "./TeacherSelector.module.css";

type Teacher = {
  id: string;
  name: string;
  description: string;
};

export default function TeacherSelector() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      const snapshot = await getDocs(collection(db, "teachers"));
      const data = snapshot.docs.map((doc) => {
        const { name, description } = doc.data();
        return {
          id: doc.id,
          name,
          description,
        };
      });
      setTeachers(data);
    };
    fetchTeachers();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>講師選択</h1>
      <select
        onChange={(e) => {
          const selectedId = e.target.value;
          if (selectedId) {
            router.push(`/admin/home/${selectedId}`);
          }
        }}
        defaultValue=""
        className={styles.select}
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
