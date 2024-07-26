import React, { useState, useEffect } from 'react'
import { startOfWeek, addWeeks, subWeeks } from 'date-fns'
import { Typography, CircularProgress, Alert } from '@mui/material'
import { DayAvailability } from '@/pages/availability'
import { Employee } from './EmployeeModal'
import WeeklyCalendar from './WeeklyCalendar'
import AvailabilityTable from './AvailabilityTable'
import getEmployeeAvailability from '@/lib/get-employee-availability'

export type EmployeeAvailabilityData = {
  email: string
  availabilities: DayAvailability[]
}

export type EmployeeWithAvailability = Employee & EmployeeAvailabilityData

const EmployeeAvailability: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date())
  const [employees, setEmployees] = useState<EmployeeWithAvailability[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const employeesData = await getEmployeeAvailability()
        setEmployees(employeesData)
      } catch (err) {
        setError('Error fetching data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
        Employee Availability
      </Typography>
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: '16px auto' }} />
      ) : error ? (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      ) : (
        <>
          <WeeklyCalendar
            currentWeek={currentWeek}
            onNextWeek={nextWeek}
            onPrevWeek={prevWeek}
          />
          <AvailabilityTable
            startOfCurrentWeek={startOfCurrentWeek}
            employees={employees}
          />
        </>
      )}
    </>
  )
}

export default EmployeeAvailability
