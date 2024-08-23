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

it('GET returns an employee by id', async () => {
  await testApiHandler({
    appHandler,
    params: { employeeId: String(employee.id) },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'GET',
        headers: {
          'x-user-id': employee.userId,
        },
      })

      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toMatchObject(employee)
    },
  })
})

it('PUT updates an employee and returns 200', async () => {
  const createdEmployee = await prisma.employee.create({
    data: {
      email: `${uuidv4()}@example.com`,
      firstName: 'Jane',
      lastName: 'Doe',
      userId: employee.userId,
    },
  })

  const updatedData = {
    email: `${uuidv4()}@example.com`,
    firstName: 'Jane',
    lastName: 'Smith',
  }

  await testApiHandler({
    appHandler,
    params: { employeeId: String(createdEmployee.id) },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'PUT',
        body: JSON.stringify(updatedData),
        headers: {
          'x-user-id': employee.userId,
        },
      })

      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toMatchObject({
        ...createdEmployee,
        ...updatedData,
      })
    },
  })

  const updatedEmployee = await prisma.employee.findUnique({
    where: { id: createdEmployee.id },
  })

  expect(updatedEmployee).not.toBeNull()
  expect(updatedEmployee).toMatchObject({
    ...createdEmployee,
    ...updatedData,
  })
})

it('DELETE removes an employee and returns 200', async () => {
  const createdEmployee = await prisma.employee.create({
    data: {
      email: `${uuidv4()}@example.com`,
      firstName: 'Jane',
      lastName: 'Doe',
      userId: employee.userId,
    },
  })

  await testApiHandler({
    appHandler,
    params: { employeeId: String(createdEmployee.id) },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'DELETE',
        headers: {
          'x-user-id': employee.userId,
        },
      })

      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toMatchObject(createdEmployee)
    },
  })

  const deletedEmployee = await prisma.employee.findUnique({
    where: { id: createdEmployee.id },
  })

  expect(deletedEmployee).toBeNull()
})

it('POST returns 405 (Method Not Allowed)', async () => {
  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'x-user-id': employee.userId,
        },
      })

      expect(response.status).toBe(405)
    },
  })
})
