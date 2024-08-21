import { testApiHandler } from 'next-test-api-route-handler'
import * as appHandler from './route'
import { it, expect, beforeEach } from '@jest/globals'
import prisma from '@/lib/prisma'
import { compare, hash } from 'bcryptjs'

async function resetDatabase() {
  await prisma.user.deleteMany()
}

beforeEach(async () => {
  await resetDatabase()
})

it('POST creates a new user and returns 201', async () => {
  const email = 'test@example.com'
  const password = 'password123'

  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      const json = await response.json()

      expect(response.status).toBe(201)
      expect(json.email).toBe(email)
    },
  })

  const createdUser = await prisma.user.findUnique({ where: { email } })
  expect(createdUser).not.toBeNull()
  expect(createdUser?.email).toBe(email)

  const isPasswordValid = await compare(password, createdUser?.password || '')
  expect(isPasswordValid).toBe(true)
})

it('POST returns 400 if user already exists', async () => {
  const email = 'test@example.com'
  const password = await hash('password123', 10)

  await prisma.user.create({
    data: {
      email,
      password,
      name: email,
    },
  })

  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'POST',
        body: JSON.stringify({ email, password: 'password123' }),
      })

      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json).toStrictEqual({
        error: 'User with this email already exists',
      })
    },
  })
})
