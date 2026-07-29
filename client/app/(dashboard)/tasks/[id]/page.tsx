"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Pencil } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/shared/Breadcrumbs"
import { ProjectInfo } from "@/components/projects/ProjectInfo"
import { getTaskById } from "@/lib/task-service"

export default function TaskDetailsPage() {
  const params = useParams<{ id: string }>()
  const taskId = params.id

  const {
    data: task,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById(taskId),
    enabled: Boolean(taskId),
  })

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        Loading...
      </div>
    )
  }

  if (isError || !task) {
    return (
      <div className="flex h-40 items-center justify-center">
        Task not found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Tasks
        </Link>

        <Button
          nativeButton={false}
          render={<Link href={`/tasks/${task.id}/edit`} />}
        >
          <Pencil className="size-4" />
          Edit task
        </Button>
      </div>

      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Tasks", href: "/tasks" },
            { label: task.title },
          ]}
        />

        <h1 className="text-3xl font-bold">
          {task.title}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ProjectInfo
          label="Description"
          value={task.description}
        />

        <ProjectInfo
          label="Status"
          value={task.status.replace("_", " ")}
        />

        <ProjectInfo
          label="Priority"
          value={task.priority}
        />

        <ProjectInfo
          label="Due date"
          value={
            task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "-"
          }
        />

        <ProjectInfo
          label="Project ID"
          value={task.projectId}
        />

        <ProjectInfo
          label="Assignee"
          value={task.assigneeId ?? "Unassigned"}
        />
      </div>
    </div>
  )
}