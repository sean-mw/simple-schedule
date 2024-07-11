import styles from "./EmployeeModal.module.css";
import { useState } from "react";

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
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>Add Employee</h2>
        <input
          className={styles.input}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <input
          className={styles.input}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />
        <input
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button className={styles.button} onClick={handleAdd}>
          Add Employee
        </button>
        <button className={styles.button} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EmployeeModal;
