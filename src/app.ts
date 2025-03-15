import express from "express";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import { authRouter } from "@routes/auth";
import { userRouter } from "@routes/user";

export const app = express();

// LOGS DE PRODUCCION
app.use(morgan("dev"));

// desactivar cabecera "x-powered-by"
app.disable("x-powered-by");

// parsear json requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// recibir archivos
app.use(fileUpload());
// RUTAS

//autenticacion
app.use(authRouter);

//usuarios
app.use(userRouter);
