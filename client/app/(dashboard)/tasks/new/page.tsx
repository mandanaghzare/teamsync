import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Breadcrumbs } from "@/components/shared/Breadcrumbs"
import { TaskForm } from "@/components/tasks/TaskForm"

export default function NewTaskPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/tasks"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tasks
      </Link>

      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Tasks", href: "/tasks" },
            { label: "New Task" },
          ]}
        />

        <h1 className="text-3xl font-bold">
          Create Task
        </h1>

        <p className="text-muted-foreground">
          Add a new task to a project.
        </p>
      </div>

      <TaskForm />
    </div>
  )
}