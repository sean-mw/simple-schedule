import { testApiHandler } from 'next-test-api-route-handler'
import * as appHandler from './route'
import { it, expect, beforeAll } from '@jest/globals'
import prisma from '@/lib/prisma'
import { Employee, User } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

let user: User
let employee: Employee

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
})

it('GET returns an availability request by id', async () => {
  const createdAvailabilityRequest = await prisma.availabilityRequest.create({
    data: {
      employeeId: employee.id,
    },
  })

  await testApiHandler({
    appHandler,
    params: { id: String(createdAvailabilityRequest.id) },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'GET',
      })

      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toMatchObject(createdAvailabilityRequest)
    },
  })
})

it('PUT updates an availability request and returns 200', async () => {
  const createdAvailabilityRequest = await prisma.availabilityRequest.create({
    data: {
      employeeId: employee.id,
    },
  })

  const createdEmployee = await prisma.employee.create({
    data: {
      email: `${uuidv4()}@example.com`,
      firstName: 'John',
      lastName: 'Doe',
      userId: user.id,
    },
  })

  const updatedData = {
    employeeId: createdEmployee.id,
  }

  await testApiHandler({
    appHandler,
    params: { id: String(createdAvailabilityRequest.id) },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'PUT',
        body: JSON.stringify(updatedData),
      })

      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toMatchObject({
        ...createdAvailabilityRequest,
        ...updatedData,
      })
    },
  })

  const updatedAvailabilityRequest =
    await prisma.availabilityRequest.findUnique({
      where: { id: createdAvailabilityRequest.id },
    })

  expect(updatedAvailabilityRequest).not.toBeNull()
  expect(updatedAvailabilityRequest).toMatchObject({
    ...createdAvailabilityRequest,
    ...updatedData,
  })
})

it('DELETE removes an availability request and returns 200', async () => {
  const createdAvailabilityRequest = await prisma.availabilityRequest.create({
    data: {
      employeeId: employee.id,
    },
  })

  await testApiHandler({
    appHandler,
    params: { id: String(createdAvailabilityRequest.id) },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'DELETE',
      })

      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toMatchObject(createdAvailabilityRequest)
    },
  })

  const deletedAvailabilityRequest =
    await prisma.availabilityRequest.findUnique({
      where: { id: createdAvailabilityRequest.id },
    })

  expect(deletedAvailabilityRequest).toBeNull()
})

it('POST returns 405 (Method Not Allowed)', async () => {
  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'POST',
        body: JSON.stringify({}),
      })

      expect(response.status).toBe(405)
    },
  })
})
