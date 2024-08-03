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
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { Employee } from './EmployeeModal'
import axios from 'axios'
import { useTheme } from '@mui/material/styles'
import { Availability } from '@prisma/client'
import EditEmployeeModal from './EditEmployeeModal'

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
  onEditEmployee?: (current: Employee, updated: Employee | undefined) => void
  onDayClick?: (day: Date) => void
}

const AvailabilityTable: React.FC<AvailabilityTableProps> = ({
  startOfRange,
  endOfRange,
  employees,
  onDeleteAvailability,
  onEditEmployee,
  onDayClick,
}) => {
  const theme = useTheme()
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee>()

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
              await axios.delete(`/api/availabilities`, {
                data: availability,
              })
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
                    {onEditEmployee && (
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={async () => {
                          setEmployeeToEdit(employee)
                        }}
                      >
                        <EditIcon fontSize="small" />
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
      {onEditEmployee && employeeToEdit && (
        <EditEmployeeModal
          onClose={() => setEmployeeToEdit(undefined)}
          employeeToEdit={employeeToEdit}
          onEditEmployee={onEditEmployee}
        />
      )}
    </>
  )
}

export default AvailabilityTable
