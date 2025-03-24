import {
  createPostController,
  getPostsController,
  updatePostController,
} from "@controllers/post";
import { Router } from "express";

export const postRouter = Router();

postRouter.post("/posts/create", createPostController);

postRouter.get("/posts", getPostsController);

postRouter.patch("/posts", updatePostController);
