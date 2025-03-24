import { getCommunities } from "@controllers/communities";
import { Router } from "express";

export const communitiesRouter = Router();

communitiesRouter.get("/community", getCommunities);
