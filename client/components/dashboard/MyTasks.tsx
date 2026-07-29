import Link from "next/link"
import { ArrowRight, ClipboardCheck } from "lucide-react"

import type { DashboardTask } from "@/types/dashboard"
import { cn } from "@/lib/utils"

type MyTasksProps = {
  tasks: DashboardTask[]
}

export function MyTasks({ tasks }: MyTasksProps) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">My tasks</h2>

          <p className="text-sm text-muted-foreground">
            Tasks currently assigned to you.
          </p>
        </div>

        <Link
          href="/tasks"
          className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          View board
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center">
          <ClipboardCheck className="mb-3 size-8 text-muted-foreground" />

          <p className="font-medium">No assigned tasks</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Tasks assigned to you will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {task.title}
                </p>

                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {task.project.name}
                </p>
              </div>

              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-1 text-xs font-medium",
                  task.priority === "HIGH" &&
                    "bg-red-500/10 text-red-600 dark:text-red-400",
                  task.priority === "MEDIUM" &&
                    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                  task.priority === "LOW" &&
                    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                )}
              >
                {task.priority}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}