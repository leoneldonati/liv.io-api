import { loginController } from "@controllers/auth";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/login", loginController);
