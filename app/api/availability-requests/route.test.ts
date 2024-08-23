import { testApiHandler } from 'next-test-api-route-handler'
import * as appHandler from './route'
import { it, expect, beforeAll } from '@jest/globals'
import prisma from '@/lib/prisma'
import { Employee } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

let employee: Employee

beforeAll(async () => {
  const user = await prisma.user.create({
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
})

it('POST creates a new availability request and returns 201', async () => {
  let id

  const availabilityRequestData = {
    employeeId: employee.id,
  }

  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'POST',
        body: JSON.stringify(availabilityRequestData),
        headers: {
          'x-user-id': employee.userId,
        },
      })

      const json = await response.json()
      id = json.id

      expect(response.status).toBe(201)
      expect(json).toMatchObject(availabilityRequestData)
    },
  })

  const createdAvailabilityRequest =
    await prisma.availabilityRequest.findUnique({
      where: {
        id,
      },
    })

  expect(createdAvailabilityRequest).not.toBeNull()
  expect(createdAvailabilityRequest).toMatchObject(availabilityRequestData)
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

it('DELETE returns 405 (Method Not Allowed)', async () => {
  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'DELETE',
      })

      expect(response.status).toBe(405)
    },
  })
})
