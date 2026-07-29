"use client"

import Link from "next/link"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Eye,
  MoreHorizontal,
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

export default function TasksTable({
  data,
}: TasksTableProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteTask,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      })

      toast.success("Task deleted successfully")
    },

    onError: () => {
      toast.error("Failed to delete task")
    },
  })

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "title",
      header: "Task",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.status.replace("_", " "),
    },
    {
      accessorKey: "priority",
      header: "Priority",
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const dueDate = row.original.dueDate

        return dueDate
          ? new Date(dueDate).toLocaleDateString()
          : "-"
      },
    },
    {
      accessorKey: "assigneeId",
      header: "Assignee",
      cell: ({ row }) =>
        row.original.assigneeId ?? "Unassigned",
    },
    {
      id: "actions",
      header: "Actions",
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
                    <Link href={`/tasks/${task.id}`} />
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
                  disabled={deleteMutation.isPending}
                  onClick={() =>
                    deleteMutation.mutate(task.id)
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
    getCoreRowModel: getCoreRowModel(),
  })

  return (
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
                            header.column.columnDef
                              .header,
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
  )
}