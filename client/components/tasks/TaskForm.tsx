"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Controller,
  useForm,
  useWatch,
} from "react-hook-form"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

import {
  createTask,
  updateTask,
} from "@/lib/task-service"
import {
  getProjectById,
  getProjects,
} from "@/lib/project-service"
import {
  getMyTeams,
  getTeamMembers,
} from "@/lib/team-service"
import {
  taskSchema,
  type TaskFormValues,
} from "@/lib/task-schema"

import type { Task } from "@/types/task"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type TaskFormProps = {
  task?: Task
  defaultProjectId?: string
}

type ProjectOption = {
  id: string
  name: string
  teamId: string
}

export function TaskForm({
  task,
  defaultProjectId,
}: TaskFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const isEditMode = Boolean(task)

  const [selectedTeamId, setSelectedTeamId] =
    useState("")

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    mode: "onBlur",
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "TODO",
      priority: task?.priority ?? "MEDIUM",
      dueDate: task?.dueDate
        ? task.dueDate.slice(0, 10)
        : "",
      projectId:
        task?.projectId ??
        defaultProjectId ??
        "",
      assigneeId: task?.assigneeId ?? "",
    },
  })

  const selectedProjectId = useWatch({
    control: form.control,
    name: "projectId",
  })

  const {
    data: teams = [],
    isLoading: areTeamsLoading,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: getMyTeams,
  })

  const {
    data: currentProject,
    isLoading: isCurrentProjectLoading,
  } = useQuery({
    queryKey: [
      "project",
      selectedProjectId,
    ],
    queryFn: () =>
      getProjectById(selectedProjectId),
    enabled: Boolean(
      selectedProjectId &&
      (isEditMode || defaultProjectId)
    ),
  })

  const effectiveTeamId =
    selectedTeamId ||
    currentProject?.teamId ||
    ""

  const {
    data: projects = [],
    isLoading: areProjectsLoading,
  } = useQuery<ProjectOption[]>({
    queryKey: [
      "projects",
      effectiveTeamId,
    ],
    queryFn: () =>
      getProjects(effectiveTeamId),
    enabled: Boolean(effectiveTeamId),
  })

  const {
    data: members = [],
    isLoading: areMembersLoading,
  } = useQuery({
    queryKey: [
      "team-members",
      effectiveTeamId,
    ],
    queryFn: () =>
      getTeamMembers(effectiveTeamId),
    enabled: Boolean(
      effectiveTeamId &&
      selectedProjectId
    ),
  })

  const mutation = useMutation({
    mutationFn: (data: TaskFormValues) => {
      if (task) {
        return updateTask(task.id, data)
      }

      return createTask(data)
    },

    onSuccess: async (_result, data) => {
      const queries = [
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]

      if (task?.id) {
        queries.push(
          queryClient.invalidateQueries({
            queryKey: ["task", task.id],
          })
        )
      }

      await Promise.all(queries)

      toast.success(
        task
          ? "Task updated successfully"
          : "Task created successfully"
      )

      const destinationProjectId =
        data.projectId ?? task?.projectId

      router.push(
        destinationProjectId
          ? `/projects/${destinationProjectId}/tasks`
          : "/projects"
      )

      router.refresh()
    },

    onError: () => {
      toast.error(
        task
          ? "Failed to update task"
          : "Failed to create task"
      )
    },
  })

  function handleTeamChange(teamId: string) {
    setSelectedTeamId(teamId)

    form.setValue("projectId", "", {
      shouldValidate: true,
    })

    form.setValue("assigneeId", "", {
      shouldValidate: true,
    })
  }

  function handleProjectChange(projectId: string) {
    form.setValue("projectId", projectId, {
      shouldValidate: true,
      shouldDirty: true,
    })

    form.setValue("assigneeId", "", {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  function onSubmit(data: TaskFormValues) {
    mutation.mutate({
      ...data,
      assigneeId:
        data.assigneeId || undefined,
      dueDate:
        data.dueDate || undefined,
    })
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full rounded-xl border bg-card p-6 shadow-sm"
      noValidate
    >
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Task title
              </FieldLabel>

              <Input
                {...field}
                id={field.name}
                placeholder="Enter task title"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Description
              </FieldLabel>

              <Textarea
                {...field}
                id={field.name}
                placeholder="Write a task description"
                className="min-h-24"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Status
              </FieldLabel>

              <select
                {...field}
                id={field.name}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                aria-invalid={fieldState.invalid}
              >
                <option value="TODO">
                  Todo
                </option>

                <option value="IN_PROGRESS">
                  In progress
                </option>

                <option value="DONE">
                  Done
                </option>
              </select>

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <Controller
          name="priority"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Priority
              </FieldLabel>

              <select
                {...field}
                id={field.name}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                aria-invalid={fieldState.invalid}
              >
                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>
              </select>

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <Controller
          name="dueDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Due date
              </FieldLabel>

              <Input
                {...field}
                id={field.name}
                type="date"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <Field>
          <FieldLabel htmlFor="teamId">
            Team
          </FieldLabel>

          <select
            id="teamId"
            value={effectiveTeamId}
            onChange={(event) =>
              handleTeamChange(
                event.target.value
              )
            }
            disabled={
              areTeamsLoading ||
              isCurrentProjectLoading ||
              isEditMode
            }
            className="h-9 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {areTeamsLoading
                ? "Loading teams..."
                : "Select a team"}
            </option>

            {teams.map((membership) => (
              <option
                key={membership.team.id}
                value={membership.team.id}
              >
                {membership.team.name} (
                {membership.role})
              </option>
            ))}
          </select>
        </Field>

        <Controller
          name="projectId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Project
              </FieldLabel>

              <select
                id={field.name}
                value={field.value}
                onChange={(event) =>
                  handleProjectChange(
                    event.target.value
                  )
                }
                disabled={
                  !effectiveTeamId ||
                  areProjectsLoading
                }
                className="h-9 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={fieldState.invalid}
              >
                <option value="">
                  {!effectiveTeamId
                    ? "Select a team first"
                    : areProjectsLoading
                      ? "Loading projects..."
                      : "Select a project"}
                </option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>

              {effectiveTeamId &&
                !areProjectsLoading &&
                projects.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No projects were found for this
                    team.
                  </p>
                )}

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <Controller
          name="assigneeId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Assignee
              </FieldLabel>

              <select
                id={field.name}
                value={field.value ?? ""}
                onChange={(event) =>
                  field.onChange(
                    event.target.value
                  )
                }
                disabled={
                  !selectedProjectId ||
                  areMembersLoading
                }
                className="h-9 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={fieldState.invalid}
              >
                <option value="">
                  {!selectedProjectId
                    ? "Select a project first"
                    : areMembersLoading
                      ? "Loading members..."
                      : "Unassigned"}
                </option>

                {members.map((member) => (
                  <option
                    key={member.user.id}
                    value={member.user.id}
                  >
                    {member.user.name} (
                    {member.role})
                  </option>
                ))}
              </select>

              {selectedProjectId &&
                !areMembersLoading &&
                members.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No team members were found.
                  </p>
                )}

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={mutation.isPending}
            onClick={() => {
              const projectId =
                task?.projectId ??
                form.getValues("projectId")

              router.push(
                projectId
                  ? `/projects/${projectId}/tasks`
                  : "/projects"
              )
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
                ? "Save changes"
                : "Create task"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}