import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ProjectForm } from "@/components/projects/ProjectForm";

export default function NewProjectPage() {
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

        <ProjectForm defaultTeamId="cmr1xwgdy0000ggkb7xf376sf" />
    </div>
  );
}