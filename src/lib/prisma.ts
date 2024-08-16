import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

function getClient() {
  if (process.env.NODE_ENV !== 'production') {
    process.env.DATABASE_URL =
      'postgresql://postgres:postgres@localhost:5432/postgres'
  }
  console.log('DATABASE_URL', process.env.DATABASE_URL)

  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

export default getClient
