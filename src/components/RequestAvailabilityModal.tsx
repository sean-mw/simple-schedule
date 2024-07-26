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

interface RequestAvailabilityModalProps {
  employees: Employee[]
  selectedEmployees: Employee[]
  selectAll: boolean
  onClose: () => void
  onSendEmails: () => void
  onSelectAll: () => void
  onEmployeeSelection: (employee: Employee) => void
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
        <Box mb={2}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={selectAll} onChange={onSelectAll} />}
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
                    onChange={() => onEmployeeSelection(employee)}
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
        onClick={onSendEmails}
        fullWidth
      >
        Send Requests
      </Button>
    </Modal>
  )
}
