import { Router } from "express"

import { authenticate } from "../middleware/auth.middleware"
import { getDashboard } from "../controllers/dashboard.controller"

const dashboardRoutes  = Router()

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard data
 *     description: Returns project and task statistics, recent projects, assigned tasks, and upcoming deadlines for the authenticated user.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     projects:
 *                       type: integer
 *                       example: 4
 *                     tasks:
 *                       type: integer
 *                       example: 18
 *                     todo:
 *                       type: integer
 *                       example: 5
 *                     inProgress:
 *                       type: integer
 *                       example: 4
 *                     review:
 *                       type: integer
 *                       example: 2
 *                     done:
 *                       type: integer
 *                       example: 7
 *                     overdue:
 *                       type: integer
 *                       example: 1
 *                 recentProjects:
 *                   type: array
 *                   items:
 *                     type: object
 *                 myTasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                 upcomingTasks:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to load dashboard data
 */
dashboardRoutes .get("/", authenticate, getDashboard)

export default dashboardRoutes 