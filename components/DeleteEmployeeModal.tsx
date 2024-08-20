import { FormEvent, useState } from 'react'
import Form from './Form'
import Modal from './Modal'
import axios from 'axios'
import { Box, Typography } from '@mui/material'
import { Employee } from '@prisma/client'

type DeleteEmployeeModalProps = {
  employeeToDelete: Employee
  onClose: () => void
  onDeleteEmployee: (employee: Employee) => void
}

const DeleteEmployeeModal: React.FC<DeleteEmployeeModalProps> = ({
  employeeToDelete,
  onClose,
  onDeleteEmployee,
}) => {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    await axios.delete(`/api/employees`, {
      params: { email: employeeToDelete.email },
    })
    setStatus('success')
    setTimeout(() => {
      setStatus('idle')
      onDeleteEmployee(employeeToDelete)
      onClose()
    }, 500)
  }

  return (
    <Modal title="Confirm Deletion" onClose={onClose}>
      <Form
        onSubmit={onSubmit}
        status={status}
        submitButtonText="Delete Employee"
      >
        <Box mb={2}>
          <Typography>
            Are you sure you want to delete{' '}
            <Typography component="span" fontWeight="bold">
              {employeeToDelete.firstName} {employeeToDelete.lastName}
            </Typography>
            ?
          </Typography>
          <Typography color="error">This action cannot be undone.</Typography>
        </Box>
      </Form>
    </Modal>
  )
}

export default DeleteEmployeeModal
