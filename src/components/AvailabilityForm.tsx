import styles from "./AvailabilityForm.module.css";
import React, { useEffect, useState } from "react";
import { DayAvailability } from "@/pages/availability";
import { format } from "date-fns";
import axios from "axios";
import { on } from "events";

type AvailabilityFormProps = {
  token: string;
  date: Date;
  dayAvailability?: DayAvailability;
  onSuccess?: () => void;
};

const formatTime = (date: Date) => format(date, "HH:mm:ss");

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  token,
  date,
  dayAvailability,
  onSuccess,
}) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (dayAvailability) {
      if (dayAvailability.startTime) {
        setStartTime(formatTime(dayAvailability.startTime));
      }
      if (dayAvailability.endTime) {
        setEndTime(formatTime(dayAvailability.endTime));
      }
    } else {
      setStartTime("");
      setEndTime("");
    }
  }, [date, dayAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setErrorMessage("");

    const timeStringToDate = (timeString: string) => {
      const [hours, minutes] = timeString.split(":").map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(0);
      return date;
    };

    const availability = {
      token,
      day: date,
      startTime: timeStringToDate(startTime),
      endTime: timeStringToDate(endTime),
      notes: notes,
    };

    try {
      await axios.post("/api/availabilities", availability);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess && onSuccess();
      }, 2000);
    } catch (error) {
      setErrorMessage("Failed to submit availability. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className={styles.spinnerOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}
      {isSuccess && !isLoading && (
        <div className={styles.checkmarkOverlay}>
          <svg
            className={styles.checkmark}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className={styles.checkmark__circle}
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className={styles.checkmark__check}
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
      )}
      <h2 className={styles.heading}>Availability for {date.toDateString()}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Start Time:
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={styles.input}
              required
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            End Time:
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={styles.input}
              required
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Notes:
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={styles.textarea}
              rows={4}
              cols={50}
            />
          </label>
        </div>
        <button type="submit" className={styles.button} disabled={isLoading}>
          Submit
        </button>
      </form>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default AvailabilityForm;
