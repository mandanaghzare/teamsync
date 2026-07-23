import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import ProjectsTable from "@/components/projects/ProjectsTable";

export default function ProjectsPage() {
  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track your team projects.
          </p>
        </div>

        <Button>
          <Plus className="size-4" />
          New Project
        </Button>
      </div>
      <ProjectsTable /> 
    </section>
  );
}