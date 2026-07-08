import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { prisma } from "../config/prisma";

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