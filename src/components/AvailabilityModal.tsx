import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { DayAvailability } from "@/pages/availability";
import axios from "axios";
import { Typography, Alert, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useRouter } from "next/router";

type AvailabilityModalProps = {
  token: string;
  date: Date;
  dayAvailability?: DayAvailability;
  onClose: () => void;
};

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  token,
  date,
  dayAvailability,
  onClose,
}) => {
  const router = useRouter();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (dayAvailability) {
      if (dayAvailability.startTime) {
        setStartTime(new Date(dayAvailability.startTime));
      }
      if (dayAvailability.endTime) {
        setEndTime(new Date(dayAvailability.endTime));
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

    const availability = {
      token,
      day: date,
      startTime,
      endTime,
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

  return (
    <Modal title="Add Availability" onClose={onClose}>
      <Typography variant="h5" align="center" gutterBottom>
        Availability for {date.toDateString()}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              minutesStep={15}
              views={["hours"]}
              ampm
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />
          </Box>
          <Box mb={2}>
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              minutesStep={15}
              views={["hours"]}
              ampm
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />
          </Box>
          <LoadingButton
            type="submit"
            variant="contained"
            color={isSuccess ? "success" : "primary"}
            fullWidth
            loading={isLoading}
            loadingPosition="start"
            startIcon={isSuccess ? <CheckCircleIcon /> : null}
            sx={{ mt: 2 }}
          >
            {isSuccess ? "Success" : "Submit"}
          </LoadingButton>
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <ErrorIcon fontSize="inherit" sx={{ mr: 1 }} />
              {errorMessage}
            </Alert>
          )}
        </form>
      </LocalizationProvider>
    </Modal>
  );
};

export default AvailabilityModal;
