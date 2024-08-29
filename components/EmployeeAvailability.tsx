import React, { useMemo, useState } from 'react'
import { addDays, addWeeks, subWeeks, subDays, startOfWeek } from 'date-fns'
import { Typography, useMediaQuery, useTheme } from '@mui/material'
import IncrementalCalendar from './IncrementalCalendar'
import AvailabilityTable from './AvailabilityTable'
import { Availability, Employee } from '@prisma/client'

export type EmployeeAvailabilityData = {
  email: string
  availability: Availability[]
}

export type EmployeeWithAvailability = Employee & EmployeeAvailabilityData

type EmployeeAvailabilityProps = {
  title?: string
  employees: EmployeeWithAvailability[]
  onDeleteAvailability?: (availability: Availability) => void
  onEditEmployee?: (current: Employee, updated: Employee | undefined) => void
  onAddEmployee?: (employee: Employee) => void
  onDayClick?: (day: Date) => void
}

const EmployeeAvailability: React.FC<EmployeeAvailabilityProps> = ({
  title,
  employees,
  onDeleteAvailability,
  onEditEmployee,
  onAddEmployee,
  onDayClick,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const theme = useTheme()
  const useDaysIncrement = useMediaQuery(theme.breakpoints.down('md'))
  const increment = useDaysIncrement ? 'days' : 'weeks'
  const [startOfCurrentRange, endOfCurrentRange] = useMemo(() => {
    if (increment === 'days') {
      return [currentDate, currentDate]
    }
    return [
      startOfWeek(currentDate, { weekStartsOn: 1 }),
      addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6),
    ]
  }, [currentDate, increment])

  const nextIncrement = () => {
    setCurrentDate(
      increment === 'days' ? addDays(currentDate, 1) : addWeeks(currentDate, 1)
    )
  }

  const prevIncrement = () => {
    setCurrentDate(
      increment === 'days' ? subDays(currentDate, 1) : subWeeks(currentDate, 1)
    )
  }

  return (
    <>
      {title && (
        <Typography variant="h4" align="center" gutterBottom>
          {title}
        </Typography>
      )}
      <IncrementalCalendar
        startOfIncrement={startOfCurrentRange}
        endOfIncrement={endOfCurrentRange}
        onNextIncrement={nextIncrement}
        onPrevIncrement={prevIncrement}
      />
      <AvailabilityTable
        startOfRange={startOfCurrentRange}
        endOfRange={endOfCurrentRange}
        employees={employees}
        onDeleteAvailability={onDeleteAvailability}
        onEditEmployee={onEditEmployee}
        onAddEmployee={onAddEmployee}
        onDayClick={onDayClick}
      />
    </>
  )
}

export default EmployeeAvailability
