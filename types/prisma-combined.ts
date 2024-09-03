import { Availability, Employee, ShiftType } from '@prisma/client'

export type AvailabilityWithShiftType = Availability & {
  shiftType: ShiftType
}

export type EmployeeWithAvailability = Employee & {
  availability: AvailabilityWithShiftType[]
}
