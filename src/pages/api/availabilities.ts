import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "../../lib/prisma";

const prisma = getClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return createAvailability(req, res);
    case "GET":
      return getAvailabilities(req, res);
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

async function getAvailabilities(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  try {
    const availabilities = await prisma.availability.findMany({
      where: {
        token: token as string,
      },
    });
    return res.status(200).json(availabilities);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching availabilities" });
  }
}
