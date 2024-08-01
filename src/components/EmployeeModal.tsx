import React, { useState } from 'react'
import { TextField, Box } from '@mui/material'
import Modal from './Modal'
import Form from './Form'
import axios from 'axios'

export type Employee = {
  firstName: string
  lastName: string
  email: string
}

type EmployeeModalProps = {
  onClose: () => void
  onAddEmployee: (employee: Employee) => void
  employees: Employee[]
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  onClose,
  onAddEmployee,
  employees,
}) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!firstName || !lastName || !email) {
      setStatus('error')
      return setErrorMessage('Please fill out all fields.')
    }

    const existingEmployee = employees?.find((e) => e.email === email)
    if (existingEmployee) {
      setStatus('error')
      return setErrorMessage('Employee already exists')
    }

    setStatus('loading')
    try {
      const employee: Employee = { firstName, lastName, email }
      await axios.post('/api/employees', employee)
      setStatus('success')

      setTimeout(() => {
        setStatus('idle')
        setFirstName('')
        setLastName('')
        setEmail('')

        onAddEmployee(employee)
        onClose()
      }, 500)
    } catch (error) {
      setStatus('error')
      return setErrorMessage('Failed to add employee')
    }
  }

  return (
    <Modal title="Add Employee" onClose={onClose} errorMessage={errorMessage}>
      <Form onSubmit={onSubmit} status={status}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <TextField
            required
            fullWidth
            margin="dense"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            required
            fullWidth
            margin="dense"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            required
            fullWidth
            margin="dense"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
      </Form>
    </Modal>
  )
}

export default EmployeeModal
