import { Router } from "express";
import { createTeam, joinTeam } from "../controllers/team.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createTeam);
router.post("/join", authenticate, joinTeam)

export default router;