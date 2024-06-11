import AvailabilityForm from "@/components/AvailabilityForm";
import Calendar from "@/components/Calendar";
import { useState } from "react";

import styles from "./availability.module.css";

export default function Availability() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const onDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.container}>
      <Calendar
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      ></Calendar>
      <AvailabilityForm date={selectedDate} />
    </div>
  );
}
