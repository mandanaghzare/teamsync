export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "REVIEW"
  | "DONE";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";


export type Task = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  order: number
  dueDate: string | null
  projectId: string
  assigneeId: string | null
  createdAt: string
  updatedAt: string
}