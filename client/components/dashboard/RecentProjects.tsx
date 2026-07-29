import Link from "next/link"
import { ArrowRight, FolderKanban } from "lucide-react"

import type { DashboardProject } from "@/types/dashboard"

type RecentProjectsProps = {
  projects: DashboardProject[]
}

export function RecentProjects({
  projects,
}: RecentProjectsProps) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            Recent projects
          </h2>

          <p className="text-sm text-muted-foreground">
            Your latest team projects.
          </p>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center">
          <FolderKanban className="mb-3 size-8 text-muted-foreground" />

          <p className="font-medium">No projects yet</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Create your first project to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate font-medium">
                    {project.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {project.description || "No description"}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs">
                  {project._count.tasks} tasks
                </span>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                {project.team.name}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}