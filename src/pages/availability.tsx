import styles from "./availability.module.css";
import AvailabilityForm from "@/components/AvailabilityForm";
import Calendar from "@/components/Calendar";
import { useEffect, useState } from "react";
import { isSameDay } from "date-fns";
import axios from "axios";
import { useRouter } from "next/router";

export type DayAvailability = {
  id: number;
  userId: number;
  day: Date;
  startTime: Date;
  endTime: Date;
};

type QueryParams = {
  token?: string;
};

export default function Availability() {
  const router = useRouter();
  const { token } = router.query as QueryParams;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availability, setAvailability] = useState<DayAvailability[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchAvailability = async () => {
      try {
        const response = await axios.get("/api/availabilities", {
          params: { token },
        });
        setAvailability(response.data);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [selectedDate, token]);

  if (!token) {
    // TODO: Handle this case better
    return <div>Invalid availability request link.</div>;
  }

  return (
    <div className={styles.container}>
      <Calendar
        availability={availability}
        selectedDate={selectedDate}
        onDateChange={(date: Date) => setSelectedDate(date)}
      ></Calendar>
      <AvailabilityForm
        token={token}
        date={selectedDate}
        dayAvailability={availability.find((a) => {
          return isSameDay(a.day, selectedDate);
        })}
      />
    </div>
  );
}
