import { useState, useEffect } from "react";
import axios from "axios";
import {
  format,
  startOfWeek,
  addDays,
  subWeeks,
  addWeeks,
  isSameDay,
} from "date-fns";
import styles from "./EmployeeAvailability.module.css";
import { DayAvailability } from "@/pages/availability";
import { Employee } from "./EmployeeModal";
import Spinner from "@/components/Spinner"; // Import the Spinner component

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

  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const prevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const renderAvailabilityBlock = (availability: DayAvailability) => {
    const startHour = format(new Date(availability.startTime), "h:mm a");
    const endHour = format(new Date(availability.endTime), "h:mm a");
    return (
      <div key={availability.id} className={styles.availabilityBlock}>
        {startHour} - {endHour}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Employee Availability</h2>
      {loading ? (
        <></> // Don't render anything while loading
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div>
          <div className={styles.calendarHeader}>
            <button onClick={prevWeek} className={styles.button}>
              &lt;
            </button>
            <h2 className={styles.dateRange}>
              {format(startOfCurrentWeek, "MMMM d, yyyy")} -{" "}
              {format(addDays(startOfCurrentWeek, 6), "MMMM d, yyyy")}
            </h2>
            <button onClick={nextWeek} className={styles.button}>
              &gt;
            </button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee</th>
                {Array.from({ length: 7 }).map((_, index) => (
                  <th key={index}>
                    {format(addDays(startOfCurrentWeek, index), "EEE, MMM d")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.email}>
                  <td className={styles.employeeName}>
                    {employee.firstName} {employee.lastName}
                  </td>
                  {Array.from({ length: 7 }).map((_, index) => {
                    const date = addDays(startOfCurrentWeek, index);
                    const availability = employee.availabilities.filter((a) =>
                      isSameDay(new Date(a.day), date)
                    );
                    return (
                      <td key={index} className={styles.availabilityCell}>
                        <div className={styles.multipleAvailabilities}>
                          {availability.map((a) => renderAvailabilityBlock(a))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeAvailability;
