import React, { useState } from 'react'
import Modal from './Modal'
import axios from 'axios'
import EmployeeForm from './EmployeeForm'

export type Employee = {
  firstName: string
  lastName: string
  email: string
}

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

  const onSubmit = async (employee: Employee) => {
    setErrorMessage('')

    const existingEmployee = employees?.find((e) => e.email === employee.email)
    if (existingEmployee) {
      setStatus('error')
      return setErrorMessage('Employee already exists')
    }

    setStatus('loading')
    try {
      await axios.post('/api/employees', employee)
      setStatus('success')

      setTimeout(() => {
        setStatus('idle')
        onAddEmployee(employee)
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
