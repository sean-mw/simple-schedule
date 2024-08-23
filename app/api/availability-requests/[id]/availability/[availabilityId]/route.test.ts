import { testApiHandler } from 'next-test-api-route-handler'
import * as appHandler from './route'
import { it, expect, beforeAll } from '@jest/globals'
import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

beforeAll(async () => {})

it('DELETE removes an availability and returns 200', async () => {
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
  const availabilityRequest = await prisma.availabilityRequest.create({
    data: {
      employeeId: employee.id,
    },
  })
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
    params: {
      id: String(availabilityRequest.id),
      availabilityId: String(availability.id),
    },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'DELETE',
      })

      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toMatchObject({
        ...availability,
        day: availability.day.toISOString(),
        startTime: availability.startTime.toISOString(),
        endTime: availability.endTime.toISOString(),
      })
    },
  })

  const deletedAvailability = await prisma.availability.findUnique({
    where: { id: availability.id },
  })

  expect(deletedAvailability).toBeNull()
})

it('GET returns 405 (Method Not Allowed)', async () => {
  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'GET',
      })

      expect(response.status).toBe(405)
    },
  })
})

it('POST returns 405 (Method Not Allowed)', async () => {
  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'POST',
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
      })

      expect(response.status).toBe(405)
    },
  })
})
