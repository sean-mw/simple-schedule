import React, { useState } from 'react'
import { format, addDays, isSameDay } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Typography,
  Fab,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { Employee } from './EmployeeModal'
import axios from 'axios'
import { useTheme } from '@mui/material/styles'
import { Availability } from '@prisma/client'
import Modal from './Modal'
import Form from './Form'

type EmployeeAvailabilityData = {
  email: string
  availabilities: Availability[]
}

type EmployeeWithAvailability = Employee & EmployeeAvailabilityData

type AvailabilityTableProps = {
  startOfRange: Date
  endOfRange: Date
  employees: EmployeeWithAvailability[]
  onDeleteAvailability?: (availability: Availability) => void
  onDeleteEmployee?: (employee: Employee) => void
  onDayClick?: (day: Date) => void
}

const AvailabilityTable: React.FC<AvailabilityTableProps> = ({
  startOfRange,
  endOfRange,
  employees,
  onDeleteAvailability,
  onDeleteEmployee,
  onDayClick,
}) => {
  const theme = useTheme()
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee>()
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  const renderAvailabilityBlock = (availability: Availability) => {
    const startHour = format(availability.startTime, 'h:mm a')
    const endHour = format(availability.endTime, 'h:mm a')
    return (
      <Box
        key={availability.id}
        sx={{
          backgroundColor: theme.palette.success.light,
          borderRadius: '4px',
          padding: '4px 6px',
          fontSize: '12px',
          marginBottom: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>
          {startHour} - {endHour}
        </span>
        {onDeleteAvailability && (
          <IconButton
            size="small"
            color="error"
            onClick={async () => {
              await axios.delete(`/api/availabilities`, { data: availability })
              onDeleteAvailability(availability)
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    )
  }

  const getDaysInRange = (start: Date, end: Date) => {
    const days = []
    let currentDate = start
    while (currentDate <= end) {
      days.push(currentDate)
      currentDate = addDays(currentDate, 1)
    }
    return days
  }

  const daysInRange = getDaysInRange(startOfRange, endOfRange)

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              {daysInRange.map((day, index) => (
                <TableCell key={index}>{format(day, 'EEE, MMM d')}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.email}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography fontWeight="bold">
                      {employee.firstName} {employee.lastName}
                    </Typography>
                    {onDeleteEmployee && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={async () => {
                          setEmployeeToDelete(employee)
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
                {daysInRange.map((day, index) => {
                  const availability = employee.availabilities
                    .filter((a) => isSameDay(a.day, day))
                    .sort(
                      (a, b) => a.startTime.valueOf() - b.startTime.valueOf()
                    )

                  return (
                    <TableCell key={index} sx={{ position: 'relative' }}>
                      <Box display="flex" flexDirection="column" gap={1}>
                        {availability.map((a) => renderAvailabilityBlock(a))}
                      </Box>
                      {onDayClick && (
                        <>
                          <Box sx={{ height: '40px' }}></Box>
                          <Fab
                            color="primary"
                            size="small"
                            onClick={() => onDayClick(day)}
                            sx={{
                              position: 'absolute',
                              bottom: '8px',
                              right: '8px',
                              zIndex: 1,
                            }}
                          >
                            <AddIcon />
                          </Fab>
                        </>
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {onDeleteEmployee && employeeToDelete && (
        <Modal
          title="Confirm Deletion"
          onClose={() => setEmployeeToDelete(undefined)}
        >
          <Form
            onSubmit={async (e) => {
              e.preventDefault()
              setStatus('loading')
              await axios.delete(`/api/employees`, {
                params: { email: employeeToDelete.email },
              })
              setStatus('success')
              setTimeout(() => {
                onDeleteEmployee(employeeToDelete)
                setEmployeeToDelete(undefined)
                setStatus('idle')
              }, 500)
            }}
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
              <Typography color="error">
                This action cannot be undone.
              </Typography>
            </Box>
          </Form>
        </Modal>
      )}
    </>
  )
}

export default AvailabilityTable
