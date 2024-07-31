import { useEffect, useState } from 'react'
import axios from 'axios'
import EmployeeModal, { Employee } from '@/components/EmployeeModal'
import RequestAvailabilityModal from '@/components/RequestAvailabilityModal'
import { signIn, useSession } from 'next-auth/react'
import Spinner from '@/components/Spinner'
import { Box, Alert } from '@mui/material'
import Navbar from '@/components/Navbar'
import getEmployeeAvailability from '@/lib/get-employee-availability'
import EmployeeAvailability from '@/components/EmployeeAvailability'
import { Availability } from '@prisma/client'

export type EmployeeAvailabilityData = {
  email: string
  availabilities: Availability[]
}

export type EmployeeWithAvailability = Employee & EmployeeAvailabilityData

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [employees, setEmployees] = useState<EmployeeWithAvailability[]>()
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [showRequestAvailabilityModal, setShowRequestAvailabilityModal] =
    useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const employeesData = await getEmployeeAvailability()
        setEmployees(employeesData)
      } catch (err) {
        setErrorMessage('Error fetching employee availability data.')
      } finally {
        setLoading(false)
      }
    }

    if (session && !employees) {
      fetchData()
    }
  }, [employees, session])

  if (status === 'loading' && !loading) {
    setLoading(true)
  } else if (status === 'unauthenticated') {
    signIn()
    !loading && setLoading(true)
  }

  if (loading) {
    return <Spinner />
  }

  const handleAddEmployee = (employee: Employee) => {
    const email = employee.email
    const existingEmployee = employees?.find((e) => e.email === email)
    if (existingEmployee) {
      setErrorMessage('Employee already exists')
      setTimeout(() => setErrorMessage(''), 3000)
    } else {
      setEmployees([...(employees ?? []), { ...employee, availabilities: [] }])
      axios.post('/api/employees', employee)
    }
  }

  return (
    <Box>
      <Navbar
        onAddEmployee={() => setShowEmployeeModal(true)}
        onRequestAvailability={() => setShowRequestAvailabilityModal(true)}
      />
      <Box sx={{ p: 4 }}>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {errorMessage}
          </Alert>
        )}
        {showEmployeeModal && (
          <EmployeeModal
            onClose={() => setShowEmployeeModal(false)}
            onAddEmployee={handleAddEmployee}
          />
        )}
        {showRequestAvailabilityModal && (
          <RequestAvailabilityModal
            employees={employees ?? []}
            onClose={() => setShowRequestAvailabilityModal(false)}
          />
        )}
        <EmployeeAvailability
          title={'Employee Availability'}
          employees={employees ?? []}
          onDeleteEmployee={(employee: Employee) => {
            setEmployees(employees?.filter((e) => e.email !== employee.email))
          }}
        />
      </Box>
    </Box>
  )
}
