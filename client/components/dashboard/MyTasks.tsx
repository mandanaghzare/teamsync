import { Circle, Clock3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const tasks = [
  {
    id: "1",
    title: "Finish dashboard layout",
    project: "TeamSync Frontend",
    priority: "HIGH",
    dueDate: "Today",
  },
  {
    id: "2",
    title: "Review authentication flow",
    project: "TeamSync Backend",
    priority: "MEDIUM",
    dueDate: "Tomorrow",
  },
  {
    id: "3",
    title: "Prepare team invitation UI",
    project: "Team Management",
    priority: "LOW",
    dueDate: "Jul 24",
  },
];

const priorityStyles = {
  HIGH: "bg-destructive/10 text-destructive",
  MEDIUM: "bg-yellow-500/10 text-yellow-500",
  LOW: "bg-emerald-500/10 text-emerald-500",
};

export default function MyTasks() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start justify-between gap-4 rounded-lg border p-4"
          >
            <div className="flex min-w-0 gap-3">
              <Circle className="mt-1 size-4 shrink-0 text-muted-foreground" />

              <div className="min-w-0">
                <p className="truncate font-medium">{task.title}</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {task.project}
                </p>

                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="size-3.5" />
                  <span>{task.dueDate}</span>
                </div>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                priorityStyles[
                  task.priority as keyof typeof priorityStyles
                ]
              }`}
            >
              {task.priority}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}