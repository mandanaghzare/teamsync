import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try{
    const userId = req.user?.userId;
    const {
      title,
      description,
      projectId,
      priority,
      status,
      dueDate,
      assigneeId,
    } = req.body;
    if(!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }
    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      }
    })
    if(!project) {
      return res.status(404).json({
        message: "Project not found"
      })
    }
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: project.teamId
        }
      }
    })
    if(!existingMember) {
      return res.status(403).json({
        message: "You are not a member of this team"
      })
    }
    if(assigneeId) {
      const existingAssignee = await prisma.teamMember.findUnique({
        where: {
          userId_teamId: {
            userId: assigneeId,
            teamId: project.teamId
          }
        }
      })
      if(!existingAssignee) {
        return res.status(400).json({
          message: "Assignee is not a member of this team",
        })
      }
    }
    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeId: assigneeId || undefined,
      },
    });
    return res.status(201).json({
      message: "Task successfully created",
      task
    })
  } catch (error) {
    console.error("CREATE_TASK_ERROR:", error);

    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

export const getTasksByProject = async (req: AuthenticatedRequest, res: Response) => {
  try{
    const userId = req.user?.userId;
    const projectId = req.params.projectId as string
    if(!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }
    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      }
    })
    if(!project) {
      return res.status(404).json({
        message: "Project not found"
      })
    }
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: project.teamId
        }
      }
    })
    if(!existingMember) {
      return res.status(403).json({
        message: "You are not a member of this team"
      })
    }
    const tasks = await prisma.task.findMany({
      where: {
        projectId,
      }
    })
    return res.status(200).json({
      tasks
    })
  } catch (error) {
    console.error("GET_TASKS_BY_PROJECT_ERROR:", error);

    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try{
    const userId = req.user?.userId;
    const taskId = req.params.taskId as string
    const {title, description} = req.body
    if(!userId) {
        return res.status(401).json({
          message: "Unauthorized"
        })
    }
    const task = await prisma.task.findUnique({
      where: {
        id: taskId
      }
    })
    if (!task) {
      return res.status(404).json({
        message: "No task found"
      })
    }
    const project = await prisma.project.findUnique({
      where: {
        id: task.projectId
      }
    })
    if(!project) {
      return res.status(404).json({
        message: "Project not found"
      })
    }
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: project?.teamId
        }
      }
    })
    if(!existingMember) {
      return res.status(403).json({
        message: "You are not a member of this team"
      })
    }
    const updateTask = await prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        ...(title && {title}),
        ...(description && {description}),
      }
    })
    return res.status(200).json({
      message: "Task updated successfully!",
      updateTask
    })
  } catch (error) {
    console.error("UPDATE_TASK_ERROR:", error);

    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try{
    const userId = req.user?.userId as string
    const taskId = req.params.taskId as string
    const task = await prisma.task.findUnique({
      where: {
        id: taskId
      }
    })
    const project = await prisma.project.findUnique({
      where: {
        id: task?.projectId
      }
    })
    if(!project) {
      return res.status(400).json({
        message: "Project not found!"
      })
    }
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: project?.teamId
        }
      }
    })
    if(!existingMember) {
      return res.status(403).json({
        message: "You are not a member of this team"
      })
    }
    const taskDelete = await prisma.task.delete({
      where: {
        id: taskId
      }
    })
    return res.status(200).json({
      message: "Task deleted successfully!"
    })
  } catch (error) {
    console.error("DELETE_TASK_ERROR:", error);

    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

export const assignTask = async (req: AuthenticatedRequest, res: Response) => {
  try{
    const userId = req.user?.userId
    const taskId = req.params.taskId as string
    if(!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }
    const task = await prisma.task.findUnique({
      where: {
        id: taskId
      }
    })
    if(!task) {
      return res.status(404).json({
        message: "No task found"
      })
    }
    const project = await prisma.project.findUnique({
      where: {
        id: task.projectId
      }
    })
    if(!project) {
      return res.status(404).json({
        message: "Project not found"
      })
    }
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: project.teamId
        }
      }
    })
    if(!existingMember) {
      return res.status(403).json({
        message: "You are not a member of this team"
      })
    }
    const updatedTask  = await prisma.task.update({
      where: {
        id: taskId
      }, data: {
        assigneeId: userId
      },
    })
    if(!updatedTask ) {
      return res.status(403).json({
        message: "You are not a member of this team"
      })
    }
    return res.status(200).json({
      message: "Task assigned successfully",
      updatedTask 
    })
  } catch (error) {
    console.error("UPDATE_TASK_ERROR:", error);

    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

export const getSingleTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const taskId = req.params.taskId as string;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({
        message: "No task found",
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: task.projectId },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: project.teamId,
        },
      },
    });

    if (!existingMember) {
      return res.status(403).json({
        message: "You are not a member of this team",
      });
    }

    return res.status(200).json({
      message: "Task found successfully",
      task,
    });
  } catch (error) {
    console.error("GET_SINGLE_TASK_ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMyAssignedTasks = async (req: AuthenticatedRequest, res:Response) => {
    try {
        const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const tasks = await prisma.task.findMany({
        where: {
            assigneeId: userId,
        },
        include: {
            project: true,
        },
    });

    return res.status(200).json({
        tasks,
    });
  } catch (error) {
        console.error("GET_MY_ASSIGNED_TASKS_ERROR:", error);

    return res.status(500).json({
        message: "Internal server error",
    });
  }
};
