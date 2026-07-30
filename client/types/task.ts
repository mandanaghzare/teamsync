export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "DONE";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";


export type Task = {
  id: string
  title: string
  description?: string | null
  status:
    | "TODO"
    | "IN_PROGRESS"
    | "DONE"
  priority:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
  dueDate?: string | null
  projectId: string
  assigneeId?: string | null
  order: number
  assignee?: {
    id: string
    name: string
    email: string
  } | null
}