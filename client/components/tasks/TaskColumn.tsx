"use client"

import {
  CircleCheckBig,
  ClipboardList,
  ListTodo,
} from "lucide-react"
import { useDroppable } from "@dnd-kit/core"

import type {
  Task,
  TaskStatus,
} from "@/types/task"
import { cn } from "@/lib/utils"
import { TaskCard } from "@/components/tasks/TaskCard"

type TaskColumnProps = {
  title: string
  status: TaskStatus
  tasks: Task[]
}

const emptyStateContent: Record<
  TaskStatus,
  {
    title: string
    description: string
    icon: typeof ClipboardList
  }
> = {
  TODO: {
    title: "No tasks yet",
    description:
      "Create a new task or drag one here.",
    icon: ListTodo,
  },

  IN_PROGRESS: {
    title: "Nothing in progress",
    description:
      "Drag a task here when work begins.",
    icon: ClipboardList,
  },

  DONE: {
    title: "Nothing completed yet",
    description:
      "Finished tasks will appear here.",
    icon: CircleCheckBig,
  },
}

export function TaskColumn({
  title,
  status,
  tasks,
}: TaskColumnProps) {
  const { setNodeRef, isOver } =
    useDroppable({
      id: status,
      data: {
        type: "column",
        status,
      },
    })

  const emptyState =
    emptyStateContent[status]

  const EmptyStateIcon =
    emptyState.icon

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "min-h-[240px] rounded-xl border bg-muted/30 p-3 transition-colors duration-200",
        isOver &&
          "border-primary bg-primary/5 ring-2 ring-primary/10"
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">
          {title}
        </h2>

        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
          />
        ))}

        {tasks.length === 0 && (
          <div
            className={cn(
              "flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center transition-colors",
              isOver &&
                "border-primary bg-primary/5"
            )}
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
              <EmptyStateIcon className="size-5 text-muted-foreground" />
            </div>

            <p className="text-sm font-medium">
              {emptyState.title}
            </p>

            <p className="mt-1 max-w-48 text-xs leading-5 text-muted-foreground">
              {emptyState.description}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}