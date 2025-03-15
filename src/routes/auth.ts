import { Router } from "express";
import { parse } from "@utils/zod";
import { z } from "zod";
import { userModel } from "@db";
import { isMatch } from "@libs/bcrypt";

export const authRouter = Router();

const loginModel = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string({ message: "The password must be a string" }),
});
authRouter.post("/login", async (req, res) => {
  // recuperar cuerpo
  const body = req.body;

  // verificar informacion
  const { data, error } = parse(loginModel, body);

  if (error && !data) {
    res.status(400).json({ message: "Error on data validation", error });
    return;
  }

  try {
    // buscar usuario por email
    const user = await userModel.findOne({ email: data.email });

    if (!user) {
      res.status(401).json({
        message:
          "This user not exists, if you dont be registered please do it.",
      });
      return;
    }

    // matchear contraseña con info
    const isMatchPasswords = await isMatch(data.password, user.password);

    if (!isMatchPasswords) {
      res.status(401).json({
        message:
          "This user not exists, if you dont be registered please do it.",
      });
      return;
    }
  } catch (e) {
    res.status(500).json({ message: "Error on server" });
  }
});
