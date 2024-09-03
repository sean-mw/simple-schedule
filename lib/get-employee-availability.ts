import {
  AvailabilityWithShiftType,
  EmployeeWithAvailability,
} from '@/types/prisma-combined'
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

    const availabilityWithShiftTypePromises: Promise<AvailabilityWithShiftType>[] =
      availability.map(async (availability) => {
        const shiftTypeResponse = await fetch(
          `/api/user/${employee.userId}/shift-types/${availability.shiftTypeId}`,
          {
            method: 'GET',
          }
        )
        const shiftType = await shiftTypeResponse.json()
        return {
          ...availability,
          shiftType,
        }
      })

    const availabilityWithShiftType = await Promise.all(
      availabilityWithShiftTypePromises
    )

    const employeeWithAvailability: EmployeeWithAvailability = {
      ...employee,
      availability: availabilityWithShiftType,
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
  const availability: Availability[] = await availabilityResponse.json()

  const availabilityWithShiftTypePromises: Promise<AvailabilityWithShiftType>[] =
    availability.map(async (availability) => {
      const shiftTypeResponse = await fetch(
        `/api/user/${employee.userId}/shift-types/${availability.shiftTypeId}`,
        {
          method: 'GET',
        }
      )
      const shiftType = await shiftTypeResponse.json()
      return {
        ...availability,
        shiftType: shiftType,
      }
    })

  const availabilityWithShiftType = await Promise.all(
    availabilityWithShiftTypePromises
  )

  const employeeWithAvailability: EmployeeWithAvailability = {
    ...employee,
    availability: availabilityWithShiftType,
  }

  return employeeWithAvailability
}
