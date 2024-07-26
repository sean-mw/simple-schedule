import { NextApiRequest, NextApiResponse } from 'next'
import getClient from '@/lib/prisma'
import { hash } from 'bcryptjs'

const prisma = getClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'User with this email already exists' })
    }

    const hashedPassword = await hash(password, 10)

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: email,
        },
      })
      return res.status(201).json(user)
    } catch (error) {
      console.log('Internal server error', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
