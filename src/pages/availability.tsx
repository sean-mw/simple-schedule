import AvailabilityForm from "@/components/AvailabilityForm";
import Calendar from "@/components/Calendar";
import { useEffect, useState } from "react";
import { isSameDay } from "date-fns";
import axios from "axios";

import styles from "./availability.module.css";

export type DayAvailability = {
  id: number;
  userId: number;
  day: Date;
  startTime: Date;
  endTime: Date;
};

export default function Availability() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availability, setAvailability] = useState<DayAvailability[]>([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const userId = 1; // Replace with actual user ID from context or props
        const response = await axios.get("/api/availability", {
          params: { userId },
        });
        setAvailability(response.data);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [selectedDate]);

  const onDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.container}>
      <Calendar
        availability={availability}
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      ></Calendar>
      <AvailabilityForm
        date={selectedDate}
        dayAvailability={availability.find((a) => {
          return isSameDay(a.day, selectedDate);
        })}
      />
    </div>
  );
}
