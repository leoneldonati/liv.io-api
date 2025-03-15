import { JWT_SECRET, ONE_HOUR_IN_MS } from "@const";
import jwt from "jsonwebtoken";

export const validateToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const signToken = (payload: string) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ONE_HOUR_IN_MS });
};
