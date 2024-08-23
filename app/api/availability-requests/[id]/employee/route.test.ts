import { testApiHandler } from 'next-test-api-route-handler'
import * as appHandler from './route'
import { it, expect } from '@jest/globals'
import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

it('GET returns the employee associated with the availability request', async () => {
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
  await testApiHandler({
    appHandler,
    params: { id: String(availabilityRequest.id) },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'GET',
      })

      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toMatchObject(employee)
    },
  })
})
