import type { Request, Response } from "express";

export const createPostController = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    res.status(500).json({ message: "Error on server." });
  }
};
