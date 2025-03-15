import { JWT_SECRET } from "@const";
import jwt from "jsonwebtoken";

export const validateToken = (token: string) => {
  jwt.verify(token, JWT_SECRET);
};
