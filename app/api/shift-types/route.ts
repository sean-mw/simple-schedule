import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const shiftTypes = await prisma.shiftType.findMany({
      where: { userId },
    })

    if (!shiftTypes) {
      return NextResponse.json(
        { error: 'Shift types not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(shiftTypes)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to fetch shift types' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, startTime, endTime, color } = body

    const newShiftType = await prisma.shiftType.create({
      data: {
        name,
        startTime,
        endTime,
        color,
        userId,
      },
    })

    return NextResponse.json(newShiftType, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create shiftType' },
      { status: 500 }
    )
  }
}
