import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  subMonths,
  addMonths,
} from "date-fns";
import classNames from "classnames";

import styles from "./Calendar.module.css";

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, dateFormat);
      const dayClone = new Date(day);
      days.push(
        <div
          className={classNames(styles.col, styles.cell, {
            [styles.disabled]: !isSameMonth(day, monthStart),
            [styles.selected]: isSameDay(day, selectedDate),
          })}
          key={dayClone.toString()}
          onClick={() => onDateChange(dayClone)}
        >
          <span className={styles.number}>{formattedDate}</span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className={styles.row} key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={prevMonth} className={styles.button}>
          &lt;
        </button>
        <h2>{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={nextMonth} className={styles.button}>
          &gt;
        </button>
      </div>
      {rows}
    </div>
  );
};

export default Calendar;
