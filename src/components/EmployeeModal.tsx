import { useState } from "react";
import { TextField, Button, Box, DialogActions } from "@mui/material";
import Modal from "./Modal";

export type Employee = {
  firstName: string;
  lastName: string;
  email: string;
};

type EmployeeModalProps = {
  onClose: () => void;
  onAddEmployee: (employee: Employee) => void;
};

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  onClose,
  onAddEmployee,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleAdd = () => {
    if (firstName && lastName && email) {
      onAddEmployee({ firstName, lastName, email });
      setFirstName("");
      setLastName("");
      setEmail("");
      onClose();
    }
  };

  return (
    <Modal title="Add Employee" onClose={onClose}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <TextField
          fullWidth
          margin="normal"
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          fullWidth
        >
          Add Employee
        </Button>
      </DialogActions>
    </Modal>
  );
};

export default EmployeeModal;
