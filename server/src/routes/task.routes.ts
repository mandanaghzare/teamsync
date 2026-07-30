import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { assignTask, createTask, deleteTask, getMyAssignedTasks, getSingleTask, getTasksByProject, updateTask, reorderTasks, getAllTasks } from "../controllers/task.controller";

const router = Router();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - projectId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               status:
 *                 type: string
 *               projectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post("/", authenticate, createTask);
/**
 * @swagger
 * /api/tasks/project/{projectId}:
 *   get:
 *     summary: Get all tasks for a project
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 */
router.get("/project/:projectId", authenticate, getTasksByProject);
/**
 * @swagger
 * /api/tasks/assigned/me:
 *   get:
 *     summary: Get tasks assigned to the authenticated user
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assigned tasks retrieved successfully
 */
router.get("/assigned/me", authenticate, getMyAssignedTasks);
/**
 * @swagger
 * /api/tasks/reorder:
 *   patch:
 *     summary: Reorder tasks
 *     description: Update the status and order of multiple tasks after drag and drop.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tasks
 *             properties:
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - status
 *                     - order
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: cms6abt90000ckby24oc4ek
 *                     status:
 *                       type: string
 *                       enum:
 *                         - TODO
 *                         - IN_PROGRESS
 *                         - REVIEW
 *                         - DONE
 *                       example: IN_PROGRESS
 *                     order:
 *                       type: integer
 *                       minimum: 0
 *                       example: 1
 *           example:
 *             tasks:
 *               - id: cms6abt90000ckby24oc4ek
 *                 status: TODO
 *                 order: 0
 *               - id: cms6afusr0001ckbii0q9gr9
 *                 status: IN_PROGRESS
 *                 order: 0
 *               - id: cms6al7t80002ckb2iguk7mc
 *                 status: IN_PROGRESS
 *                 order: 1
 *     responses:
 *       200:
 *         description: Tasks reordered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tasks reordered successfully
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tasks must be an array
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch("/reorder", authenticate, reorderTasks)
/**
 * @swagger
 * /api/tasks/{taskId}:
 *   patch:
 *     summary: Update a task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.patch("/:taskId", authenticate, updateTask);
/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
router.delete("/:taskId", authenticate, deleteTask);
/**
 * @swagger
 * /api/tasks/{taskId}/assign/{userId}:
 *   patch:
 *     summary: Assign a task to a team member
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task assigned successfully
 */
router.patch("/:taskId/assign/:userId", authenticate, assignTask);
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: string
 *                         example: TODO
 *                       priority:
 *                         type: string
 *                         example: HIGH
 *                       order:
 *                         type: integer
 *                       dueDate:
 *                         type: string
 *                         format: date-time
 *                       assignee:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                       project:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticate, getAllTasks);
/**
 * @swagger
 * /api/tasks/{taskId}:
 *   get:
 *     summary: Get a single task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       404:
 *         description: Task not found
 */
router.get("/:taskId", authenticate, getSingleTask);

export default router;