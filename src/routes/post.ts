import { createPostController, getPostsController } from "@controllers/post";
import { Router } from "express";

export const postRouter = Router();

postRouter.post("/posts/create", createPostController);

postRouter.get("/posts", getPostsController);
