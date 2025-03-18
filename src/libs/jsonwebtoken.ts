import { JWT_SECRET } from "@const";
import jwt from "jsonwebtoken";
import type { User } from "definitions";

export const validateToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const signToken = (payload: User) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: 60 * 60 * 1000 });
};
