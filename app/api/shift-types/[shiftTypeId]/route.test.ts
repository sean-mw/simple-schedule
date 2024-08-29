import { testApiHandler } from 'next-test-api-route-handler'
import * as appHandler from './route'
import { it, expect, beforeAll } from '@jest/globals'
import prisma from '@/lib/prisma'
import { ShiftColor, User } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

let user: User

beforeAll(async () => {
  user = await prisma.user.create({
    data: {
      email: `${uuidv4()}@example.com`,
      password: 'password',
      name: 'John',
    },
  })
})

it('DELETE removes a shift type and returns 200', async () => {
  const createdShiftType = await prisma.shiftType.create({
    data: {
      name: 'Morning',
      startTime: new Date(),
      endTime: new Date(),
      color: ShiftColor.Blue,
      userId: user.id,
    },
  })

  await testApiHandler({
    appHandler,
    params: { shiftTypeId: String(createdShiftType.id) },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'DELETE',
        headers: {
          'x-user-id': user.id,
        },
      })

      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toMatchObject({
        ...createdShiftType,
        startTime: createdShiftType.startTime.toISOString(),
        endTime: createdShiftType.endTime.toISOString(),
      })
    },
  })

  const deletedShiftType = await prisma.shiftType.findUnique({
    where: { id: createdShiftType.id },
  })

  expect(deletedShiftType).toBeNull()
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

it('GET returns 405 (Method Not Allowed)', async () => {
  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'GET',
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
