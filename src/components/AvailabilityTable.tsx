import React from "react";
import { format, addDays, isSameDay } from "date-fns";
import styles from "./AvailabilityTable.module.css";
import { DayAvailability } from "@/pages/availability";
import { Employee } from "./EmployeeModal";
import axios from "axios";
import { useRouter } from "next/router";

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

const AvailabilityTable: React.FC<AvailabilityTableProps> = ({
  startOfCurrentWeek,
  employees,
  onDayClick,
}) => {
  const router = useRouter();

  const renderAvailabilityBlock = (availability: DayAvailability) => {
    const startHour = format(new Date(availability.startTime), "h:mm a");
    const endHour = format(new Date(availability.endTime), "h:mm a");
    return (
      <div key={availability.id} className={styles.availabilityBlock}>
        <span>
          {startHour} - {endHour}
        </span>
        {onDayClick && (
          <button
            className={styles.deleteButton}
            onClick={async () => {
              await axios.delete(`/api/availabilities`, { data: availability });
              router.reload(); // TODO: refactor availability page to avoid this reload
            }}
          >
            ×
          </button>
        )}
      </div>
    );
  };

  return (
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
                  {onDayClick && (
                    <button
                      className={styles.addButton}
                      onClick={() => onDayClick(date)}
                    >
                      +
                    </button>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AvailabilityTable;
