'use client'

import { useEffect, useState } from 'react'
import EmployeeModal from '@/components/EmployeeModal'
import RequestAvailabilityModal from '@/components/RequestAvailabilityModal'
import { signIn, useSession } from 'next-auth/react'
import Spinner from '@/components/Spinner'
import { Box, Alert } from '@mui/material'
import Navbar from '@/components/Navbar'
import { getAllEmployeeAvailability } from '@/lib/get-employee-availability'
import EmployeeAvailability, {
  EmployeeWithAvailability,
} from '@/components/EmployeeAvailability'
import { Employee } from '@prisma/client'

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
        const employeesData = await getAllEmployeeAvailability()
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

  const onAddEmployee = (employee: Employee) => {
    setEmployees([...(employees ?? []), { ...employee, availability: [] }])
  }

  const onEditEmployee = (current: Employee, updated: Employee | undefined) => {
    if (!updated) {
      // Delete employee
      setEmployees(employees?.filter((e) => e.email !== current.email))
    } else {
      // Update employee
      setEmployees(
        employees?.map((e) =>
          e.email === current.email
            ? { ...updated, availability: e.availability }
            : e
        )
      )
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
            employees={employees ?? []}
            onClose={() => setShowEmployeeModal(false)}
            onAddEmployee={onAddEmployee}
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
          onEditEmployee={onEditEmployee}
        />
      </Box>
    </Box>
  )
}
