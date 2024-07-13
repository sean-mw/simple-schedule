import styles from "./dashboard.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeModal, { Employee } from "@/components/EmployeeModal";
import RequestAvailabilityModal from "@/components/RequestAvailabilityModal";
import { signIn, signOut, useSession } from "next-auth/react";
import Spinner from "@/components/Spinner";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showRequestAvailabilityModal, setShowRequestAvailabilityModal] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (session) {
      axios.get("/api/employee").then((response) => {
        setEmployees(response.data);
      });
    }
  }, [session]);

  if (status === "loading") {
    return <Spinner />;
  } else if (status === "unauthenticated") {
    signIn();
  }

  const handleAddEmployee = (employee: Employee) => {
    const email = employee.email;
    const existingEmployee = employees.find((e) => e.email === email);
    if (existingEmployee) {
      setErrorMessage("Employee already exists");
      setTimeout(() => setErrorMessage(""), 3000);
    } else {
      setEmployees([...employees, employee]);
      axios.post("/api/employee", employee);
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
      <div className={styles.buttonBar}>
        <button
          className={styles.button}
          onClick={() => setShowEmployeeModal(true)}
        >
          Add Employee
        </button>
        <button
          className={styles.button}
          onClick={() => setShowRequestAvailabilityModal(true)}
        >
          Request Availability
        </button>
        <button className={styles.button} onClick={() => signOut()}>
          Sign out
        </button>
      </div>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      {showEmployeeModal && (
        <EmployeeModal
          onClose={() => setShowEmployeeModal(false)}
          onAddEmployee={handleAddEmployee}
        />
      )}
      {showRequestAvailabilityModal && (
        <RequestAvailabilityModal
          employees={employees}
          selectedEmployees={selectedEmployees}
          selectAll={selectAll}
          onClose={() => setShowRequestAvailabilityModal(false)}
          onSendEmails={handleSendEmails}
          onSelectAll={handleSelectAll}
          onEmployeeSelection={handleEmployeeSelection}
        />
      )}
    </div>
  );
}
