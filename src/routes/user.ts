import { createUserController, deleteUserController } from "@controllers/user";
import { Router } from "express";

export const userRouter = Router();

userRouter.post("/user", createUserController);

userRouter.delete("/user/:_id", deleteUserController);
