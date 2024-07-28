import React, { useState } from 'react'
import { startOfWeek, addWeeks, subWeeks } from 'date-fns'
import { Typography } from '@mui/material'
import { Employee } from './EmployeeModal'
import WeeklyCalendar from './WeeklyCalendar'
import AvailabilityTable from './AvailabilityTable'
import { Availability } from '@prisma/client'

export type EmployeeAvailabilityData = {
  email: string
  availabilities: Availability[]
}

export type EmployeeWithAvailability = Employee & EmployeeAvailabilityData

type EmployeeAvailabilityProps = {
  title: string
  employees: EmployeeWithAvailability[]
  onDeleteAvailability?: (availability: Availability) => void
  onDeleteEmployee?: (employee: Employee) => void
  onDayClick?: (day: Date) => void
}

const EmployeeAvailability: React.FC<EmployeeAvailabilityProps> = ({
  title,
  employees,
  onDeleteAvailability,
  onDeleteEmployee,
  onDayClick,
}) => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date())

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const prevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 })

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        {title}
      </Typography>
      <WeeklyCalendar
        currentWeek={currentWeek}
        onNextWeek={nextWeek}
        onPrevWeek={prevWeek}
      />
      <AvailabilityTable
        startOfCurrentWeek={startOfCurrentWeek}
        employees={employees}
        onDeleteAvailability={onDeleteAvailability}
        onDeleteEmployee={onDeleteEmployee}
        onDayClick={onDayClick}
      />
    </>
  )
}

export default EmployeeAvailability
