import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const employees = await prisma.employee.findMany({
      where: { userId },
    })

    if (!employees) {
      return NextResponse.json(
        { error: 'Employees not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(employees)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
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
    const { email, firstName, lastName, employeeNumber } = body

    const newEmployee = await prisma.employee.create({
      data: {
        email,
        firstName,
        lastName,
        employeeNumber,
        userId,
      },
    })

    return NextResponse.json(newEmployee, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}
