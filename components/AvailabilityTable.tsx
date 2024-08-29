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
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { Availability, Employee } from '@prisma/client'
import EditEmployeeModal from './EditEmployeeModal'
import AvailabilityTableCell from './AvailabilityTableCell'
import { EmployeeWithAvailability } from './EmployeeAvailability'
import EmployeeModal from './EmployeeModal'

type AvailabilityTableProps = {
  startOfRange: Date
  endOfRange: Date
  employees: EmployeeWithAvailability[]
  onDeleteAvailability?: (availability: Availability) => void
  onEditEmployee?: (current: Employee, updated: Employee | undefined) => void
  onAddEmployee?: (employee: Employee) => void
  onDayClick?: (day: Date) => void
}

const AvailabilityTable: React.FC<AvailabilityTableProps> = ({
  startOfRange,
  endOfRange,
  employees,
  onDeleteAvailability,
  onEditEmployee,
  onAddEmployee,
  onDayClick,
}) => {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee>()

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
              <TableCell>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  Employee
                  {onAddEmployee && (
                    <Fab
                      color="primary"
                      size="small"
                      onClick={() => setShowEmployeeModal(true)}
                    >
                      <AddIcon />
                    </Fab>
                  )}
                </Box>
              </TableCell>
              <TableCell>Employee Number</TableCell>
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
                <TableCell>{employee.employeeNumber}</TableCell>
                {daysInRange.map((day) => {
                  const availability = employee.availability
                    .filter((a) => isSameDay(a.day, day))
                    .sort(
                      (a, b) => a.startTime.valueOf() - b.startTime.valueOf()
                    )
                  return (
                    <AvailabilityTableCell
                      key={`${employee.email}-${day.toISOString()}`}
                      day={day}
                      availability={availability}
                      onDeleteAvailability={onDeleteAvailability}
                      onDayClick={onDayClick}
                    />
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
      {onAddEmployee && showEmployeeModal && (
        <EmployeeModal
          onClose={() => setShowEmployeeModal(false)}
          onAddEmployee={onAddEmployee}
          employees={employees}
        />
      )}
    </>
  )
}

export default AvailabilityTable
