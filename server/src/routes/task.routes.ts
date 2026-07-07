import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createTask, getTasksByProject } from "../controllers/team.controller";

const router = Router();

router.post("/", authenticate, createTask)
router.get("/project/:projectId", authenticate, getTasksByProject);

export default router;