import { z } from "zod"

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Task title must be at least 3 characters"),

  description: z
    .string()
    .min(3, "Description must be at least 3 characters"),

  status: z.enum([
    "TODO",
    "IN_PROGRESS",
    "REVIEW",
    "DONE",
  ]),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
  ]),

  dueDate: z
    .string()
    .optional(),

  projectId: z
    .string()
    .min(1, "Project is required"),

  assigneeId: z
    .string()
    .optional(),
})

export type TaskFormValues = z.infer<
  typeof taskSchema
>