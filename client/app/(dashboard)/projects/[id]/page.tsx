import { ProjectInfo } from "@/components/projects/ProjectInfo"
import { projects } from "@/data/projects"
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
            <h1 className="text-3xl font-bold">
                Projects / {project.name}
            </h1>

            <div className="space-y-2">
            <div className="grid gap-4 md:grid-cols-2">
                <ProjectInfo
                    label="Team"
                    value={project.team}
                />

                <ProjectInfo
                    label="Status"
                    value={project.status}
                />

                <ProjectInfo
                    label="Progress"
                    value={`${project.progress}%`}
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