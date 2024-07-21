import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeModal, { Employee } from "@/components/EmployeeModal";
import RequestAvailabilityModal from "@/components/RequestAvailabilityModal";
import EmployeeAvailability from "@/components/EmployeeAvailability";
import { signIn, useSession } from "next-auth/react";
import Spinner from "@/components/Spinner";
import { Box, Alert } from "@mui/material";
import Navbar from "@/components/Navbar";

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
      axios.get("/api/employees").then((response) => {
        setEmployees(response.data);
      });
    }
  }, [session]);

  if (status === "loading") {
    return <Spinner />;
  } else if (status === "unauthenticated") {
    signIn();
    return <Spinner />;
  }

  const handleAddEmployee = (employee: Employee) => {
    const email = employee.email;
    const existingEmployee = employees.find((e) => e.email === email);
    if (existingEmployee) {
      setErrorMessage("Employee already exists");
      setTimeout(() => setErrorMessage(""), 3000);
    } else {
      setEmployees([...employees, employee]);
      axios.post("/api/employees", employee);
    }
  };

  const handleSendEmails = async () => {
    const emails = selectedEmployees.map((e) => e.email);
    await axios.post("/api/availability-requests", { emails });
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
    <Box>
      <Navbar
        onAddEmployee={() => setShowEmployeeModal(true)}
        onRequestAvailability={() => setShowRequestAvailabilityModal(true)}
      />
      <Box sx={{ p: 4 }}>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {errorMessage}
          </Alert>
        )}
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
        <EmployeeAvailability />
      </Box>
    </Box>
  );
}
