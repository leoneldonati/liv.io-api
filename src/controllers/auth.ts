import { COOKIE_NAME, IS_PROD } from "@const";
import { userModel } from "@db";
import { isMatch } from "@libs/bcrypt";
import { signToken } from "@libs/jsonwebtoken";
import { parse } from "@utils/zod";
import { z } from "zod";
import type { User } from "definitions";
import type { Request, Response } from "express";

const loginModel = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string({ message: "The password must be a string" }),
});
export const loginController = async (req: Request, res: Response) => {
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

    const signedToken = await signToken(user as User);

    const ONE_HOUR = 60 * 60 * 1000;
    res
      .cookie(COOKIE_NAME, signedToken, {
        httpOnly: true,
        secure: IS_PROD,
        maxAge: ONE_HOUR,
      })
      .json({ message: `Logged succefully! Welcome back ${user.name}!` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error on server" });
  }
};
