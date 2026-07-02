import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createProject } from "../controllers/team.controller";

const router = Router();

router.post("/", authenticate, createProject);

export default router;