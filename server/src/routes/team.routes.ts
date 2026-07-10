import { Router } from "express";
import { createTeam, getMyTeam, joinTeam } from "../controllers/team.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Team created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, createTeam);
/**
 * @swagger
 * /api/teams/join:
 *   post:
 *     summary: Join a team using invite code
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inviteCode
 *             properties:
 *               inviteCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Joined team successfully
 *       404:
 *         description: Team not found
 */
router.post("/join", authenticate, joinTeam)
/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get current user's team
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team returned successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, getMyTeam)

export default router;