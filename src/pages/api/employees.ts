import type { NextApiRequest, NextApiResponse } from 'next'
import getClient from '../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

const prisma = getClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  switch (req.method) {
    case 'POST':
      if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      return createEmployee(req, res, session.user.id)
    case 'GET':
      return getEmployees(req, res)
    case 'DELETE':
      if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      return deleteEmployee(req, res, session.user.id)
    case 'PUT':
      if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      return updateEmployee(req, res, session.user.id)
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function createEmployee(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  const { email, firstName, lastName, employeeNumber } = req.body

  if (!email || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing required fields' })
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
    return res.status(201).json(employee)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error creating employee' })
  }
}

async function updateEmployee(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  const {
    current: { email },
    updated: {
      email: updatedEmail,
      firstName: updatedFirstName,
      lastName: updatedLastName,
      employeeNumber: updatedEmployeeNumber, // optional
    },
  } = req.body

  if (!email || !updatedEmail || !updatedFirstName || !updatedLastName) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const employee = await prisma.employee.update({
      where: {
        email,
        userId,
      },
      data: {
        email: updatedEmail,
        firstName: updatedFirstName,
        lastName: updatedLastName,
        employeeNumber: updatedEmployeeNumber,
      },
    })
    return res.status(200).json(employee)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error updating employee' })
  }
}

async function getEmployees(req: NextApiRequest, res: NextApiResponse) {
  let email: string | undefined

  const { token } = req.query

  if (token) {
    const availabilityRequest = await prisma.availabilityRequest.findUnique({
      where: { token: token as string },
    })
    email = availabilityRequest?.email
  }

  const where: { userId?: string; email?: string } = {}
  if (!email) {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    where.userId = session.user.id
  } else {
    where.email = email
  }

  try {
    const employees = await prisma.employee.findMany({ where })
    return res.status(200).json(employees)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error fetching employees' })
  }
}

async function deleteEmployee(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  const { email } = req.query

  if (!email) {
    return res.status(400).json({ error: 'Missing email' })
  }

  try {
    await prisma.employee.delete({
      where: {
        userId,
        email: email as string,
      },
    })
    return res.status(200).json({ message: 'Employee deleted' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error deleting employee' })
  }
}
