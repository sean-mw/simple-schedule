import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/nextauth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return createEmployee(req, session.user.id)
}

export async function GET(req: NextRequest) {
  return getEmployees(req)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return deleteEmployee(req, session.user.id)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return updateEmployee(req, session.user.id)
}

async function createEmployee(req: NextRequest, userId: string) {
  const { email, firstName, lastName, employeeNumber } = await req.json()

  if (!email || !firstName || !lastName) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  try {
    const employee = await prisma.employee.create({
      data: {
        email,
        firstName,
        lastName,
        userId,
        employeeNumber,
      },
    })
    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error creating employee' },
      { status: 500 }
    )
  }
}

async function updateEmployee(req: NextRequest, userId: string) {
  const {
    current: { email },
    updated: {
      email: updatedEmail,
      firstName: updatedFirstName,
      lastName: updatedLastName,
      employeeNumber: updatedEmployeeNumber,
    },
  } = await req.json()

  if (!email || !updatedEmail || !updatedFirstName || !updatedLastName) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  try {
    const employee = await prisma.employee.update({
      where: {
        email_userId: { email, userId },
      },
      data: {
        email: updatedEmail,
        firstName: updatedFirstName,
        lastName: updatedLastName,
        employeeNumber: updatedEmployeeNumber,
      },
    })
    return NextResponse.json(employee, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Error updating employee' },
      { status: 500 }
    )
  }
}

async function getEmployees(req: NextRequest) {
  let email: string | undefined

  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (token) {
    const availabilityRequest = await prisma.availabilityRequest.findUnique({
      where: { token: token as string },
    })
    email = availabilityRequest?.email
  }

  const where: { userId?: string; email?: string } = {}
  if (!email) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    where.userId = session.user.id
  } else {
    where.email = email
  }

  try {
    const employees = await prisma.employee.findMany({ where })
    return NextResponse.json(employees, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error fetching employees' },
      { status: 500 }
    )
  }
}

async function deleteEmployee(req: NextRequest, userId: string) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  try {
    await prisma.employee.delete({
      where: {
        email_userId: { userId, email: email as string },
      },
    })
    return NextResponse.json({ message: 'Employee deleted' }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Error deleting employee' },
      { status: 500 }
    )
  }
}
