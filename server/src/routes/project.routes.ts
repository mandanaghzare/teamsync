import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createProject, getProjectsByTeam } from "../controllers/team.controller";

const router = Router();

router.post("/", authenticate, createProject);
router.get("/team/:teamId", authenticate, getProjectsByTeam)

export default router;