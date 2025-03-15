import { config } from "dotenv";
// LEER VARIABLES .env
config();

// JSONWEBTOKEN SECRET
export const JWT_SECRET = process.env.SECRET_JWT_KEY;
