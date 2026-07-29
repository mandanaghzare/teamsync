import { Router } from "express";
import { createTeam, getMyTeam, getTeamMembers, joinTeam } from "../controllers/team.controller";
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
/**
 * @swagger
 * /api/teams/{teamId}/members:
 *   get:
 *     summary: Get team members
 *     description: Returns all members of a team for an authenticated team member.
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Team members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum:
 *                       - OWNER
 *                       - MEMBER
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is not a member of the team
 *       500:
 *         description: Failed to load team members
 */
router.get("/:teamId/members", authenticate, getTeamMembers)

export default router;