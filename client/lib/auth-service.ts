import { api } from "@/lib/axios"

export type AuthUser = {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  isOnline: boolean
  createdAt: string
}

export type RegisterData = {
  name: string
  email: string
  password: string
}

export type LoginData = {
  email: string
  password: string
}

export async function registerUser(
  data: RegisterData
) {
  const response = await api.post(
    "/auth/register",
    data
  )

  return response.data
}

export async function loginUser(
  data: LoginData
) {
  const response = await api.post(
    "/auth/login",
    data
  )

  return response.data as {
    message: string
    token: string
    user: AuthUser
  }
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me")

  return response.data.user as AuthUser
}