import { config } from "dotenv";
// LEER VARIABLES .env
config();

// JSONWEBTOKEN SECRET
export const JWT_SECRET = process.env.SECRET_JWT_KEY;

// MONGODB
export const MONGO_CREDENTIALS = {
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
};

// CLOUDINARY
export const CLOUDINARY_CREDENTIALS = {
  CLD_NAME: process.env.CLD_NAME,
  CLD_SECRET: process.env.CLD_SECRET,
  CLD_KEY: process.env.CLD_KEY,
};

// CLIENT ORIGIN
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

// NODE JS
export const IS_PROD = process.env.NODE_ENV === "production";

// OTHERS
export const ONE_HOUR_IN_MS = new Date(
  new Date().getTime() + 60 * 60 * 1000
).getMilliseconds();
const ONE_HOUR = 60 * 60 * 1000;

// COOKIES

export const COOKIE_NAME = "cookie-token";
export const COOKIE_CONFIG = {
  httpOnly: true,
  secure: IS_PROD,
  maxAge: ONE_HOUR,
  sameSite: "lax",
};
