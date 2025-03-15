import express from "express";

export const app = express();

// desactivar cabecera "x-powered-by"
app.disable("x-powered-by");
// parsear json requests
app.use(express.json());
