import { ProjectInfo } from "@/components/projects/ProjectInfo"
import { ProjectProgress } from "@/components/projects/ProjectProgress"
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge"
import { Breadcrumbs } from "@/components/shared/Breadcrumbs"
import { projects } from "@/data/projects"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectDetailsPage({ params }: Props) {
    const { id } = await params
    const project = projects.find(
        (project) => project.id === Number(id)
    )
    if (!project) {
        return <div>Project not found.</div>
    }
    return (
        <div className="space-y-6">
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
            </Link>
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

            <div className="space-y-2">
            <div className="grid gap-4 md:grid-cols-2">
                <ProjectInfo
                    label="Team"
                    value={project.team}
                />

                <ProjectInfo
                    label="Status"
                    value={
                        <ProjectStatusBadge
                        status={project.status}
                        />
                    }
                    />

                <ProjectInfo
                    label="Progress"
                    value={
                        <ProjectProgress value={project.progress} />
                    }
                />

                <ProjectInfo
                    label="Due Date"
                    value={project.dueDate}
                />
            </div>
            </div>
        </div>
        )
}