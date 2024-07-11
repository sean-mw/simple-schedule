import styles from "./Admin.module.css";
import { useState } from "react";
import axios from "axios";
import EmployeeModal, { Employee } from "@/components/EmployeeModal";

export default function Admin() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddEmployee = (employee: Employee) => {
    const email = employee.email;
    const existingEmployee = employees.find((e) => e.email === email);
    if (existingEmployee) {
      setErrorMessage("Employee already exists");
      setTimeout(() => setErrorMessage(""), 3000);
    } else {
      setEmployees([...employees, employee]);
    }
  };

  const handleSendEmails = async () => {
    const emails = selectedEmployees.map((e) => e.email);
    await axios.post("/api/availability-request", { emails });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees);
    }
    setSelectAll(!selectAll);
  };

  const handleEmployeeSelection = (employee: Employee) => {
    if (selectedEmployees.includes(employee)) {
      setSelectedEmployees(selectedEmployees.filter((e) => e !== employee));
      if (selectAll) {
        setSelectAll(false);
      }
    } else {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Send Availability Requests</h1>
      <button className={styles.button} onClick={() => setShowModal(true)}>
        Add Employee
      </button>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      {employees.length > 0 && (
        <>
          <div className={styles.formGroup}>
            <div className={styles.selectAllContainer}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <label>Select All</label>
            </div>
            <div className={styles.employeeList}>
              {employees.map((employee) => (
                <div key={employee.email} className={styles.employeeItem}>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee)}
                    onChange={() => handleEmployeeSelection(employee)}
                  />
                  <div className={styles.employeeInfo}>
                    <div className={styles.employeeName}>
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div className={styles.employeeEmail}>{employee.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <button className={styles.button} onClick={handleSendEmails}>
        Send Emails
      </button>
      {showModal && (
        <EmployeeModal
          onClose={() => setShowModal(false)}
          onAddEmployee={handleAddEmployee}
        />
      )}
    </div>
  );
}
