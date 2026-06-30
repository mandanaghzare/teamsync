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