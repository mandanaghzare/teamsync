import { response, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { title } from "node:process";

const createTeamSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters"),
});

const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export const createTeam = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { name } = createTeamSchema.parse(req.body);

    const team = await prisma.team.create({
      data: {
        name,
        inviteCode: generateInviteCode(),
        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
      include: {
        members: true,
      },
    });

    return res.status(201).json({
      message: "Team created successfully",
      team,
    });
    } catch (error) {
    console.error("CREATE_TEAM_ERROR:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const joinTeam = async(req: AuthenticatedRequest, res: Response) => {
  try{
    const {inviteCode} = req.body;
    const userId = req.user?.userId;

    if(!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }

    const team = await prisma.team.findUnique({
      where: {
        inviteCode,
      },
    })
    if(!team) {
      return res.status(404).json({
        message: "Team Not Found!",
      })
    }

    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: team.id
        }
      },
    })
    if(existingMember) {
      return res.status(409).json({
        message: "You are already a member of this team",

      })
    }

    const membership = await prisma.teamMember.create({
      data: {
        userId,
        teamId: team.id,
        role: "MEMBER"
      },
      include: {
        team: true,
      }
    })
    return res.status(201).json({
      message: "Joined team successfully",
      membership,
    })
  } catch (error){
    console.error("JOIN_TEAM_ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
    })
  }
}

export const getMyTeam = async (req: AuthenticatedRequest, res: Response) => {
  try{
    const userId = req.user?.userId;
    if(!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }
    const membership = await prisma.teamMember.findMany({
      where: {
        userId,
      },
      include: {
        team: true
      },
    })
    return res.status(200).json({
      teams: membership,
    })
  } catch (error) {
    console.error("GET_MY_TEAMS_ERROR:", error)
    
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  const {name, description, teamId} = req.body;
  const userId = req.user?.userId;

  if(!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    })
  }
console.log("USER:", userId);
console.log("TEAM:", teamId);
  const existingMember = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId,
        teamId,
      }
    }
  })
  console.log("MEMBER:", existingMember);
  if(!existingMember) {
    return res.status(403).json({
      message: "You are not a member of this team",
    })
  }
  const project = await prisma.project.create({
    data: {
      name,
      description,
      teamId
    },
  });
  return res.status(200).json({
    message: "Project created successfully",
    project
  })
}

export const getProjectsByTeam = async (req: AuthenticatedRequest, res: Response) => {
  try{
    const teamId = req.params.teamId as string;
    const userId = req.user?.userId
    if(!userId) {
      return res.status(403).json({
        message: "Unauthorized"
      })
    }
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId
        }
      }
    })
    if(!existingMember) {
      return res.status(403).json({
        message: "You are not a member of this team"
      })
    }
    const projects = await prisma.project.findMany({
      where: {
        teamId
      }
    })
    return res.status(200).json({
      projects,
    })
  } catch (error){
    console.error("GET_PROJECTS_BY_TEAM_ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    })
  }
}

export const getProjectById = async (req: AuthenticatedRequest ,res: Response) => {
  try{
      const projectId = req.params.projectId as string
      const userId = req.user?.userId as string
      if(!userId) {
        res.status(401).json({
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
          message: "Project not found",
        });
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
      return res.status(200).json({
        project,
      })
  } catch (error) {
    console.error("GET_PROJECT_BY_ID_ERROR", error)

    return res.status(500).json({
      message: "Internal server error",
    })
  }
}

export const projectUpdate = async (req:AuthenticatedRequest ,res: Response) => {
  try{
    const projectId = req.params.projectId as string;
    const userId = req.user?.userId;
    const { name, description } = req.body;
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
        message: "Project not found",
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
      return res.status(403).json ({
        message: "You are not a member of this team"
      }) 
    }
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        ...(name && {name}),
        ...(description && {description}),
      }
    })
    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject
    })
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    })
  }
}

export const deleteProject = async (req: AuthenticatedRequest, res: Response) => {
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
        message: "Project not found!"
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
    const projectDelete = await prisma.project.delete({
      where: {
        id: projectId
      }
    })
    return res.status(200).json({
      message: "Project deleted successfully!"
    })
  } catch (error) {
    console.error("DELETE_PROJECT_ERROR", error)
    return res.status(500).json({
      message: "Internal server error",
    })
  }
}

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
