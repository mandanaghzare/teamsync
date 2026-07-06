import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createTask } from "../controllers/team.controller";

const router = Router();

router.post("/", authenticate, createTask)

export default router;