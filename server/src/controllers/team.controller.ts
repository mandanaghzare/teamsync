import { Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

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