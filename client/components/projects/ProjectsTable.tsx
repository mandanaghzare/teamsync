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
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Columns,
  Eye,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { deleteProject } from "@/lib/project-service"
import type { Project } from "@/types/project"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ProjectsTableProps = {
  data: Project[]
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

  return <ArrowUpDown className="size-4 text-muted-foreground" />
}

export default function ProjectsTable({
  data,
}: ProjectsTableProps) {
  const queryClient = useQueryClient()

  const [sorting, setSorting] =
    useState<SortingState>([])

  const [
    projectToDelete,
    setProjectToDelete,
  ] = useState<Project | null>(null)

  const mutation = useMutation({
    mutationFn: deleteProject,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["projects"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ])

      setProjectToDelete(null)

      toast.success(
        "Project deleted successfully"
      )
    },

    onError: () => {
      toast.error(
        "Failed to delete project"
      )
    },
  })

  function handleDeleteProject() {
    if (!projectToDelete) return

    mutation.mutate(projectToDelete.id)
  }

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
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
          Project
          <SortIcon
            direction={column.getIsSorted()}
          />
        </Button>
      ),
    },
    {
      accessorKey: "description",
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
          Description
          <SortIcon
            direction={column.getIsSorted()}
          />
        </Button>
      ),
      cell: ({ row }) =>
        row.original.description || "-",
    },
    {
      accessorKey: "teamId",
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
          Team ID
          <SortIcon
            direction={column.getIsSorted()}
          />
        </Button>
      ),
    },
    {
      accessorKey: "updatedAt",
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
          Updated
          <SortIcon
            direction={column.getIsSorted()}
          />
        </Button>
      ),
      sortingFn: (rowA, rowB) => {
        const firstDate = new Date(
          rowA.original.updatedAt ?? 0
        ).getTime()

        const secondDate = new Date(
          rowB.original.updatedAt ?? 0
        ).getTime()

        return firstDate - secondDate
      },
      cell: ({ row }) => {
        const value =
          row.original.updatedAt

        if (!value) return "-"

        return new Date(
          value
        ).toLocaleDateString()
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const project = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Open actions for ${project.name}`}
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
                      href={`/projects/${project.id}`}
                    />
                  }
                >
                  <Eye className="size-4" />
                  View
                </DropdownMenuItem>

                <DropdownMenuItem
                  render={
                    <Link
                      href={`/projects/${project.id}/tasks`}
                    />
                  }
                >
                  <Columns className="size-4" />
                  Open Board
                </DropdownMenuItem>

                <DropdownMenuItem
                  render={
                    <Link
                      href={`/projects/${project.id}/edit`}
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
                    setProjectToDelete(
                      project
                    )
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
    getCoreRowModel:
      getCoreRowModel(),
    getSortedRowModel:
      getSortedRowModel(),
  })

  return (
    <>
      <Table>
        <TableHeader>
          {table
            .getHeaderGroups()
            .map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
              >
                {headerGroup.headers.map(
                  (header) => (
                    <TableHead
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column
                              .columnDef
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
          {table.getRowModel().rows
            .length > 0 ? (
            table
              .getRowModel()
              .rows.map((row) => (
                <TableRow key={row.id}>
                  {row
                    .getVisibleCells()
                    .map((cell) => (
                      <TableCell
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column
                            .columnDef
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
                colSpan={
                  columns.length
                }
                className="h-32 text-center text-muted-foreground"
              >
                No projects found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {projectToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={() => {
            if (!mutation.isPending) {
              setProjectToDelete(
                null
              )
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            aria-describedby="delete-project-description"
            className="w-full max-w-md rounded-xl border bg-background p-6 shadow-xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="size-5 text-destructive" />
            </div>

            <h2
              id="delete-project-title"
              className="mt-4 text-lg font-semibold"
            >
              Delete project?
            </h2>

            <p
              id="delete-project-description"
              className="mt-2 text-sm text-muted-foreground"
            >
              Are you sure you want to
              delete{" "}
              <span className="font-medium text-foreground">
                “{projectToDelete.name}”
              </span>
              ? All tasks inside this
              project will also be
              deleted. This action
              cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={
                  mutation.isPending
                }
                onClick={() =>
                  setProjectToDelete(
                    null
                  )
                }
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                disabled={
                  mutation.isPending
                }
                onClick={
                  handleDeleteProject
                }
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    Delete project
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