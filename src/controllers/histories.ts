import { historiesModel } from "@db";
import type { RequestWithUser } from "definitions";
import type { Response } from "express";

export const getHistories = async (req: RequestWithUser, res: Response) => {
  const query = req.query;
  if (!query?.sort || typeof query?.sort !== "string") {
    res.status(400).json({ message: "¡sort param must be included!" });
    return;
  }
  try {
    const recentHistories = await historiesModel
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(recentHistories);
  } catch (e) {
    res.status(500).json({ message: "Error on server." });
  }
};

export const createHistory = async (req: RequestWithUser, res: Response) => {
  try {
    const file = req.files;

    console.log(file);
    res.json({});
  } catch (e) {
    res.status(500).json({ message: "Error on server." });
  }
};
