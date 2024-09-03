import { testApiHandler } from 'next-test-api-route-handler'
import * as appHandler from './route'
import { it, expect, beforeAll } from '@jest/globals'
import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { ShiftColor, User } from '@prisma/client'

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

it('GET returns correct shift type', async () => {
  const shiftType = await prisma.shiftType.create({
    data: {
      name: 'Morning',
      startTime: new Date(),
      endTime: new Date(),
      userId: user.id,
      color: ShiftColor.Blue,
    },
  })

  await testApiHandler({
    appHandler,
    params: { userId: String(user.id), shiftTypeId: String(shiftType.id) },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'GET',
      })

      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toEqual({
        ...shiftType,
        startTime: shiftType.startTime.toISOString(),
        endTime: shiftType.endTime.toISOString(),
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
