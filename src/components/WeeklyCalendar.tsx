import React from "react";
import { format, startOfWeek, addDays } from "date-fns";
import styles from "./WeeklyCalendar.module.css";

type WeeklyCalendarProps = {
  currentWeek: Date;
  onNextWeek: () => void;
  onPrevWeek: () => void;
};

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  currentWeek,
  onNextWeek,
  onPrevWeek,
}) => {
  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });

  return (
    <div className={styles.calendarHeader}>
      <button onClick={onPrevWeek} className={styles.button}>
        &lt;
      </button>
      <h2 className={styles.dateRange}>
        {format(startOfCurrentWeek, "MMMM d, yyyy")} -{" "}
        {format(addDays(startOfCurrentWeek, 6), "MMMM d, yyyy")}
      </h2>
      <button onClick={onNextWeek} className={styles.button}>
        &gt;
      </button>
    </div>
  );
};

export default WeeklyCalendar;
