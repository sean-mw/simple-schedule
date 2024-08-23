import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

type Params = {
  employeeId: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const userId = request.headers.get('x-user-id')
  const { employeeId } = params

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const availability = await prisma.availability.findMany({
      where: {
        availabilityRequest: {
          employeeId: Number(employeeId),
          employee: {
            userId,
          },
        },
      },
    })

    return NextResponse.json(availability)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
