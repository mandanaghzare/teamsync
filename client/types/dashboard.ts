import type { TaskPriority, TaskStatus } from "@/types/task"

export type DashboardStats = {
  projects: number
  tasks: number
  todo: number
  inProgress: number
  done: number
  overdue: number
}

export type DashboardProject = {
  id: string
  name: string
  description: string | null
  createdAt: string
  team: {
    id: string
    name: string
  }
  _count: {
    tasks: number
  }
}

export type DashboardTask = {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: TaskPriority
  order?: number
  dueDate: string | null
  projectId: string
  assigneeId: string | null
  createdAt?: string
  updatedAt?: string
  project: {
    id: string
    name: string
  }
  assignee?: {
    id: string
    name: string
    email: string
  } | null
}

export type DashboardData = {
  stats: DashboardStats
  recentProjects: DashboardProject[]
  myTasks: DashboardTask[]
  upcomingTasks: DashboardTask[]
}