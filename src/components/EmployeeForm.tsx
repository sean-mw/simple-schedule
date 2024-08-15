import { Box, TextField } from '@mui/material'
import Form from './Form'
import { useState } from 'react'
import { Employee } from '@prisma/client'

type EmployeeFormProps = {
  onSubmit: (employee: Omit<Employee, 'id' | 'userId'>) => void
  status: 'idle' | 'loading' | 'success' | 'error'
  employee?: Employee
  submitButtonText?: string
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  onSubmit,
  status,
  employee,
  submitButtonText,
}) => {
  const [firstName, setFirstName] = useState(employee?.firstName || '')
  const [lastName, setLastName] = useState(employee?.lastName || '')
  const [email, setEmail] = useState(employee?.email || '')
  const [employeeNumber, setEmployeeNumber] = useState(
    employee?.employeeNumber ?? null
  )

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({
          firstName,
          lastName,
          email,
          employeeNumber,
        })
      }}
      status={status}
      submitButtonText={submitButtonText}
    >
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
        <TextField
          fullWidth
          margin="dense"
          label="Employee Number (optional)"
          type="number"
          value={employeeNumber}
          onChange={(e) => setEmployeeNumber(Number.parseInt(e.target.value))}
        />
      </Box>
    </Form>
  )
}

export default EmployeeForm
