import React from "react";
import { format, addDays, isSameDay } from "date-fns";
import styles from "./AvailabilityTable.module.css";
import { DayAvailability } from "@/pages/availability";
import { Employee } from "./EmployeeModal";

type EmployeeAvailabilityData = {
  email: string;
  availabilities: DayAvailability[];
};

type EmployeeWithAvailability = Employee & EmployeeAvailabilityData;

type AvailabilityTableProps = {
  startOfCurrentWeek: Date;
  employees: EmployeeWithAvailability[];
};

const AvailabilityTable: React.FC<AvailabilityTableProps> = ({
  startOfCurrentWeek,
  employees,
}) => {
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
  );
};

export default AvailabilityTable;
