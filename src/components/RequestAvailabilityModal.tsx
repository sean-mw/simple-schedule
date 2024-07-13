import Modal from "./Modal";
import styles from "./RequestAvailabilityModal.module.css";
import { Employee } from "./EmployeeModal";

interface RequestAvailabilityModalProps {
  employees: Employee[];
  selectedEmployees: Employee[];
  selectAll: boolean;
  onClose: () => void;
  onSendEmails: () => void;
  onSelectAll: () => void;
  onEmployeeSelection: (employee: Employee) => void;
}

export default function RequestAvailabilityModal({
  employees,
  selectedEmployees,
  selectAll,
  onClose,
  onSendEmails,
  onSelectAll,
  onEmployeeSelection,
}: RequestAvailabilityModalProps) {
  return (
    <Modal title="Send Availability Requests" onClose={onClose}>
      {employees.length > 0 && (
        <>
          <div className={styles.formGroup}>
            <div className={styles.selectAllContainer}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={onSelectAll}
              />
              <label>Select All</label>
            </div>
            <div className={styles.employeeList}>
              {employees.map((employee) => (
                <div key={employee.email} className={styles.employeeItem}>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee)}
                    onChange={() => onEmployeeSelection(employee)}
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
      <button className={styles.button} onClick={onSendEmails}>
        Send Requests
      </button>
    </Modal>
  );
}
