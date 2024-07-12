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

  if (req.method === "POST") {
    const { email, firstName, lastName } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await prisma.employee.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        userId: session.user.id,
      },
    });

    return res.status(201).json({ message: "Employee created" });
  } else if (req.method === "GET") {
    const employees = await prisma.employee.findMany({
      where: {
        userId: session.user.id,
      },
    });

    res.status(200).json(employees);
  } else if (req.method === "DELETE") {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    await prisma.employee.delete({
      where: {
        email: email as string,
      },
    });

    return res.status(200).json({ message: "Employee deleted" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
