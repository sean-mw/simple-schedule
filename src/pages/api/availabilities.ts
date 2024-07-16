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
      return createAvailability(req, res);
    case "GET":
      return getAvailabilities(req, res, session.user.id);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

async function createAvailability(req: NextApiRequest, res: NextApiResponse) {
  const { token, day, startTime, endTime } = req.body;

  if (!token || !day || !startTime || !endTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await prisma.availability.create({
      data: {
        day: new Date(day),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        token,
      },
    });
    return res.status(201).json({ message: "Availability created" });
  } catch (error) {
    return res.status(500).json({ error: "Error creating availability" });
  }
}

async function getAvailabilities(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const employees = await prisma.employee.findMany({
      where: { userId },
      select: { email: true },
    });

    const employeeEmails = employees.map((e) => e.email);

    const availabilityRequests = await prisma.availabilityRequest.findMany({
      where: { email: { in: employeeEmails } },
      select: { token: true, email: true },
    });

    const tokens = availabilityRequests.map((ar) => ar.token);

    const availabilities = await prisma.availability.findMany({
      where: { token: { in: tokens } },
    });

    const response = availabilityRequests.map((ar) => ({
      email: ar.email,
      availabilities: availabilities.filter((a) => a.token === ar.token),
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching availabilities" });
  }
}
