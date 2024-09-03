import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

type Params = {
  shiftTypeId: string
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const userId = request.headers.get('x-user-id')
  const { shiftTypeId } = params

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const deletedShiftType = await prisma.shiftType.delete({
      where: { id: shiftTypeId, userId },
    })

    return NextResponse.json(deletedShiftType)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete shift type' },
      { status: 500 }
    )
  }
}
