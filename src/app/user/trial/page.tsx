"use client";
import BookingCalendar from "@/components/User/Booking/BookingCalendar";
import BackButton from "@/components/Common/BackButton";


export default function TrialPage() {
  return (
      <div>
        <BackButton href="/user/home" />
        <BookingCalendar lessonType="rope" />;
      </div>
    );
}

  