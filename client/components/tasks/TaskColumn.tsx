"use client"

import { useDroppable } from "@dnd-kit/core"

import type { Task, TaskStatus } from "@/types/task"
import { cn } from "@/lib/utils"
import { TaskCard } from "@/components/tasks/TaskCard"

type TaskColumnProps = {
  title: string
  status: TaskStatus
  tasks: Task[]
}

export function TaskColumn({
  title,
  status,
  tasks,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: "column",
      status,
    },
  })

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "min-h-[500px] rounded-xl border bg-muted/30 p-3 transition-colors",
        isOver && "border-primary bg-primary/5"
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>

        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="flex h-28 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Drop task here
          </div>
        )}
      </div>
    </section>
  )
}