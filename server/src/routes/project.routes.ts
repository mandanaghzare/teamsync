import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createProject, deleteProject, getProjectById, getProjectsByTeam, projectUpdate } from "../controllers/team.controller";

const router = Router();

router.post("/", authenticate, createProject);
router.get("/team/:teamId", authenticate, getProjectsByTeam)
router.get("/:projectId", authenticate, getProjectById)
router.patch("/:projectId", authenticate, projectUpdate)
router.delete("/:projectId", authenticate, deleteProject)

export default router;