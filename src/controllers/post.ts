import { postModel } from "@db";
import type { PostWithoutId, RequestWithUser } from "definitions";
import type { Response } from "express";

export const createPostController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const payload = req.body;
    const { _id, name, username, avatar, joinedAt } = req.userLogged;

    const newPost: PostWithoutId = {
      content: payload?.content,
      hashtags: [],
      files: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: [],
      responses: [],
      owner: {
        _id,
        name,
        username,
        avatar,
        joinedAt,
      },
    };

    const { insertedId } = await postModel.insertOne(newPost);
    res.json({ _id: insertedId, ...newPost });
  } catch (e) {
    res.status(500).json({ message: "Error on server." });
  }
};

export const getPostsController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const posts = await postModel.find({}).sort({ createdAt: -1 }).toArray();

    res.json(posts);
  } catch (e) {
    res.status(500).json({ message: "Error on server." });
  }
};
