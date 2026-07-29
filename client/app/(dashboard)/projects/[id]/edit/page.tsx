"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Breadcrumbs } from "@/components/shared/Breadcrumbs"
import { ProjectForm } from "@/components/projects/ProjectForm"
import { getProjectById } from "@/lib/project-service"

export default function EditProjectPage() {
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
      <Link
        href={`/projects/${project.id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Project
      </Link>

      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Projects", href: "/projects" },
            {
              label: project.name,
              href: `/projects/${project.id}`,
            },
            { label: "Edit" },
          ]}
        />

        <h1 className="text-3xl font-bold">
          Edit {project.name}
        </h1>

        <p className="text-muted-foreground">
          Update the project information.
        </p>
      </div>

      <ProjectForm project={project} />
    </div>
  )
}