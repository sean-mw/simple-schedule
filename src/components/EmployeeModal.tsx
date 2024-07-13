import { useState } from "react";
import Modal from "./Modal";
import styles from "./EmployeeModal.module.css";

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
      <div className={styles.formGroup}>
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
      </div>
    </Modal>
  );
};

export default EmployeeModal;
