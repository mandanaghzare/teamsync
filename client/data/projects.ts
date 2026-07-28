import type { Project } from "@/types/project"

export const projects: Project[] = [
  {
    "id": "cmr3wiohj00004wkbje3ofgqy",
    "name": "Website Redesign Updated",
    "description": "Updated project description",
    "createdAt": "2026-07-02T19:32:30.967Z",
    "updatedAt": "2026-07-28T19:56:42.812Z",
    "teamId": "cmr1xwgdy0000ggkb7xf376sf",

    team: "Core Team",
    status: "Active",
    progress: 42,
    dueDate: "Jul 30",
  },
  {
    id: "2",
    name: "Backend API",
    description: "Build the TeamSync backend API",
    teamId: "core-team-id",
    team: "Core Team",
    status: "Review",
    progress: 83,
    dueDate: "Aug 10",
  },
  {
    id: "3",
    name: "Marketing Website",
    description: "Create the marketing website",
    teamId: "design-team-id",
    team: "Design Team",
    status: "Completed",
    progress: 100,
    dueDate: "Jul 18",
  },
]