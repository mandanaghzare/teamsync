"use client"

import Link from "next/link"
import { CalendarDays, GripVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import type { Task } from "@/types/task"
import { cn } from "@/lib/utils"

type TaskCardProps = {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border bg-background p-4 shadow-sm transition",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/tasks/${task.id}`}
          className="font-medium hover:underline"
        >
          {task.title}
        </Link>

        <button
          type="button"
          className="cursor-grab text-muted-foreground active:cursor-grabbing"
          aria-label={`Move ${task.title}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </div>

      {task.description && (
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {task.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-2">
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            task.priority === "HIGH" &&
              "bg-red-500/10 text-red-600 dark:text-red-400",
            task.priority === "MEDIUM" &&
              "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            task.priority === "LOW" &&
              "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          )}
        >
          {task.priority}
        </span>

        {task.dueDate && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </article>
  )
}