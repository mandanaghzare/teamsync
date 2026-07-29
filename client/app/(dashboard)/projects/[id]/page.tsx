"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Pencil } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/shared/Breadcrumbs"
import { ProjectInfo } from "@/components/projects/ProjectInfo"
import { getProjectById } from "@/lib/project-service"

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>()
  const projectId = params.id

  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    enabled: Boolean(projectId),
  })

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        Loading...
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="flex h-40 items-center justify-center">
        Project not found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Projects
        </Link>

        <Button
          nativeButton={false}
          render={<Link href={`/projects/${project.id}/edit`} />}
        >
          <Pencil className="size-4" />
          Edit project
        </Button>
      </div>

      <div className="space-y-2">
        <Breadcrumbs
          items={[
            {
              label: "Dashboard",
              href: "/",
            },
            {
              label: "Projects",
              href: "/projects",
            },
            {
              label: project.name,
            },
          ]}
        />

        <h1 className="text-3xl font-bold">
          {project.name}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ProjectInfo
          label="Description"
          value={project.description}
        />

        <ProjectInfo
          label="Team ID"
          value={project.teamId}
        />

        <ProjectInfo
          label="Created"
          value={new Date(
            project.createdAt
          ).toLocaleDateString()}
        />

        <ProjectInfo
          label="Last updated"
          value={new Date(
            project.updatedAt
          ).toLocaleDateString()}
        />
      </div>
    </div>
  )
}