import { useState, useEffect } from "react";
import axios from "axios";
import { startOfWeek, addWeeks, subWeeks } from "date-fns";
import styles from "./EmployeeAvailability.module.css";
import { DayAvailability } from "@/pages/availability";
import { Employee } from "./EmployeeModal";
import WeeklyCalendar from "./WeeklyCalendar";
import AvailabilityTable from "./AvailabilityTable";

type EmployeeAvailabilityData = {
  email: string;
  availabilities: DayAvailability[];
};

type EmployeeWithAvailability = Employee & EmployeeAvailabilityData;

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
    <div className={styles.container}>
      <h2 className={styles.title}>Employee Availability</h2>
      {loading ? (
        <></>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div>
          <WeeklyCalendar
            currentWeek={currentWeek}
            onNextWeek={nextWeek}
            onPrevWeek={prevWeek}
          />
          <AvailabilityTable
            startOfCurrentWeek={startOfCurrentWeek}
            employees={employees}
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeAvailability;
