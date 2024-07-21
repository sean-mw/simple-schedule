import { useEffect, useState } from "react";
import { addWeeks, startOfWeek, subWeeks } from "date-fns";
import axios from "axios";
import { useRouter } from "next/router";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import AvailabilityTable from "@/components/AvailabilityTable";
import { Employee } from "@/components/EmployeeModal";
import {
  EmployeeAvailabilityData,
  EmployeeWithAvailability,
} from "@/components/EmployeeAvailability";
import AvailabilityModal from "@/components/AvailabilityModal";
import { Box, Typography } from "@mui/material";

export type DayAvailability = {
  id: number;
  userId: number;
  day: Date;
  startTime: Date;
  endTime: Date;
};

type QueryParams = {
  token?: string;
};

export default function Availability() {
  const router = useRouter();
  const { token } = router.query as QueryParams;
  const [employees, setEmployees] = useState<EmployeeWithAvailability[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [clickedDay, setClickedDay] = useState<Date | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchEmployeeAvailability = async () => {
      try {
        const employeesResponse = await axios.get("/api/employees", {
          params: { token },
        });
        const email = employeesResponse.data[0].email;
        const availabilitiesResponse = await axios.get("/api/availabilities", {
          params: { email },
        });
        const employeesData = employeesResponse.data.map((employee: any) => ({
          ...employee,
          availabilities: availabilitiesResponse.data
            .filter(
              (ar: EmployeeAvailabilityData) => ar.email === employee.email
            )
            .flatMap((ar: EmployeeAvailabilityData) => ar.availabilities),
        }));
        setEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployeeAvailability();
  }, [token]);

  if (!token) {
    // TODO: Handle this case better
    return (
      <Typography variant="h6" color="error">
        Invalid availability request link.
      </Typography>
    );
  }

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const prevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Select Your Availability
      </Typography>
      <WeeklyCalendar
        currentWeek={currentWeek}
        onNextWeek={nextWeek}
        onPrevWeek={prevWeek}
      />
      <AvailabilityTable
        startOfCurrentWeek={startOfCurrentWeek}
        employees={employees}
        onDayClick={async (day: Date) => {
          setClickedDay(day);
          setShowAvailabilityModal(true);
        }}
      />
      {showAvailabilityModal && clickedDay && (
        <AvailabilityModal
          token={token}
          date={clickedDay}
          onClose={() => setShowAvailabilityModal(false)}
        />
      )}
    </Box>
  );
}
