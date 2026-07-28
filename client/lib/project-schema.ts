import { z } from "zod"

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters"),

  description: z
    .string()
    .min(3, "Description must be at least 3 characters"),

  teamId: z
    .string()
    .min(1, "Team is required"),
})

export type ProjectFormValues = z.infer<typeof projectSchema>