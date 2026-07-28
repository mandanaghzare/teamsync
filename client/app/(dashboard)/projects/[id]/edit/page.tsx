import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Breadcrumbs } from "@/components/shared/Breadcrumbs"
import { projects } from "@/data/projects"
import { ProjectForm } from "@/components/projects/ProjectForm"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params

  const project = projects.find(
    (project) => project.id === id
  )

  if (!project) {
    return <div>Project not found.</div>
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