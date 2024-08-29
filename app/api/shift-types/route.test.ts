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

it('POST creates a new shift type and returns 201', async () => {
  let id

  const shiftTypeData = {
    name: 'Morning',
    startTime: new Date(),
    endTime: new Date(),
    color: ShiftColor.Green,
    userId: user.id,
  }

  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'POST',
        body: JSON.stringify(shiftTypeData),
        headers: {
          'x-user-id': user.id,
        },
      })

      const json = await response.json()
      id = json.id

      expect(response.status).toBe(201)
      expect(json).toMatchObject({
        ...shiftTypeData,
        startTime: shiftTypeData.startTime.toISOString(),
        endTime: shiftTypeData.endTime.toISOString(),
      })
    },
  })

  const createdShiftType = await prisma.shiftType.findUnique({
    where: {
      id,
    },
  })

  expect(createdShiftType).not.toBeNull()
  expect(createdShiftType).toMatchObject(shiftTypeData)
})

it('GET returns all shift types with a 200 status code', async () => {
  const shiftType1 = await prisma.shiftType.create({
    data: {
      name: 'Morning',
      startTime: new Date(),
      endTime: new Date(),
      color: ShiftColor.Green,
      userId: user.id,
    },
  })
  const shiftType2 = await prisma.shiftType.create({
    data: {
      name: 'Morning',
      startTime: new Date(),
      endTime: new Date(),
      color: ShiftColor.Green,
      userId: user.id,
    },
  })

  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'GET',
        headers: {
          'x-user-id': user.id,
        },
      })

      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.length).toBeGreaterThanOrEqual(2)
      expect(json).toContainEqual({
        ...shiftType1,
        startTime: shiftType1.startTime.toISOString(),
        endTime: shiftType1.endTime.toISOString(),
      })
      expect(json).toContainEqual({
        ...shiftType2,
        startTime: shiftType2.startTime.toISOString(),
        endTime: shiftType2.endTime.toISOString(),
      })
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
