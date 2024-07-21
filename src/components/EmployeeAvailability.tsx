import { useState, useEffect } from "react";
import axios from "axios";
import { startOfWeek, addWeeks, subWeeks } from "date-fns";
import {
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Container,
} from "@mui/material";
import { DayAvailability } from "@/pages/availability";
import { Employee } from "./EmployeeModal";
import WeeklyCalendar from "./WeeklyCalendar";
import AvailabilityTable from "./AvailabilityTable";

export type EmployeeAvailabilityData = {
  email: string;
  availabilities: DayAvailability[];
};

export type EmployeeWithAvailability = Employee & EmployeeAvailabilityData;

const EmployeeAvailability: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [employees, setEmployees] = useState<EmployeeWithAvailability[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const employeesResponse = await axios.get("/api/employees");
        const availabilitiesResponse = await axios.get("/api/availabilities");

        const employeesData = employeesResponse.data.map((employee: any) => ({
          ...employee,
          availabilities: availabilitiesResponse.data
            .filter(
              (ar: EmployeeAvailabilityData) => ar.email === employee.email
            )
            .flatMap((ar: EmployeeAvailabilityData) => ar.availabilities),
        }));

        setEmployees(employeesData);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const prevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        Employee Availability
      </Typography>
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "16px auto" }} />
      ) : error ? (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      ) : (
        <>
          <WeeklyCalendar
            currentWeek={currentWeek}
            onNextWeek={nextWeek}
            onPrevWeek={prevWeek}
          />
          <AvailabilityTable
            startOfCurrentWeek={startOfCurrentWeek}
            employees={employees}
          />
        </>
      )}
    </>
  );
};

export default EmployeeAvailability;
