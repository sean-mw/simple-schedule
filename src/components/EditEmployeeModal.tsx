import { useMemo, useState } from 'react'
import DeleteEmployeeModal from './DeleteEmployeeModal'
import Modal from './Modal'
import EmployeeForm from './EmployeeForm'
import axios from 'axios'
import { Button } from '@mui/material'
import { Employee } from '@prisma/client'

type EditEmployeeModalProps = {
  employeeToEdit: Employee
  onClose: () => void
  onEditEmployee: (current: Employee, updated: Employee | undefined) => void
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  employeeToEdit,
  onClose,
  onEditEmployee,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const hideModal = useMemo(() => showDeleteModal, [showDeleteModal])

  const onSubmit = async (employee: Omit<Employee, 'id' | 'userId'>) => {
    setStatus('loading')
    const employeeResponse = await axios.put(`/api/employees`, {
      current: employeeToEdit,
      updated: employee,
    })
    setStatus('success')
    setTimeout(() => {
      setStatus('idle')
      onEditEmployee(employeeToEdit, employeeResponse.data)
      onClose()
    }, 500)
  }

  return (
    <>
      <Modal title={'Edit Employee'} onClose={onClose} hidden={hideModal}>
        <EmployeeForm
          status={status}
          employee={employeeToEdit}
          onSubmit={onSubmit}
          submitButtonText="Update Employee"
        />
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={() => setShowDeleteModal(true)}
          disabled={status === 'loading'}
          sx={{ mt: 2 }}
        >
          Delete Employee
        </Button>
      </Modal>
      {showDeleteModal && (
        <DeleteEmployeeModal
          onClose={() => {
            setShowDeleteModal(false)
          }}
          employeeToDelete={employeeToEdit}
          onDeleteEmployee={() => {
            onEditEmployee(employeeToEdit, undefined)
            onClose()
          }}
        />
      )}
    </>
  )
}

export default EditEmployeeModal
