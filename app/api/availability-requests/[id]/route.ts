import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const availabilityRequest = await prisma.availabilityRequest.findUnique({
      where: { id: params.id },
    })

    if (!availabilityRequest) {
      return NextResponse.json(
        { error: 'Availability request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(availabilityRequest)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch availability request' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { employeeId } = body

    const updatedAvailabilityRequest = await prisma.availabilityRequest.update({
      where: { id: params.id },
      data: {
        employeeId,
      },
    })

    return NextResponse.json(updatedAvailabilityRequest)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update availability request' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedAvailabilityRequest = await prisma.availabilityRequest.delete({
      where: { id: params.id },
    })

    return NextResponse.json(deletedAvailabilityRequest)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete availability request' },
      { status: 500 }
    )
  }
}
