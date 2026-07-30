"use client"

import {
  useEffect,
  useState,
} from "react"
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

import type {
  Task,
  TaskStatus,
} from "@/types/task"
import { reorderTasks } from "@/lib/task-service"
import { TaskColumn } from "@/components/tasks/TaskColumn"
import { TaskCard } from "@/components/tasks/TaskCard"

type TaskBoardProps = {
  tasks: Task[]
}

const columns: {
  title: string
  status: TaskStatus
}[] = [
  {
    title: "To Do",
    status: "TODO",
  },
  {
    title: "In Progress",
    status: "IN_PROGRESS",
  },
  {
    title: "Done",
    status: "DONE",
  },
]

function sortTasks(tasks: Task[]) {
  return [...tasks].sort(
    (a, b) => a.order - b.order
  )
}

function normalizeColumnOrder(
  allTasks: Task[],
  status: TaskStatus,
  columnTasks: Task[]
) {
  const normalizedTasks =
    columnTasks.map((task, index) => ({
      ...task,
      status,
      order: index,
    }))

  const normalizedMap = new Map(
    normalizedTasks.map((task) => [
      task.id,
      task,
    ])
  )

  return allTasks.map(
    (task) =>
      normalizedMap.get(task.id) ?? task
  )
}

export function TaskBoard({
  tasks,
}: TaskBoardProps) {
  const queryClient = useQueryClient()

  const [boardTasks, setBoardTasks] =
    useState<Task[]>(() =>
      sortTasks(tasks)
    )

  const [activeTask, setActiveTask] =
    useState<Task | null>(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setBoardTasks(sortTasks(tasks))

      setActiveTask((currentTask) => {
        if (!currentTask) {
          return null
        }

        const taskStillExists = tasks.some(
          (task) => task.id === currentTask.id
        )

        return taskStillExists ? currentTask : null
      })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [tasks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const reorderMutation = useMutation({
    mutationFn: (updatedTasks: Task[]) =>
      reorderTasks(
        updatedTasks.map((task) => ({
          id: task.id,
          status: task.status,
          order: task.order,
        }))
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      })

      toast.success(
        "Task order updated successfully"
      )
    },

    onError: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      })

      toast.error(
        "Failed to update task order"
      )
    },
  })

  function handleDragStart(
    event: DragStartEvent
  ) {
    const task = boardTasks.find(
      (item) =>
        item.id ===
        String(event.active.id)
    )

    setActiveTask(task ?? null)
  }

  function handleDragEnd(
    event: DragEndEvent
  ) {
    const { active, over } = event

    setActiveTask(null)

    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    const movedTask = boardTasks.find(
      (task) => task.id === activeId
    )

    if (!movedTask) return

    const overTask = boardTasks.find(
      (task) => task.id === overId
    )

    const destinationStatus =
      overTask?.status ??
      (over.data.current?.status as
        | TaskStatus
        | undefined)

    if (!destinationStatus) return

    let updatedTasks = [...boardTasks]

    if (
      movedTask.status ===
      destinationStatus
    ) {
      if (
        !overTask ||
        activeId === overId
      ) {
        return
      }

      const columnTasks = sortTasks(
        boardTasks.filter(
          (task) =>
            task.status ===
            movedTask.status
        )
      )

      const oldIndex =
        columnTasks.findIndex(
          (task) =>
            task.id === activeId
        )

      const newIndex =
        columnTasks.findIndex(
          (task) =>
            task.id === overId
        )

      if (
        oldIndex === -1 ||
        newIndex === -1
      ) {
        return
      }

      const reorderedColumn =
        arrayMove(
          columnTasks,
          oldIndex,
          newIndex
        )

      updatedTasks =
        normalizeColumnOrder(
          updatedTasks,
          movedTask.status,
          reorderedColumn
        )
    } else {
      const sourceStatus =
        movedTask.status

      const sourceColumn = sortTasks(
        boardTasks.filter(
          (task) =>
            task.status ===
              sourceStatus &&
            task.id !== activeId
        )
      )

      const destinationColumn =
        sortTasks(
          boardTasks.filter(
            (task) =>
              task.status ===
              destinationStatus
          )
        )

      const destinationIndex =
        overTask
          ? destinationColumn.findIndex(
              (task) =>
                task.id ===
                overTask.id
            )
          : destinationColumn.length

      const movedTaskWithNewStatus: Task =
        {
          ...movedTask,
          status: destinationStatus,
        }

      destinationColumn.splice(
        destinationIndex === -1
          ? destinationColumn.length
          : destinationIndex,
        0,
        movedTaskWithNewStatus
      )

      updatedTasks =
        updatedTasks.map((task) =>
          task.id === activeId
            ? movedTaskWithNewStatus
            : task
        )

      updatedTasks =
        normalizeColumnOrder(
          updatedTasks,
          sourceStatus,
          sourceColumn
        )

      updatedTasks =
        normalizeColumnOrder(
          updatedTasks,
          destinationStatus,
          destinationColumn
        )
    }

    updatedTasks =
      sortTasks(updatedTasks)

    setBoardTasks(updatedTasks)
    reorderMutation.mutate(
      updatedTasks
    )
  }

  function handleDragCancel() {
    setActiveTask(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={
        closestCorners
      }
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid items-start gap-4 xl:grid-cols-3">
        {columns.map((column) => {
          const columnTasks =
            sortTasks(
              boardTasks.filter(
                (task) =>
                  task.status ===
                  column.status
              )
            )

          return (
            <SortableContext
              key={column.status}
              items={columnTasks.map(
                (task) => task.id
              )}
              strategy={
                verticalListSortingStrategy
              }
            >
              <TaskColumn
                title={column.title}
                status={column.status}
                tasks={columnTasks}
              />
            </SortableContext>
          )
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="w-80 rotate-1 opacity-95">
            <TaskCard
              task={activeTask}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}