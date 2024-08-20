import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getTransporter } from '@/lib/nodemailer'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { emails } = await req.json()

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json(
      { error: 'Missing/invalid fields.' },
      { status: 400 }
    )
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

    return NextResponse.json(
      { message: 'Availability request emails sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating availability requests' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  try {
    const availabilityRequests = await prisma.availabilityRequest.findMany({
      where: {
        token: token as string,
      },
    })
    return NextResponse.json(availabilityRequests, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching availability requests' },
      { status: 500 }
    )
  }
}
