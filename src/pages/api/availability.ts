import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "../../lib/prisma";

const prisma = getClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // TODO
  } else if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const availability = await prisma.availability.findMany({
      where: {
        userId: Number(userId),
      },
    });

    console.log(availability);

    res.status(200).json(availability);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
