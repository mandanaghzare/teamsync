"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  createProject,
  updateProject,
} from "@/lib/project-service"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  projectSchema,
  type ProjectFormValues,
} from "@/lib/project-schema"
import type { Project } from "@/types/project"

type ProjectFormProps = {
  project?: Project
  defaultTeamId?: string
}

export function ProjectForm({
  project,
  defaultTeamId,
}: ProjectFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const isEditMode = Boolean(project)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: "onBlur",
    defaultValues: {
        name: project?.name ?? "",
        description: project?.description ?? "",
        teamId: project?.teamId ?? defaultTeamId ?? "",
    },
  })

  const mutation = useMutation({
    mutationFn: (data: ProjectFormValues) => {
      if (project) {
        return updateProject(project.id, data)
      }

      return createProject(data)
    },

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      })

      toast.success(
        isEditMode
          ? "Project updated successfully"
          : "Project created successfully"
      )

      const projectId =
        response?.project?.id ?? project?.id

      if (projectId) {
        router.push(`/projects/${projectId}`)
      } else {
        router.push("/projects")
      }

      router.refresh()
    },

    onError: () => {
      toast.error(
        isEditMode
          ? "Failed to update project"
          : "Failed to create project"
      )
    },
  })

  function onSubmit(data: ProjectFormValues) {
    mutation.mutate(data)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-2xl rounded-lg border p-6"
      noValidate
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Project name
              </FieldLabel>

              <Input
                {...field}
                id={field.name}
                placeholder="Enter project name"
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
                placeholder="Write a short project description"
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
          name="teamId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Team ID
              </FieldLabel>

              <Input
                {...field}
                id={field.name}
                placeholder="Enter team ID"
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

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (project) {
                router.push(
                  `/projects/${project.id}`
                )
                return
              }

              router.push("/projects")
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
                : "Create project"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}