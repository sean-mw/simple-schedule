import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { DayAvailability } from "@/pages/availability";
import axios from "axios";
import {
  Typography,
  Alert,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/router";

type AvailabilityModalProps = {
  token: string;
  date: Date;
  dayAvailability?: DayAvailability;
  onClose: () => void;
};

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const displayMinute = minute.toString().padStart(2, "0");
      times.push(`${hour}:${displayMinute}`);
    }
  }
  return times;
};

const convertToDate = (time: string, period: string, date: Date) => {
  const [hour, minute] = time.split(":").map(Number);
  const adjustedHour =
    period === "PM" && hour !== 12
      ? hour + 12
      : hour === 12 && period === "AM"
      ? 0
      : hour;
  const newDate = new Date(date);
  newDate.setHours(adjustedHour, minute);
  return newDate;
};

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  token,
  date,
  dayAvailability,
  onClose,
}) => {
  const router = useRouter();
  const [startTime, setStartTime] = useState<string | null>(null);
  const [startPeriod, setStartPeriod] = useState<string | null>("AM");
  const [endTime, setEndTime] = useState<string | null>(null);
  const [endPeriod, setEndPeriod] = useState<string | null>("AM");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (dayAvailability) {
      if (dayAvailability.startTime) {
        const start = new Date(dayAvailability.startTime);
        setStartTime(
          start
            .toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .slice(0, -3)
        );
        setStartPeriod(start.getHours() < 12 ? "AM" : "PM");
      }
      if (dayAvailability.endTime) {
        const end = new Date(dayAvailability.endTime);
        setEndTime(
          end
            .toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .slice(0, -3)
        );
        setEndPeriod(end.getHours() < 12 ? "AM" : "PM");
      }
    } else {
      setStartTime(null);
      setEndTime(null);
    }
  }, [date, dayAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setErrorMessage("");

    const start = convertToDate(startTime!, startPeriod!, date);
    const end = convertToDate(endTime!, endPeriod!, date);

    const availability = {
      token,
      day: date,
      startTime: start,
      endTime: end,
    };

    try {
      await axios.post("/api/availabilities", availability);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        router.reload(); // TODO: refactor availability page to avoid this reload
      }, 2000);
    } catch (error) {
      setErrorMessage("Failed to submit availability. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const timeOptions = generateTimeOptions();

  return (
    <Modal title="Add Availability" onClose={onClose}>
      <Typography variant="h5" align="center" gutterBottom mb={2}>
        Availability for {date.toDateString()}
      </Typography>
      {errorMessage && (
        <Alert severity="error" sx={{ my: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Box mb={2} display="flex" gap={2}>
          <FormControl fullWidth required>
            <InputLabel id="start-time-label">Start Time</InputLabel>
            <Select
              labelId="start-time-label"
              value={startTime || ""}
              onChange={(e) => setStartTime(e.target.value as string)}
              label="Start Time"
            >
              {timeOptions.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }} required>
            <InputLabel id="start-period-label">AM/PM</InputLabel>
            <Select
              labelId="start-period-label"
              value={startPeriod || ""}
              onChange={(e) => setStartPeriod(e.target.value as string)}
              label="AM/PM"
            >
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="PM">PM</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box mb={2} display="flex" gap={2}>
          <FormControl fullWidth required>
            <InputLabel id="end-time-label">End Time</InputLabel>
            <Select
              labelId="end-time-label"
              value={endTime || ""}
              onChange={(e) => setEndTime(e.target.value as string)}
              label="End Time"
            >
              {timeOptions.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }} required>
            <InputLabel id="end-period-label">AM/PM</InputLabel>
            <Select
              labelId="end-period-label"
              value={endPeriod || ""}
              onChange={(e) => setEndPeriod(e.target.value as string)}
              label="AM/PM"
            >
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="PM">PM</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <LoadingButton
          type="submit"
          variant="contained"
          color={isSuccess ? "success" : "primary"}
          fullWidth
          loading={isLoading}
          loadingPosition="start"
          startIcon={isSuccess ? <CheckCircleIcon /> : null}
        >
          {isSuccess ? "Success" : "Submit"}
        </LoadingButton>
      </form>
    </Modal>
  );
};

export default AvailabilityModal;
