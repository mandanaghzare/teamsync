import { Router } from "express";
import { createTeam } from "../controllers/team.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createTeam);

export default router;