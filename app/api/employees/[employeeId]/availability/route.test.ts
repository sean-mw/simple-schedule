import { testApiHandler } from 'next-test-api-route-handler'
import * as appHandler from './route'
import { it, expect, beforeAll } from '@jest/globals'
import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { AvailabilityRequest, Employee, User } from '@prisma/client'

let user: User
let employee: Employee
let availabilityRequest: AvailabilityRequest

beforeAll(async () => {
  user = await prisma.user.create({
    data: {
      email: `${uuidv4()}@example.com`,
      password: 'password',
      name: 'John',
    },
  })
  employee = await prisma.employee.create({
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
})

it('GET returns all availability associated with the employee', async () => {
  const availability = await prisma.availability.create({
    data: {
      day: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      availabilityRequestId: availabilityRequest.id,
    },
  })

  await testApiHandler({
    appHandler,
    params: { employeeId: String(employee.id) },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'GET',
        headers: {
          'x-user-id': user.id,
        },
      })

      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json[0]).toMatchObject({
        ...availability,
        day: availability.day.toISOString(),
        startTime: availability.startTime.toISOString(),
        endTime: availability.endTime.toISOString(),
      })
    },
  })
})

it('POST returns 405 (Method Not Allowed)', async () => {
  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'POST',
        headers: {
          'x-user-id': user.id,
        },
      })

      expect(response.status).toBe(405)
    },
  })
})

it('PUT returns 405 (Method Not Allowed)', async () => {
  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'PUT',
        headers: {
          'x-user-id': user.id,
        },
      })

      expect(response.status).toBe(405)
    },
  })
})

it('DELETE returns 405 (Method Not Allowed)', async () => {
  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'DELETE',
        headers: {
          'x-user-id': user.id,
        },
      })

      expect(response.status).toBe(405)
    },
  })
})
