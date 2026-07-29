"use client"

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
import { getProjectById } from "@/lib/project-service"
import { getTeamMembers } from "@/lib/team-service"
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

export function TaskForm({
  task,
  defaultProjectId,
}: TaskFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const isEditMode = Boolean(task)

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
    data: selectedProject,
    isLoading: isProjectLoading,
  } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: () => getProjectById(selectedProjectId),
    enabled: Boolean(selectedProjectId),
  })

  const {
    data: members = [],
    isLoading: areMembersLoading,
  } = useQuery({
    queryKey: [
      "team-members",
      selectedProject?.teamId,
    ],
    queryFn: () =>
      getTeamMembers(selectedProject!.teamId),
    enabled: Boolean(selectedProject?.teamId),
  })

  const mutation = useMutation({
    mutationFn: (data: TaskFormValues) => {
      if (task) {
        return updateTask(task.id, data)
      }

      return createTask(data)
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ])

      toast.success(
        task
          ? "Task updated successfully"
          : "Task created successfully"
      )

      router.push("/tasks")
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
      className="max-w-2xl rounded-lg border p-6"
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

        <Controller
          name="projectId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Project ID
              </FieldLabel>

              <Input
                {...field}
                id={field.name}
                placeholder="Enter project ID"
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
                onChange={(event) => {
                  field.onChange(event.target.value)
                }}
                disabled={
                  !selectedProjectId ||
                  isProjectLoading ||
                  areMembersLoading
                }
                className="h-9 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={fieldState.invalid}
              >
                <option value="">
                  {isProjectLoading
                    ? "Loading project..."
                    : areMembersLoading
                      ? "Loading members..."
                      : "Unassigned"}
                </option>

                {members.map((member) => (
                  <option
                    key={member.user.id}
                    value={member.user.id}
                  >
                    {member.user.name} ({member.role})
                  </option>
                ))}
              </select>

              {selectedProjectId &&
                !isProjectLoading &&
                !areMembersLoading &&
                members.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No members were found for this
                    project&apos;s team.
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

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (task) {
                router.push(`/tasks/${task.id}`)
                return
              }

              router.push("/tasks")
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