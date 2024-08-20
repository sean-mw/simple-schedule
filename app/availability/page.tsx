'use client'

import { useEffect, useState } from 'react'
import EmployeeAvailability, {
  EmployeeWithAvailability,
} from '@/components/EmployeeAvailability'
import AvailabilityModal from '@/components/AvailabilityModal'
import { Box, Typography } from '@mui/material'
import Navbar from '@/components/Navbar'
import getEmployeeAvailability from '@/lib/get-employee-availability'
import { type Availability } from '@prisma/client'
import { useSearchParams } from 'next/navigation'

export default function Availability() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [employee, setEmployee] = useState<EmployeeWithAvailability>()
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
  const [clickedDay, setClickedDay] = useState<Date | null>(null)

  useEffect(() => {
    if (!token) return

    const fetchEmployeeAvailability = async () => {
      try {
        const employees = await getEmployeeAvailability(token)
        setEmployee(employees[0])
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

  return (
    <Box>
      <Navbar hideButtons={true} />
      <Box sx={{ p: 4 }}>
        <EmployeeAvailability
          title={'Select Your Availability'}
          employees={employee ? [employee] : []}
          onDayClick={async (day: Date) => {
            setClickedDay(day)
            setShowAvailabilityModal(true)
          }}
          onDeleteAvailability={(availability) => {
            if (!employee) return
            setEmployee({
              ...employee,
              availabilities: employee.availabilities.filter(
                (a) => a.id !== availability.id
              ),
            })
          }}
        />
        {showAvailabilityModal && clickedDay && employee && (
          <AvailabilityModal
            token={token}
            employee={employee}
            date={clickedDay}
            onClose={() => setShowAvailabilityModal(false)}
            onSuccess={(availability: Availability) => {
              setEmployee({
                ...employee,
                availabilities: [...employee.availabilities, availability],
              })
            }}
          />
        )}
      </Box>
    </Box>
  )
}
