import { useEffect, useState } from 'react'
import { addWeeks, startOfWeek, subWeeks } from 'date-fns'
import { useRouter } from 'next/router'
import WeeklyCalendar from '@/components/WeeklyCalendar'
import AvailabilityTable from '@/components/AvailabilityTable'
import { EmployeeWithAvailability } from '@/components/EmployeeAvailability'
import AvailabilityModal from '@/components/AvailabilityModal'
import { Box, Typography } from '@mui/material'
import Navbar from '@/components/Navbar'
import getEmployeeAvailability from '@/lib/get-employee-availability'

export type DayAvailability = {
  id: number
  day: Date
  startTime: Date
  endTime: Date
}

type QueryParams = {
  token?: string
}

export default function Availability() {
  const router = useRouter()
  const { token } = router.query as QueryParams
  const [employees, setEmployees] = useState<EmployeeWithAvailability[]>([])
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date())
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
  const [clickedDay, setClickedDay] = useState<Date | null>(null)

  useEffect(() => {
    if (!token) return

    const fetchEmployeeAvailability = async () => {
      try {
        const employeesData = await getEmployeeAvailability(token)
        setEmployees(employeesData)
      } catch (error) {
        console.error('Error fetching employee:', error)
      }
    }

    fetchEmployeeAvailability()
  }, [token])

  if (!token) {
    // TODO: Handle this case better
    return (
      <Typography variant="h6" color="error">
        Invalid availability request link.
      </Typography>
    )
  }

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const prevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 })

  return (
    <Box>
      <Navbar hideButtons={true} />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Select Your Availability
        </Typography>
        <WeeklyCalendar
          currentWeek={currentWeek}
          onNextWeek={nextWeek}
          onPrevWeek={prevWeek}
        />
        <AvailabilityTable
          startOfCurrentWeek={startOfCurrentWeek}
          employees={employees}
          onDayClick={async (day: Date) => {
            setClickedDay(day)
            setShowAvailabilityModal(true)
          }}
        />
        {showAvailabilityModal && clickedDay && (
          <AvailabilityModal
            token={token}
            employee={employees[0]}
            date={clickedDay}
            onClose={() => setShowAvailabilityModal(false)}
          />
        )}
      </Box>
    </Box>
  )
}
