import { testApiHandler } from 'next-test-api-route-handler'
import * as appHandler from './route'
import { it, expect, beforeAll } from '@jest/globals'
import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { AvailabilityRequest, ShiftColor, ShiftType } from '@prisma/client'

let availabilityRequest: AvailabilityRequest
let shiftType: ShiftType

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      email: `${uuidv4()}@example.com`,
      password: 'password',
      name: 'John',
    },
  })
  const employee = await prisma.employee.create({
    data: {
      email: `${uuidv4()}@example.com`,
      firstName: 'John',
      lastName: 'Doe',
      userId: user.id,
    },
  })
  availabilityRequest = await prisma.availabilityRequest.create({
    data: {
      employeeId: employee.id,
    },
  })
  shiftType = await prisma.shiftType.create({
    data: {
      name: 'Morning',
      startTime: new Date(),
      endTime: new Date(),
      userId: user.id,
      color: ShiftColor.Blue,
    },
  })
})

it('GET returns the availability associated with the availability request', async () => {
  const availability = await prisma.availability.create({
    data: {
      day: new Date(),
      availabilityRequestId: availabilityRequest.id,
      shiftTypeId: shiftType.id,
    },
  })
  await testApiHandler({
    appHandler,
    params: { id: String(availabilityRequest.id) },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'GET',
      })

      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json[0]).toMatchObject({
        ...availability,
        day: availability.day.toISOString(),
      })
    },
  })
})

it('POST creates new availability and returns 201', async () => {
  let id

  const availabilityData = {
    day: new Date(),
    availabilityRequestId: availabilityRequest.id,
    shiftTypeId: shiftType.id,
  }

  await testApiHandler({
    appHandler,
    params: { id: String(availabilityRequest.id) },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'POST',
        body: JSON.stringify(availabilityData),
      })

      const json = await response.json()
      id = Number(json.id)

      expect(response.status).toBe(201)
      expect(json).toMatchObject({
        ...availabilityData,
        day: availabilityData.day.toISOString(),
      })
    },
  })

  const createdAvailability = await prisma.availability.findUnique({
    where: {
      id,
    },
  })

  expect(createdAvailability).not.toBeNull()
  expect(createdAvailability).toMatchObject(availabilityData)
})
