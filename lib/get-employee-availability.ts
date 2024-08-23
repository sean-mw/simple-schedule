import { EmployeeWithAvailability } from '@/components/EmployeeAvailability'
import { Availability, Employee } from '@prisma/client'

export async function getAllEmployeeAvailability(): Promise<
  EmployeeWithAvailability[]
> {
  const employeesResponse = await fetch(`/api/employees`, {
    method: 'GET',
  })

  const employees: Employee[] = await employeesResponse.json()

  const employeesWithAvailabilityPromises = employees.map(async (employee) => {
    const availabilityResponse = await fetch(
      `/api/employees/${employee.id}/availability`,
      {
        method: 'GET',
      }
    )
    const availability: Availability[] = await availabilityResponse.json()
    const employeeWithAvailability: EmployeeWithAvailability = {
      ...employee,
      availability,
    }
    return employeeWithAvailability
  })

  const employeesWithAvailability: EmployeeWithAvailability[] =
    await Promise.all(employeesWithAvailabilityPromises)

  return employeesWithAvailability
}

export async function getSingleEmployeeAvailability(
  availabilityRequestId: string
): Promise<EmployeeWithAvailability> {
  const employeeResponse = await fetch(
    `/api/availability-requests/${availabilityRequestId}/employee`,
    {
      method: 'GET',
    }
  )
  const employee: Employee = await employeeResponse.json()

  const availabilityResponse = await fetch(
    `/api/availability-requests/${availabilityRequestId}/availability`,
    {
      method: 'GET',
    }
  )
  const availability = await availabilityResponse.json()

  const employeeWithAvailability: EmployeeWithAvailability = {
    ...employee,
    availability,
  }

  return employeeWithAvailability
}
