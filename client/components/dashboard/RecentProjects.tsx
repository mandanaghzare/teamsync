import { FolderKanban } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const recentProjects = [
  {
    id: "1",
    name: "TeamSync Frontend",
    team: "Core Team",
    tasksCount: 12,
    completedTasksCount: 5,
  },
  {
    id: "2",
    name: "Mobile Application",
    team: "Product Team",
    tasksCount: 18,
    completedTasksCount: 11,
  },
  {
    id: "3",
    name: "Marketing Website",
    team: "Design Team",
    tasksCount: 8,
    completedTasksCount: 6,
  },
];

export default function RecentProjects() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {recentProjects.map((project) => {
          const progress =
            project.tasksCount === 0
              ? 0
              : Math.round(
                  (project.completedTasksCount / project.tasksCount) * 100,
                );

          return (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-lg border p-4 w-full"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <FolderKanban className="size-5 text-muted-foreground" />
                </div>

                <div>
                  <p className="font-medium">{project.name}</p>

                  <p className="text-sm text-muted-foreground">
                    {project.team}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium">{progress}%</p>

                <p className="text-xs text-muted-foreground">
                  {project.completedTasksCount}/{project.tasksCount} tasks
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}