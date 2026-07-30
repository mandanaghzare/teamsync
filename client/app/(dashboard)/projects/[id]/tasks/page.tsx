"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  AlertCircle,
  Plus,
  Search,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Breadcrumbs } from "@/components/shared/Breadcrumbs"
import { TaskBoard } from "@/components/tasks/TaskBoard"
import { getTasksByProject } from "@/lib/task-service"
import type { Task } from "@/types/task"

function TaskCardSkeleton() {
  return (
    <div className="rounded-lg border bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="size-4 animate-pulse rounded bg-muted" />
      </div>

      <div className="mt-3 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>

      <div className="mt-4 flex items-center gap-2 border-t pt-3">
        <div className="size-7 animate-pulse rounded-full bg-muted" />

        <div className="space-y-1">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-2.5 w-14 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

function TaskBoardSkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {Array.from({ length: 3 }).map(
        (_, columnIndex) => (
          <section
            key={columnIndex}
            className="min-h-[500px] rounded-xl border bg-muted/30 p-3"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="h-5 w-28 animate-pulse rounded bg-muted" />
              <div className="h-5 w-7 animate-pulse rounded-full bg-muted" />
            </div>

            <div className="space-y-3">
              {Array.from({
                length:
                  columnIndex === 1 ? 1 : 2,
              }).map((_, taskIndex) => (
                <TaskCardSkeleton
                  key={taskIndex}
                />
              ))}
            </div>
          </section>
        )
      )}
    </div>
  )
}

export default function ProjectTasksPage() {
  const params = useParams()
  const projectId = params.id as string

  const [searchQuery, setSearchQuery] =
    useState("")

  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<Task[]>({
    queryKey: ["tasks", projectId],
    queryFn: () =>
      getTasksByProject(projectId),
    enabled: Boolean(projectId),
  })

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase()

    if (!normalizedQuery) {
      return tasks
    }

    return tasks.filter((task) => {
      const title =
        task.title?.toLowerCase() ?? ""

      const description =
        task.description?.toLowerCase() ??
        ""

      const assigneeName =
        task.assignee?.name?.toLowerCase() ??
        ""

      const priority =
        task.priority?.toLowerCase() ?? ""

      const status =
        task.status?.toLowerCase() ?? ""

      return (
        title.includes(normalizedQuery) ||
        description.includes(
          normalizedQuery
        ) ||
        assigneeName.includes(
          normalizedQuery
        ) ||
        priority.includes(normalizedQuery) ||
        status.includes(normalizedQuery)
      )
    })
  }, [tasks, searchQuery])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
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
              {
                label: "Task Board",
              },
            ]}
          />

          <h1 className="text-3xl font-bold">
            Task Board
          </h1>

          <p className="text-muted-foreground">
            Drag and drop tasks between
            columns to update their status.
          </p>
        </div>

        <Button
          nativeButton={false}
          render={
            <Link
              href={`/tasks/new?projectId=${projectId}`}
            />
          }
        >
          <Plus className="size-4" />
          New task
        </Button>
      </div>

      {!isLoading && !isError && (
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }
            placeholder="Search tasks..."
            className="pl-9"
            aria-label="Search tasks"
          />
        </div>
      )}

      {isLoading ? (
        <TaskBoardSkeleton />
      ) : isError ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>

          <h2 className="mt-4 font-semibold">
            Failed to load tasks
          </h2>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Something went wrong while
            loading this task board.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            disabled={isFetching}
            onClick={() => refetch()}
          >
            {isFetching
              ? "Trying again..."
              : "Try again"}
          </Button>
        </div>
      ) : (
        <>
          <TaskBoard
            tasks={filteredTasks}
          />

          {searchQuery.trim() &&
            filteredTasks.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                No tasks match &quot;
                {searchQuery.trim()}&quot;.
              </p>
            )}
        </>
      )}
    </div>
  )
}