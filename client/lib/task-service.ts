import { TaskStatus } from "@/types/task"
import { api } from "./axios"
import type { TaskFormValues } from "./task-schema"

export async function getTasksByProject(projectId: string) {
  const { data } = await api.get(
    `/tasks/project/${projectId}`
  )

  return data.tasks
}

export async function getTaskById(taskId: string) {
  const { data } = await api.get(`/tasks/${taskId}`)

  return data.task
}


export async function createTask(
  data: TaskFormValues
) {
  const response = await api.post("/tasks", data)

  return response.data
}

export async function updateTask(
  taskId: string,
  data: TaskFormValues
) {
  const response = await api.patch(
    `/tasks/${taskId}`,
    data
  )

  return response.data
}

export async function deleteTask(taskId: string) {
  const { data } = await api.delete(
    `/tasks/${taskId}`
  )

  return data
}

export async function assignTask(
  taskId: string,
  userId: string
) {
  const { data } = await api.patch(
    `/tasks/${taskId}/assign/${userId}`
  )

  return data
}

export type ReorderTaskItem = {
  id: string
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE"
  order: number
}

export async function reorderTasks(
  tasks: {
    id: string
    status: TaskStatus
    order: number
  }[]
) {
  const response = await api.patch("/tasks/reorder", {
    tasks,
  })

  return response.data
}

export async function getAllTasks() {
  const { data } = await api.get("/tasks")

  return data.tasks
}