import { COOKIE_CONFIG, COOKIE_NAME } from "@const";
import { validateToken } from "@libs/jsonwebtoken";
import type { RequestWithUser, User } from "definitions";
import type { CookieOptions, NextFunction, Response } from "express";

const UNPROTECTED_ROUTES = ["/login", "/user/create"];
export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const url = req.url;

  if (UNPROTECTED_ROUTES.includes(url)) {
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

  req.userLogged = decoded as User;
  next();
};
