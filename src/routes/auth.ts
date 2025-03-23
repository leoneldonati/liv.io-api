import { loginController, logoutController } from "@controllers/auth";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/login", loginController);

authRouter.get("/logout", logoutController);
