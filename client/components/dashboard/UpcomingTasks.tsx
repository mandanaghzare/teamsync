import Link from "next/link"
import { CalendarClock } from "lucide-react"

import type { DashboardTask } from "@/types/dashboard"

type UpcomingTasksProps = {
  tasks: DashboardTask[]
}

function formatDueDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function UpcomingTasks({
  tasks,
}: UpcomingTasksProps) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">
          Upcoming deadlines
        </h2>

        <p className="text-sm text-muted-foreground">
          Tasks due during the next seven days.
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center">
          <CalendarClock className="mb-3 size-8 text-muted-foreground" />

          <p className="font-medium">
            No upcoming deadlines
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            You have no tasks due this week.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {task.title}
                  </p>

                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {task.project.name}
                  </p>
                </div>

                <span className="shrink-0 text-xs font-medium">
                  {task.dueDate
                    ? formatDueDate(task.dueDate)
                    : "-"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}