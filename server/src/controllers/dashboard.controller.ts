import type { Response } from "express"

import type { AuthenticatedRequest } from "../middleware/auth.middleware"
import { prisma } from "../config/prisma"

export const getDashboard = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      })
    }

    const teamMemberships = await prisma.teamMember.findMany({
      where: {
        userId,
      },
      select: {
        teamId: true,
      },
    })

    const teamIds = teamMemberships.map(
      (membership) => membership.teamId
    )

    if (teamIds.length === 0) {
      return res.status(200).json({
        stats: {
          projects: 0,
          tasks: 0,
          todo: 0,
          inProgress: 0,
          review: 0,
          done: 0,
          overdue: 0,
        },
        recentProjects: [],
        myTasks: [],
        upcomingTasks: [],
      })
    }

    const projectWhere = {
      teamId: {
        in: teamIds,
      },
    }

    const taskWhere = {
      project: {
        teamId: {
          in: teamIds,
        },
      },
    }

    const now = new Date()

    const upcomingLimit = new Date()
    upcomingLimit.setDate(upcomingLimit.getDate() + 7)

    const [
      projectsCount,
      tasksCount,
      todoCount,
      inProgressCount,
      doneCount,
      overdueCount,
      recentProjects,
      myTasks,
      upcomingTasks,
    ] = await prisma.$transaction([
      prisma.project.count({
        where: projectWhere,
      }),

      prisma.task.count({
        where: taskWhere,
      }),

      prisma.task.count({
        where: {
          ...taskWhere,
          status: "TODO",
        },
      }),

      prisma.task.count({
        where: {
          ...taskWhere,
          status: "IN_PROGRESS",
        },
      }),

      prisma.task.count({
        where: {
          ...taskWhere,
          status: "DONE",
        },
      }),

      prisma.task.count({
        where: {
          ...taskWhere,
          dueDate: {
            lt: now,
          },
          status: {
            not: "DONE",
          },
        },
      }),

      prisma.project.findMany({
        where: projectWhere,
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          team: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      }),

      prisma.task.findMany({
        where: {
          ...taskWhere,
          assigneeId: userId,
          status: {
            not: "DONE",
          },
        },
        orderBy: [
          {
            dueDate: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
        take: 6,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          order: true,
          dueDate: true,
          projectId: true,
          assigneeId: true,
          createdAt: true,
          updatedAt: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      prisma.task.findMany({
        where: {
          ...taskWhere,
          dueDate: {
            gte: now,
            lte: upcomingLimit,
          },
          status: {
            not: "DONE",
          },
        },
        orderBy: {
          dueDate: "asc",
        },
        take: 6,
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          projectId: true,
          assigneeId: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ])

    return res.status(200).json({
      stats: {
        projects: projectsCount,
        tasks: tasksCount,
        todo: todoCount,
        inProgress: inProgressCount,
        done: doneCount,
        overdue: overdueCount,
      },
      recentProjects,
      myTasks,
      upcomingTasks,
    })
  } catch (error) {
    console.error("GET_DASHBOARD_ERROR:", error)

    return res.status(500).json({
      message: "Failed to load dashboard data",
    })
  }
}