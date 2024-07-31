import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material'
import Modal from './Modal'
import { Employee } from './EmployeeModal'
import { useState } from 'react'
import axios from 'axios'

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

  const handleSendEmails = async () => {
    const emails = selectedEmployees.map((e) => e.email)
    await axios.post('/api/availability-requests', { emails })
    onClose()
  }

  return (
    <Modal title="Send Availability Requests" onClose={onClose}>
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendEmails}
        fullWidth
      >
        Send Requests
      </Button>
    </Modal>
  )
}
