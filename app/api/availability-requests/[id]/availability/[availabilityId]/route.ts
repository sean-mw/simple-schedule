import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; availabilityId: string } }
) {
  const { id, availabilityId } = params

  try {
    const availabilityRequest = await prisma.availabilityRequest.findUnique({
      where: { id },
    })

    if (!availabilityRequest) {
      return NextResponse.json(
        { error: 'Availability request not found' },
        { status: 404 }
      )
    }

    const availability = await prisma.availability.findUnique({
      where: { id: Number(availabilityId) },
    })

    if (!availability) {
      return NextResponse.json(
        { error: 'Availability not found' },
        { status: 404 }
      )
    }

    const deletedAvailability = await prisma.availability.delete({
      where: { id: Number(availabilityId) },
    })

    return NextResponse.json(deletedAvailability)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to delete availability' },
      { status: 500 }
    )
  }
}
