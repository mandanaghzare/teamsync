import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createTask, deleteTask, getTasksByProject, updateTask } from "../controllers/team.controller";

const router = Router();

router.post("/", authenticate, createTask)
router.get("/project/:projectId", authenticate, getTasksByProject);
router.patch("/:taskId", authenticate, updateTask)
router.delete("/:taskId", authenticate, deleteTask)

export default router;