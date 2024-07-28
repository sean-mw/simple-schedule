import React from 'react'
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

type EmployeeAvailabilityData = {
  email: string
  availabilities: Availability[]
}

type EmployeeWithAvailability = Employee & EmployeeAvailabilityData

type AvailabilityTableProps = {
  startOfCurrentWeek: Date
  employees: EmployeeWithAvailability[]
  onDeleteAvailability?: (availability: Availability) => void
  onDeleteEmployee?: (employee: Employee) => void
  onDayClick?: (day: Date) => void
}

const DAYS_IN_WEEK = 7

const AvailabilityTable: React.FC<AvailabilityTableProps> = ({
  startOfCurrentWeek,
  employees,
  onDeleteAvailability,
  onDeleteEmployee,
  onDayClick,
}) => {
  const theme = useTheme()

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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            {Array.from({ length: DAYS_IN_WEEK }).map((_, index) => (
              <TableCell key={index}>
                {format(addDays(startOfCurrentWeek, index), 'EEE, MMM d')}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.email}>
              <TableCell>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography fontWeight="bold">
                    {employee.firstName} {employee.lastName}
                  </Typography>
                  {onDeleteEmployee && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={async () => {
                        await axios.delete(`/api/employees`, {
                          params: { email: employee.email },
                        })
                        onDeleteEmployee(employee)
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </TableCell>
              {Array.from({ length: 7 }).map((_, index) => {
                const date = addDays(startOfCurrentWeek, index)
                const availability = employee.availabilities
                  .filter((a) => isSameDay(a.day, date))
                  .sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf())

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
                          onClick={() => onDayClick(date)}
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
  )
}

export default AvailabilityTable
