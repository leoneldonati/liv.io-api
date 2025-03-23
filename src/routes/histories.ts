import { createHistory, getHistories } from "@controllers/histories";
import { Router } from "express";

export const historiesRouter = Router();

historiesRouter.get("/histories", getHistories);

historiesRouter.post("/histories/create", createHistory);
