import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material'
import Modal from './Modal'
import { Employee } from './EmployeeModal'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Form from './Form'

interface RequestAvailabilityModalProps {
  employees: Employee[]
  onClose: () => void
}

export default function RequestAvailabilityModal({
  employees,
  onClose,
}: RequestAvailabilityModalProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  useEffect(() => {
    if (employees.length === 0) {
      setStatus('error')
      setErrorMessage(
        'Please add employees before sending availability requests.'
      )
    }
  }, [employees])

  const handleEmployeeSelection = (employee: Employee) => {
    if (selectedEmployees.includes(employee)) {
      setSelectedEmployees(selectedEmployees.filter((e) => e !== employee))
      if (selectAll) {
        setSelectAll(false)
      }
    } else {
      const selected = [...selectedEmployees, employee]
      setSelectedEmployees(selected)
      if (selected.length === employees.length) {
        setSelectAll(true)
      }
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setErrorMessage('')
    const emails = selectedEmployees.map((e) => e.email)
    if (emails.length === 0) {
      setStatus('error')
      return setErrorMessage('Please select at least one employee.')
    }
    try {
      setStatus('loading')
      await axios.post('/api/availability-requests', { emails })
      setStatus('success')
      setTimeout(() => {
        setStatus('idle')
        setSelectedEmployees([])
        setSelectAll(false)
        onClose()
      }, 500)
    } catch {
      setStatus('error')
      return setErrorMessage(
        'Failed to send availability requests. Please try again.'
      )
    }
  }

  return (
    <Modal
      title="Send Availability Requests"
      onClose={onClose}
      errorMessage={errorMessage}
    >
      <Form
        onSubmit={onSubmit}
        status={status}
        disabled={employees.length === 0}
      >
        {employees.length > 0 && (
          <Box mb={2}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAll}
                    onChange={(e) => {
                      setSelectAll(e.target.checked)
                      e.target.checked
                        ? setSelectedEmployees(employees)
                        : setSelectedEmployees([])
                    }}
                  />
                }
                label="Select All"
              />
            </FormGroup>
            <List>
              {employees.map((employee) => (
                <ListItem key={employee.email} divider>
                  <ListItemText
                    primary={`${employee.firstName} ${employee.lastName}`}
                    secondary={employee.email}
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      checked={selectedEmployees.includes(employee)}
                      onChange={() => handleEmployeeSelection(employee)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Form>
    </Modal>
  )
}
