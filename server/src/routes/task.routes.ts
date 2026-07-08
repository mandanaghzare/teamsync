import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { assignTask, createTask, deleteTask, getMyAssignedTasks, getSingleTask, getTasksByProject, updateTask } from "../controllers/task.controller";

const router = Router();

router.post("/", authenticate, createTask);
router.get("/project/:projectId", authenticate, getTasksByProject);
router.get("/assigned/me", authenticate, getMyAssignedTasks);
router.patch("/:taskId", authenticate, updateTask);
router.delete("/:taskId", authenticate, deleteTask);
router.patch("/:taskId/assign/:userId", authenticate, assignTask);
router.get("/:taskId", authenticate, getSingleTask);

export default router;