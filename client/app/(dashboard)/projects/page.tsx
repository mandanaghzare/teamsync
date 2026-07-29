"use client";

import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import ProjectsTable from "@/components/projects/ProjectsTable";
import { getProjects } from "@/lib/project-service";
import Link from "next/link";

const TEAM_ID = "cmr1xwgdy0000ggkb7xf376sf";

export default function ProjectsPage() {
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects", TEAM_ID],
    queryFn: () => getProjects(TEAM_ID),
  });

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-40 items-center justify-center">
        Failed to load projects.
      </div>
    );
  }

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Projects
          </h1>

          <p className="text-muted-foreground">
            Manage and track your team projects.
          </p>
        </div>

        <Button
          nativeButton={false}
          render={<Link href="/projects/new" />}
        >
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      <ProjectsTable data={projects} />
    </section>
  );
}