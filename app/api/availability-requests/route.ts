import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getTransporter } from '@/lib/nodemailer'

export async function POST(request: Request) {
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { employeeId } = body

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId, userId },
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    const newAvailabilityRequest = await prisma.availabilityRequest.create({
      data: {
        employeeId,
      },
    })

    const link = `${process.env.NEXT_PUBLIC_URL}/availability?token=${newAvailabilityRequest.id}`

    const transporter = getTransporter()
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: employee.email,
      subject: 'Select Your Availability',
      text: `Please select your availability by clicking the following link:\n\n${link}`,
    })

    return NextResponse.json(newAvailabilityRequest, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create availability request' },
      { status: 500 }
    )
  }
}
