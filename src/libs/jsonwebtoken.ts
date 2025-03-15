import { JWT_SECRET } from "@const";
import jwt from "jsonwebtoken";

export const validateToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const signToken = (payload: string) => {
  const ONE_HOUR = new Date(
    new Date().getTime() + 60 * 60 * 1000
  ).getMilliseconds();
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ONE_HOUR });
};
