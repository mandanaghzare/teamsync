"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react"
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

import type { Task } from "@/types/task"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type TasksTableProps = {
  data: Task[]
}

function SortIcon({
  direction,
}: {
  direction: false | "asc" | "desc"
}) {
  if (direction === "asc") {
    return <ArrowUp className="size-4" />
  }

  if (direction === "desc") {
    return <ArrowDown className="size-4" />
  }

  return (
    <ArrowUpDown className="size-4 text-muted-foreground" />
  )
}

export default function TasksTable({
  data,
}: TasksTableProps) {
  const queryClient = useQueryClient()

  const [sorting, setSorting] =
    useState<SortingState>([])

  const [taskToDelete, setTaskToDelete] =
    useState<Task | null>(null)

  const deleteMutation = useMutation({
    mutationFn: deleteTask,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ])

      setTaskToDelete(null)

      toast.success(
        "Task deleted successfully"
      )
    },

    onError: () => {
      toast.error("Failed to delete task")
    },
  })

  function handleConfirmDelete() {
    if (!taskToDelete) return

    deleteMutation.mutate(taskToDelete.id)
  }

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          className="-ml-3 h-8 gap-2"
          onClick={() =>
            column.toggleSorting(
              column.getIsSorted() === "asc"
            )
          }
        >
          Task
          <SortIcon
            direction={column.getIsSorted()}
          />
        </Button>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          className="-ml-3 h-8 gap-2"
          onClick={() =>
            column.toggleSorting(
              column.getIsSorted() === "asc"
            )
          }
        >
          Status
          <SortIcon
            direction={column.getIsSorted()}
          />
        </Button>
      ),
      cell: ({ row }) =>
        row.original.status.replace("_", " "),
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          className="-ml-3 h-8 gap-2"
          onClick={() =>
            column.toggleSorting(
              column.getIsSorted() === "asc"
            )
          }
        >
          Priority
          <SortIcon
            direction={column.getIsSorted()}
          />
        </Button>
      ),
      sortingFn: (rowA, rowB) => {
        const priorityOrder = {
          LOW: 1,
          MEDIUM: 2,
          HIGH: 3,
        }

        const firstPriority =
          priorityOrder[
            rowA.original
              .priority as keyof typeof priorityOrder
          ] ?? 0

        const secondPriority =
          priorityOrder[
            rowB.original
              .priority as keyof typeof priorityOrder
          ] ?? 0

        return firstPriority - secondPriority
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          className="-ml-3 h-8 gap-2"
          onClick={() =>
            column.toggleSorting(
              column.getIsSorted() === "asc"
            )
          }
        >
          Due Date
          <SortIcon
            direction={column.getIsSorted()}
          />
        </Button>
      ),
      sortingFn: (rowA, rowB) => {
        const firstDate = rowA.original.dueDate
          ? new Date(
              rowA.original.dueDate
            ).getTime()
          : Number.MAX_SAFE_INTEGER

        const secondDate = rowB.original.dueDate
          ? new Date(
              rowB.original.dueDate
            ).getTime()
          : Number.MAX_SAFE_INTEGER

        return firstDate - secondDate
      },
      cell: ({ row }) => {
        const dueDate = row.original.dueDate

        return dueDate
          ? new Date(
              dueDate
            ).toLocaleDateString()
          : "-"
      },
    },
    {
      id: "assignee",
      accessorFn: (task) =>
        task.assignee?.name ?? "Unassigned",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          className="-ml-3 h-8 gap-2"
          onClick={() =>
            column.toggleSorting(
              column.getIsSorted() === "asc"
            )
          }
        >
          Assignee
          <SortIcon
            direction={column.getIsSorted()}
          />
        </Button>
      ),
      cell: ({ row }) =>
        row.original.assignee?.name ??
        "Unassigned",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const task = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
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
                    setTaskToDelete(task)
                  }
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table
              .getHeaderGroups()
              .map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column
                                .columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  )}
                </TableRow>
              ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table
                .getRowModel()
                .rows.map((row) => (
                  <TableRow key={row.id}>
                    {row
                      .getVisibleCells()
                      .map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef
                              .cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {taskToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={() => {
            if (!deleteMutation.isPending) {
              setTaskToDelete(null)
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
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                “{taskToDelete.title}”
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={
                  deleteMutation.isPending
                }
                onClick={() =>
                  setTaskToDelete(null)
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
                onClick={handleConfirmDelete}
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