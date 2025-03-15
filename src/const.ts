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
