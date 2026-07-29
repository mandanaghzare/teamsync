import { api } from "./axios";
import type { ProjectFormValues } from "./project-schema";

export async function updateProject(
  projectId: string,
  data: ProjectFormValues
) {
  const response = await api.patch(
    `/projects/${projectId}`,
    data
  );

  return response.data;
}

export async function getProjects(teamId: string) {
  const { data } = await api.get(
    `/projects/team/${teamId}`
  );

  return data.projects;
}

export async function deleteProject(id: string) {
  const { data } = await api.delete(
    `/projects/${id}`
  );

  return data;
}

export async function createProject(data: ProjectFormValues) {
  const response = await api.post("/projects", data);

  return response.data;
}

export async function getProjectById(projectId: string) {
  const { data } = await api.get(`/projects/${projectId}`)

  return data.project
}