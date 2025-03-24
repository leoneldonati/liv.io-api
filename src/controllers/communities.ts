import { communityModel } from "@db";
import type { RequestWithUser } from "definitions";
import type { Response } from "express";

export const getCommunities = async (req: RequestWithUser, res: Response) => {
  const params = req.params;
  try {
    const topCommunities = await communityModel
      .find({})
      .sort({ users: -1 })
      .limit(3)
      .toArray();

    res.json(topCommunities);
  } catch (e) {
    res.status(500).json({ message: "Error on server." });
  }
};
