import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const availabilityRequest = await prisma.availabilityRequest.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    })

    if (!availabilityRequest || !availabilityRequest.employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    return NextResponse.json(availabilityRequest.employee)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    )
  }
}
