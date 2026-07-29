"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/shared/Breadcrumbs"
import { TaskBoard } from "@/components/tasks/TaskBoard"
import { getTasksByProject } from "@/lib/task-service"

const PROJECT_ID = "cms60azlq0001cwkbi51zg340"

export default function TasksPage() {
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks", PROJECT_ID],
    queryFn: () => getTasksByProject(PROJECT_ID),
  })

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        Loading tasks...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-40 items-center justify-center text-destructive">
        Failed to load tasks.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
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

          <h1 className="text-3xl font-bold">Task Board</h1>

          <p className="text-muted-foreground">
            Drag and drop tasks between columns to update their status.
          </p>
        </div>

        <Button
          nativeButton={false}
          render={
            <Link
              href={`/tasks/new?projectId=${"cms60azlq0001cwkbi51zg340"}`}
            />
          }
        >
          <Plus className="size-4" />
          New task
        </Button>
      </div>

      <TaskBoard tasks={tasks} />
    </div>
  )
}