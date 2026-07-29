import axiosInstance from "./axios"

export type TeamMember = {
  id: string
  role: "OWNER" | "MEMBER"
  user: {
    id: string
    name: string
    email: string
  }
}

export const getTeamMembers = async (
  teamId: string
): Promise<TeamMember[]> => {
  const { data } = await axiosInstance.get(`/teams/${teamId}/members`)
  return data
}