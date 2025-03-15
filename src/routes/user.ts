import { createUserController } from "@controllers/user";
import { Router } from "express";

export const userRouter = Router();

userRouter.post("/user", createUserController);
