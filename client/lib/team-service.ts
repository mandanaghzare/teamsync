import { api } from "./axios"

export type Team = {
  id: string
  name: string
  inviteCode: string
}

export type TeamMembership = {
  id: string
  role: "OWNER" | "MEMBER"
  userId: string
  teamId: string
  team: Team
}

export type TeamMember = {
  id: string
  role: "OWNER" | "MEMBER"
  user: {
    id: string
    name: string
    email: string
  }
}

export async function getMyTeams(): Promise<TeamMembership[]> {
  const { data } = await api.get("/teams")

  return data.teams
}

export async function getTeamMembers(
  teamId: string
): Promise<TeamMember[]> {
  const { data } = await api.get(
    `/teams/${teamId}/members`
  )

  return data
}

export async function createTeam(name: string) {
  const { data } = await api.post("/teams", {
    name,
  })

  return data
}

export async function joinTeam(inviteCode: string) {
  const { data } = await api.post("/teams/join", {
    inviteCode,
  })

  return data
}