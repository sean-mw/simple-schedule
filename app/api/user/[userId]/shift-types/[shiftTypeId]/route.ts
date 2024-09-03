import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

type Params = {
  userId: string
  shiftTypeId: string
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  const { userId, shiftTypeId } = params

  try {
    const shiftType = await prisma.shiftType.findUnique({
      where: {
        id: shiftTypeId,
        user: {
          id: userId,
        },
      },
    })

    if (!shiftType) {
      return NextResponse.json(
        { error: 'Shift type not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(shiftType)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch shift type' },
      { status: 500 }
    )
  }
}
