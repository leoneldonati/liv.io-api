import { postModel } from "@db";
import { io } from "@index";
import type { PostWithoutId, RequestWithUser } from "definitions";
import type { Response } from "express";
import { ObjectId } from "mongodb";

export const createPostController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const payload = req.body;
    const files = req.files;
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
    const newPostWithId = { _id: insertedId, ...newPost };
    res.json(newPostWithId);
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

export const updatePostController = async (
  req: RequestWithUser,
  res: Response
) => {
  const queryParams = req.query;

  const { from, to, action } = queryParams;

  try {
    if (action === "LIKE") {
      const updatedDocument = await postModel.findOneAndUpdate(
        { _id: new ObjectId(to.toString()) },
        { $push: { likes: from.toString() as never } },
        { returnDocument: "after" }
      );

      // emitir un evento para actualizar el status
      io.emit(`update-post-${to}`, {
        hasLiked: true,
        msg: `Liked to ${to}`,
        updatedCounters: {
          likesCount: updatedDocument.likes.length,
          responsesCount: updatedDocument.responses.length,
          sharedCount: 0, // <-- TODO: Agregar este campo al modelo
        },
      });
      res.json({ message: "Post liked!" });
      return;
    }
    if (action === "UNLIKE") {
      const updatedDocument = await postModel.findOneAndUpdate(
        { _id: new ObjectId(to.toString()) },
        { $pull: { likes: from.toString() as never } },
        { returnDocument: "after" }
      );

      // emitir un evento para actualizar el status
      io.emit(`update-post-${to}`, {
        hasLiked: false,
        msg: `Liked to: ${to}`,
        updatedCounters: {
          likesCount: updatedDocument.likes.length,
          responsesCount: updatedDocument.responses.length,
          sharedCount: 0, // <-- TODO: Agregar este campo al modelo
        },
      });
      res.json({ message: "Post unliked!" });
      return;
    }

    res.json({});
  } catch (e) {
    res.status(500).json({
      message: "Error on server.",
    });
  }
};
