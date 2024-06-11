import React, { useState } from "react";
import styles from "./AvailabilityForm.module.css";

type AvailabilityFormProps = {
  date: Date;
};

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ date }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const availability = {
      date,
      startTime,
      endTime,
      notes,
    };
    // TODO: handle the form submission
    console.log("Availability Submitted:", availability);
  };

  return (
    <div className={styles.container}>
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
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AvailabilityForm;
