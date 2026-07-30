"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectsTable from "@/components/projects/ProjectsTable";
import { getProjects } from "@/lib/project-service";
import type { Project } from "@/types/project";

const TEAM_ID = "cmr1xwgdy0000ggkb7xf376sf";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery<Project[]>({
    queryKey: ["projects", TEAM_ID],
    queryFn: () => getProjects(TEAM_ID),
  });

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase();

    if (!normalizedQuery) {
      return projects;
    }

    return projects.filter((project: Project) => {
      const name =
        project.name?.toLowerCase() ?? "";

      const description =
        project.description?.toLowerCase() ?? "";

      return (
        name.includes(normalizedQuery) ||
        description.includes(normalizedQuery)
      );
    });
  }, [projects, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-40 items-center justify-center text-destructive">
        Failed to load projects.
      </div>
    );
  }

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          type="search"
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(event.target.value)
          }
          placeholder="Search projects..."
          className="pl-9"
          aria-label="Search projects"
        />
      </div>

      <ProjectsTable data={filteredProjects} />

      {searchQuery.trim() &&
        filteredProjects.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No projects match &quot;
            {searchQuery.trim()}&quot;.
          </p>
        )}
    </section>
  );
}