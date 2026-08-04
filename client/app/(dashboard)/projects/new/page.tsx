"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { getMyTeams } from "@/lib/team-service";

export default function NewProjectPage() {
  const {
    data: teams = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: getMyTeams,
  });

  const teamId = teams[0]?.teamId ?? null;

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
        Failed to load team.
      </div>
    );
  }

  if (!teamId) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        You need to create or join a team first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: "New Project" },
          ]}
        />

        <h1 className="text-3xl font-bold">
          Create Project
        </h1>

        <p className="text-muted-foreground">
          Add a new project to your team.
        </p>
      </div>

      <ProjectForm defaultTeamId={teamId} />
    </div>
  );
}