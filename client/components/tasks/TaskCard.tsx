"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  Eye,
  GripVertical,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

import type { Task } from "@/types/task"
import { cn } from "@/lib/utils"
import { deleteTask } from "@/lib/task-service"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type TaskCardProps = {
  task: Task
}

export function TaskCard({
  task,
}: TaskCardProps) {
  const queryClient = useQueryClient()

  const [
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  ] = useState(false)

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

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task.id),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ])

      setIsDeleteDialogOpen(false)

      toast.success(
        "Task deleted successfully"
      )
    },

    onError: () => {
      toast.error(
        "Failed to delete task"
      )
    },
  })

  const style = {
    transform:
      CSS.Transform.toString(transform),
    transition,
  }

  const assigneeInitial =
    task.assignee?.name
      ?.trim()
      .charAt(0)
      .toUpperCase() ?? ""

  return (
    <>
      <article
        ref={setNodeRef}
        style={style}
        className={cn(
          "rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
          isDragging &&
            "opacity-50 shadow-lg"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/tasks/${task.id}`}
            className="min-w-0 flex-1 truncate font-medium hover:underline"
          >
            {task.title}
          </Link>

          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-label={`Open actions for ${task.title}`}
                  />
                }
              >
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-40"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    Actions
                  </DropdownMenuLabel>

                  <DropdownMenuItem
                    render={
                      <Link
                        href={`/tasks/${task.id}`}
                      />
                    }
                  >
                    <Eye className="size-4" />
                    View
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    render={
                      <Link
                        href={`/tasks/${task.id}/edit`}
                      />
                    }
                  >
                    <Pencil className="size-4" />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() =>
                      setIsDeleteDialogOpen(
                        true
                      )
                    }
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

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
            {task.priority.charAt(0) +
              task.priority.slice(1).toLowerCase()}
          </span>

          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />

              {new Date(task.dueDate).toLocaleDateString(
                undefined,
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center border-t pt-3">
          {task.assignee ? (
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                {assigneeInitial}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-medium">
                  {task.assignee.name}
                </p>

                <p className="truncate text-[11px] text-muted-foreground">
                  Assignee
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex size-7 items-center justify-center rounded-full border border-dashed">
                <UserRound className="size-3.5" />
              </div>

              <span>Unassigned</span>
            </div>
          )}
        </div>
      </article>

      {isDeleteDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={() => {
            if (!deleteMutation.isPending) {
              setIsDeleteDialogOpen(false)
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-task-title"
            aria-describedby="delete-task-description"
            className="w-full max-w-md rounded-xl border bg-background p-6 shadow-xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="size-5 text-destructive" />
            </div>

            <h2
              id="delete-task-title"
              className="mt-4 text-lg font-semibold"
            >
              Delete task?
            </h2>

            <p
              id="delete-task-description"
              className="mt-2 text-sm leading-6 text-muted-foreground"
            >
              Are you sure you want to
              delete{" "}
              <span className="font-medium text-foreground">
                “{task.title}”
              </span>
              ? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={
                  deleteMutation.isPending
                }
                onClick={() =>
                  setIsDeleteDialogOpen(
                    false
                  )
                }
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                disabled={
                  deleteMutation.isPending
                }
                onClick={() =>
                  deleteMutation.mutate()
                }
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    Delete task
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}