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
        availability: true,
      },
    })

    if (!availabilityRequest || !availabilityRequest.availability) {
      return NextResponse.json(
        { error: 'Availability not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(availabilityRequest.availability)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const body = await request.json()
    const { day, shiftTypeId } = body

    const availabilityRequest = await prisma.availabilityRequest.findUnique({
      where: { id },
    })

    if (!availabilityRequest) {
      return NextResponse.json(
        { error: 'Availability request not found' },
        { status: 404 }
      )
    }

    const availability = await prisma.availability.create({
      data: {
        availabilityRequestId: id,
        day,
        shiftTypeId,
      },
    })

    return NextResponse.json(availability, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create availability' },
      { status: 500 }
    )
  }
}
