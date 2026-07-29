import type { DashboardData } from "@/types/dashboard"
import { api } from "./axios"

export async function getDashboard(): Promise<DashboardData> {
  const response = await api.get<DashboardData>("/dashboard")

  return response.data
}