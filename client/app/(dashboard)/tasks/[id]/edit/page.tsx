"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Breadcrumbs } from "@/components/shared/Breadcrumbs"
import { TaskForm } from "@/components/tasks/TaskForm"
import { getTaskById } from "@/lib/task-service"

export default function EditTaskPage() {
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
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !task) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Task not found.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      <Link
        href={`/tasks/${task.id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to task
      </Link>

      <div className="space-y-3">
        <Breadcrumbs
          items={[
            {
              label: "Dashboard",
              href: "/",
            },
            {
              label: "Tasks",
              href: "/tasks",
            },
            {
              label: task.title,
              href: `/tasks/${task.id}`,
            },
            {
              label: "Edit",
            },
          ]}
        />

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit {task.title}
          </h1>

          <p className="mt-2 text-muted-foreground">
            Update the task information.
          </p>
        </div>
      </div>

      <TaskForm task={task} />
    </div>
  )
}