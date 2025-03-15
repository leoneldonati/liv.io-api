import { Router } from "express";
import { parse } from "@utils/zod";
import { z } from "zod";

export const authRouter = Router();

const loginModel = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string({ message: "The password must be a string" }),
});
authRouter.post("/login", async (req, res) => {
  // recuperar cuerpo
  const body = req.body;

  const { data, error } = parse(loginModel, body);

  if (error)
    res.status(400).json({ message: "Error on data validation", error });

  res.json();
});
