import { api } from "./axios";
import { ProjectFormValues } from "./project-schema";

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