import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

function getClient() {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

export default getClient
