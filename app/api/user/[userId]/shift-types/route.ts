import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

type Params = {
  userId: string
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  const { userId } = params

  try {
    const shiftTypes = await prisma.shiftType.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    })

    return NextResponse.json(shiftTypes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch shift types' },
      { status: 500 }
    )
  }
}
