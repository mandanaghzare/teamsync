import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  FolderKanban,
  ListTodo,
  LoaderCircle,
} from "lucide-react"

import type { DashboardStats as DashboardStatsType } from "@/types/dashboard"

type DashboardStatsProps = {
  stats: DashboardStatsType
}

const statItems = [
  {
    key: "projects",
    label: "Projects",
    icon: FolderKanban,
  },
  {
    key: "tasks",
    label: "Tasks",
    icon: ListTodo,
  },
  {
    key: "todo",
    label: "To Do",
    icon: CircleDashed,
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: LoaderCircle,
  },
  {
    key: "done",
    label: "Completed",
    icon: CheckCircle2,
  },
  {
    key: "overdue",
    label: "Overdue",
    icon: AlertTriangle,
  },
] as const

export function DashboardStats({
  stats,
}: DashboardStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {statItems.map((item) => {
        const Icon = item.icon

        return (
          <article
            key={item.key}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {item.label}
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {stats[item.key]}
                </p>
              </div>

              <div className="rounded-lg bg-muted p-3">
                <Icon className="size-5" />
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}