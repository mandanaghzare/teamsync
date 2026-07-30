"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Loader2, Search } from "lucide-react"

import type { Task } from "@/types/task"
import { getAllTasks } from "@/lib/task-service"

import { Breadcrumbs } from "@/components/shared/Breadcrumbs"
import TasksTable from "@/components/tasks/TasksTable"
import { Input } from "@/components/ui/input"

export default function TasksPage() {
  const [search, setSearch] = useState("")

  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getAllTasks,
  })

  const filteredTasks = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase()

    if (!query) {
      return tasks
    }

    return tasks.filter((task) => {
      return (
        task.title
          .toLowerCase()
          .includes(query) ||
        task.description
          ?.toLowerCase()
          .includes(query) ||
        task.status
          .toLowerCase()
          .includes(query) ||
        task.priority
          .toLowerCase()
          .includes(query) ||
        task.assignee?.name
          ?.toLowerCase()
          .includes(query)
      )
    })
  }, [search, tasks])

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            {
              label: "Dashboard",
              href: "/",
            },
            {
              label: "Tasks",
            },
          ]}
        />

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            All Tasks
          </h1>

          <p className="mt-2 text-muted-foreground">
            View and manage tasks from all
            your projects.
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search tasks..."
          className="pl-9"
        />
      </div>

      {isLoading && (
        <div className="flex min-h-64 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {isError && (
        <div className="flex min-h-64 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-destructive">
          Failed to load tasks.
        </div>
      )}

      {!isLoading && !isError && (
        <TasksTable data={filteredTasks} />
      )}
    </div>
  )
}