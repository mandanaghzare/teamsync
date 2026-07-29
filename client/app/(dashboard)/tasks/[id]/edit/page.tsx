"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
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
      <Link
        href={`/tasks/${task.id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Task
      </Link>

      <div className="space-y-2">
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

        <h1 className="text-3xl font-bold">
          Edit {task.title}
        </h1>

        <p className="text-muted-foreground">
          Update the task information.
        </p>
      </div>

      <TaskForm task={task} />
    </div>
  )
}