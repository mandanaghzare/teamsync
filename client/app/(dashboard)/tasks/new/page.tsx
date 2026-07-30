"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Breadcrumbs } from "@/components/shared/Breadcrumbs"
import { TaskForm } from "@/components/tasks/TaskForm"

function NewTaskPageContent() {
  const searchParams = useSearchParams()

  const projectId =
    searchParams.get("projectId") ?? ""

  return (
    <div className="w-full max-w-3xl space-y-6">
      <Link
        href={
          projectId
            ? `/projects/${projectId}/tasks`
            : "/projects"
        }
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Task Board
      </Link>

      <div className="space-y-3">
        <Breadcrumbs
          items={[
            {
              label: "Dashboard",
              href: "/",
            },
            {
              label: "Projects",
              href: "/projects",
            },
            projectId
              ? {
                  label: "Task Board",
                  href: `/projects/${projectId}/tasks`,
                }
              : {
                  label: "Tasks",
                  href: "/tasks",
                },
            {
              label: "New Task",
            },
          ]}
        />

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Task
          </h1>

          <p className="mt-2 text-muted-foreground">
            Add a new task to a project.
          </p>
        </div>
      </div>

      <TaskForm
        defaultProjectId={
          projectId || undefined
        }
      />
    </div>
  )
}

function NewTaskPageFallback() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}

export default function NewTaskPage() {
  return (
    <Suspense fallback={<NewTaskPageFallback />}>
      <NewTaskPageContent />
    </Suspense>
  )
}