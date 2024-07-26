import React from "react";
import { format, addDays, isSameDay } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Typography,
  Fab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { DayAvailability } from "@/pages/availability";
import { Employee } from "./EmployeeModal";
import axios from "axios";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";

type EmployeeAvailabilityData = {
  email: string;
  availabilities: DayAvailability[];
};

type EmployeeWithAvailability = Employee & EmployeeAvailabilityData;

type AvailabilityTableProps = {
  startOfCurrentWeek: Date;
  employees: EmployeeWithAvailability[];
  onDayClick?: (day: Date) => void;
};

const DAYS_IN_WEEK = 7;

const AvailabilityTable: React.FC<AvailabilityTableProps> = ({
  startOfCurrentWeek,
  employees,
  onDayClick,
}) => {
  const router = useRouter();
  const theme = useTheme();

  const renderAvailabilityBlock = (availability: DayAvailability) => {
    const startHour = format(availability.startTime, "h:mm a");
    const endHour = format(availability.endTime, "h:mm a");
    return (
      <Box
        key={availability.id}
        sx={{
          backgroundColor: theme.palette.success.light,
          borderRadius: "4px",
          padding: "4px 6px",
          fontSize: "12px",
          marginBottom: "5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          {startHour} - {endHour}
        </span>
        {onDayClick && (
          <IconButton
            size="small"
            color="error"
            onClick={async () => {
              await axios.delete(`/api/availabilities`, { data: availability });
              router.reload(); // TODO: refactor availability page to avoid this reload
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            {Array.from({ length: DAYS_IN_WEEK }).map((_, index) => (
              <TableCell key={index}>
                {format(addDays(startOfCurrentWeek, index), "EEE, MMM d")}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.email}>
              <TableCell>
                <Typography fontWeight="bold">
                  {employee.firstName} {employee.lastName}
                </Typography>
              </TableCell>
              {Array.from({ length: 7 }).map((_, index) => {
                const date = addDays(startOfCurrentWeek, index);
                let availability = employee.availabilities
                  .filter((a) => isSameDay(a.day, date))
                  .sort(
                    (a, b) => a.startTime.valueOf() - b.startTime.valueOf()
                  );

                return (
                  <TableCell key={index} sx={{ position: "relative" }}>
                    <Box display="flex" flexDirection="column" gap={1}>
                      {availability.map((a) => renderAvailabilityBlock(a))}
                    </Box>
                    {onDayClick && (
                      <>
                        <Box sx={{ height: "40px" }}></Box>
                        <Fab
                          color="primary"
                          size="small"
                          onClick={() => onDayClick(date)}
                          sx={{
                            position: "absolute",
                            bottom: "8px",
                            right: "8px",
                            zIndex: 1,
                          }}
                        >
                          <AddIcon />
                        </Fab>
                      </>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AvailabilityTable;
