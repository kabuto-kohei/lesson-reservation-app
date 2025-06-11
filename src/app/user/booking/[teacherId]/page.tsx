// src/app/user/booking/[teacherId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import BookingCalendar from "@/components/User/Booking/BookingCalendar";
import BackButton from "@/components/Common/BackButton";

export default function BookingPage() {
  const params = useParams();
  const teacherId = params.teacherId as string;

  return (
  <div>
  <BackButton href={`/user/select`} />
  <BookingCalendar teacherId={teacherId} />
  </div>
  )
}
