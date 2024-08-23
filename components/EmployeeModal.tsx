import React, { useState } from 'react'
import Modal from './Modal'
import EmployeeForm from './EmployeeForm'
import { Employee } from '@prisma/client'

type EmployeeModalProps = {
  onClose: () => void
  onAddEmployee: (employee: Employee) => void
  employees: Employee[]
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  onClose,
  onAddEmployee,
  employees,
}) => {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (employee: Omit<Employee, 'id' | 'userId'>) => {
    setErrorMessage('')

    const existingEmployee = employees?.find(
      (e) =>
        e.email === employee.email ||
        (e.employeeNumber && e.employeeNumber === employee.employeeNumber)
    )
    if (existingEmployee) {
      setStatus('error')
      return setErrorMessage('Employee already exists')
    }

    setStatus('loading')
    try {
      const employeeResponse = await fetch(`/api/employees`, {
        method: 'POST',
        body: JSON.stringify(employee),
      })
      const createdEmployee = await employeeResponse.json()
      setStatus('success')

      setTimeout(() => {
        setStatus('idle')
        onAddEmployee(createdEmployee)
        onClose()
      }, 500)
    } catch (error) {
      setStatus('error')
      return setErrorMessage('Failed to add employee')
    }
  }

  return (
    <Modal title="Add Employee" onClose={onClose} errorMessage={errorMessage}>
      <EmployeeForm onSubmit={onSubmit} status={status} />
    </Modal>
  )
}

export default EmployeeModal
