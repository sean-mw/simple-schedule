import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'
import getClient from '../../lib/prisma'
import { getTransporter } from '@/lib/nodemailer'

const prisma = getClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      return createAvailabilityRequests(req, res)
    case 'GET':
      return getAvailabilityRequests(req, res)
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function createAvailabilityRequests(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { emails } = req.body

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: 'Missing/invalid fields.' })
  }

  try {
    for (const email of emails) {
      const token = uuidv4()

      await prisma.availabilityRequest.create({
        data: { email, token },
      })

      const link = `${process.env.NEXT_PUBLIC_URL}/availability?token=${token}`

      const transporter = getTransporter()
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Select Your Availability',
        text: `Please select your availability by clicking the following link:\n\n${link}`,
      })
    }

    return res
      .status(200)
      .json({ message: 'Availability request emails sent successfully' })
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error creating availability requests' })
  }
}

async function getAvailabilityRequests(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query

  if (!token) {
    return res.status(400).json({ error: 'Missing token' })
  }

  try {
    const availabilityRequests = await prisma.availabilityRequest.findMany({
      where: {
        token: token as string,
      },
    })
    return res.status(200).json(availabilityRequests)
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error fetching availability requests' })
  }
}
