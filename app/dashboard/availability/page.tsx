'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Box, Alert } from '@mui/material'
import { getAllEmployeeAvailability } from '@/lib/get-employee-availability'
import EmployeeAvailability from '@/components/EmployeeAvailability'
import { Employee } from '@prisma/client'
import Spinner from '@/components/Spinner'
import { EmployeeWithAvailability } from '@/types/prisma-combined'

export default function Availability() {
  const { data: session } = useSession()
  const [employees, setEmployees] = useState<EmployeeWithAvailability[]>()
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
      <Box sx={{ p: 2 }}>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {errorMessage}
          </Alert>
        )}
        <EmployeeAvailability
          employees={employees ?? []}
          onEditEmployee={onEditEmployee}
          onAddEmployee={onAddEmployee}
        />
      </Box>
    </Box>
  )
}
