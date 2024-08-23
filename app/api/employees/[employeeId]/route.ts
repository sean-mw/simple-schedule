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
    const employee = await prisma.employee.findUnique({
      where: { id: Number(employeeId), userId },
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    return NextResponse.json(employee)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const userId = request.headers.get('x-user-id')
  const { employeeId } = params

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { email, firstName, lastName, employeeNumber } = body

  try {
    const employee = await prisma.employee.update({
      where: { id: Number(employeeId), userId },
      data: {
        email,
        firstName,
        lastName,
        employeeNumber,
      },
    })

    return NextResponse.json(employee)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const userId = request.headers.get('x-user-id')
  const { employeeId } = params

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const deletedEmployee = await prisma.employee.delete({
      where: { id: Number(employeeId), userId },
    })

    return NextResponse.json(deletedEmployee)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    )
  }
}
