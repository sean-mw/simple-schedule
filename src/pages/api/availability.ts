import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "../../lib/prisma";

const prisma = getClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { day, startTime, endTime } = req.body;

    if (!day || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await prisma.availability.create({
      data: {
        day: new Date(day),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        user: {
          connect: {
            id: 1, // TODO: Replace with the authenticated user's ID
          },
        },
      },
    });

    return res.status(201).json({ message: "Availability created" });
  } else if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const availability = await prisma.availability.findMany({
      where: {
        userId: Number(userId),
      },
    });

    res.status(200).json(availability);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
