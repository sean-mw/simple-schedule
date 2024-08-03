import { Box, TextField } from '@mui/material'
import Form from './Form'
import { useState } from 'react'
import { Employee } from './EmployeeModal'

type EmployeeFormProps = {
  onSubmit: (employee: Employee) => void
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

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({
          firstName,
          lastName,
          email,
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
      </Box>
    </Form>
  )
}

export default EmployeeForm
