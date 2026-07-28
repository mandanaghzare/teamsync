export type Project = {
  id: string
  name: string

  // Backend fields
  description: string
  teamId: string

  // UI fields
  team: string
  status: "Active" | "Review" | "Completed"
  progress: number
  dueDate: string

  createdAt?: string
  updatedAt?: string
}