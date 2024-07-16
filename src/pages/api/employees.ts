import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = getClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  switch (req.method) {
    case "POST":
      return createEmployee(req, res, session.user.id);
    case "GET":
      return getEmployees(req, res, session.user.id);
    case "DELETE":
      return deleteEmployee(req, res, session.user.id);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

async function createEmployee(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  const { email, firstName, lastName } = req.body;

  if (!email || !firstName || !lastName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await prisma.employee.create({
      data: {
        email,
        firstName,
        lastName,
        userId,
      },
    });
    return res.status(201).json({ message: "Employee created" });
  } catch (error) {
    return res.status(500).json({ error: "Error creating employee" });
  }
}

async function getEmployees(
  _req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const employees = await prisma.employee.findMany({
      where: {
        userId,
      },
    });
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching employees" });
  }
}

async function deleteEmployee(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  try {
    await prisma.employee.delete({
      where: {
        userId,
        email: email as string,
      },
    });
    return res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Error deleting employee" });
  }
}
