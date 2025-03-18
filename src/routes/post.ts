import { createPostController } from "@controllers/post";
import { Router } from "express";

export const postRouter = Router();

postRouter.post("/post", createPostController);
