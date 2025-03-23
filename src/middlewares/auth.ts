import { COOKIE_CONFIG, COOKIE_NAME } from "@const";
import { validateToken } from "@libs/jsonwebtoken";
import type { CookieOptions, NextFunction, Request, Response } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const url = req.url;

  if (url === "/login") {
    next();
    return;
  }
  // recuperar token
  const token = req.cookies["cookie-token"];

  if (!token) {
    res.status(401).json({
      message: "Session expired! Please login.",
    });
    return;
  }
  const decoded = validateToken(token);

  if (!decoded) {
    res
      .status(401)
      .cookie(COOKIE_NAME, "", {
        ...(COOKIE_CONFIG as CookieOptions),
        maxAge: 0,
      })
      .json({
        message: "Session expired! Please login.",
      });
    return;
  }
  next();
};
