import { createUserController, deleteUserController } from "@controllers/user";
import { Router } from "express";

export const userRouter = Router();

userRouter.post("/user/create", createUserController);

userRouter.delete("/user/delete/:_id", deleteUserController);
