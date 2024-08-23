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

it('POST creates a new employee and returns 201', async () => {
  let id

  const employeeData = {
    email: `${uuidv4()}@example.com`,
    firstName: 'Jane',
    lastName: 'Doe',
    userId: user.id,
  }

  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'POST',
        body: JSON.stringify(employeeData),
        headers: {
          'x-user-id': employee.userId,
        },
      })

      const json = await response.json()
      id = json.id

      expect(response.status).toBe(201)
      expect(json).toMatchObject(employeeData)
    },
  })

  const createdEmployee = await prisma.employee.findUnique({
    where: {
      id,
    },
  })

  expect(createdEmployee).not.toBeNull()
  expect(createdEmployee).toMatchObject(employeeData)
})

it('GET returns all employees with a 200 status code', async () => {
  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'GET',
        headers: {
          'x-user-id': employee.userId,
        },
      })

      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.length).toBeGreaterThan(0)
      expect(json).toContainEqual(employee)
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
          'x-user-id': employee.userId,
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
          'x-user-id': employee.userId,
        },
      })

      expect(response.status).toBe(405)
    },
  })
})
