import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/nextauth'

export async function POST(req: NextRequest) {
  const { token, day, startTime, endTime } = await req.json()

  if (!token || !day || !startTime || !endTime) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  try {
    const availability = await prisma.availability.create({
      data: {
        day: new Date(day),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        token,
      },
    })
    return NextResponse.json(
      { message: 'Availability created', availability },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating availability' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  try {
    if (email) {
      // get availabilities for a specific employee
      const availabilityRequests = await prisma.availabilityRequest.findMany({
        where: { email: email as string },
        select: { token: true },
      })

      const tokens = availabilityRequests.map((ar) => ar.token)

      const availabilities = await prisma.availability.findMany({
        where: { token: { in: tokens } },
      })

      return NextResponse.json([{ email, availabilities }], { status: 200 })
    } else {
      // get availabilities for all employees
      const session = await getServerSession(authOptions)
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const employees = await prisma.employee.findMany({
        where: { userId: session.user.id },
        select: { email: true },
      })

      const employeeEmails = employees.map((e) => e.email)

      const availabilityRequests = await prisma.availabilityRequest.findMany({
        where: { email: { in: employeeEmails } },
        select: { token: true, email: true },
      })

      const tokens = availabilityRequests.map((ar) => ar.token)

      const availabilities = await prisma.availability.findMany({
        where: { token: { in: tokens } },
      })

      const response = availabilityRequests.map((ar) => ({
        email: ar.email,
        availabilities: availabilities.filter((a) => a.token === ar.token),
      }))

      return NextResponse.json(response, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching availabilities' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const { id, token } = await req.json()

  if (!id || !token) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  try {
    await prisma.availability.delete({
      where: {
        id: parseInt(id as string),
        token: token as string,
      },
    })
    return NextResponse.json(
      { message: 'Availability deleted' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting availability' },
      { status: 500 }
    )
  }
}
