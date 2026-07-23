import {
  CheckCircle2,
  FolderKanban,
  ListTodo,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RecentProjects from "@/components/dashboard/RecentProjects";
import MyTasks from "@/components/dashboard/MyTasks";
import ProjectsTable from "@/components/projects/ProjectsTable";

const stats = [
  {
    title: "Teams",
    value: 3,
    description: "Teams you belong to",
    icon: Users,
  },
  {
    title: "Projects",
    value: 8,
    description: "Active projects",
    icon: FolderKanban,
  },
  {
    title: "Assigned Tasks",
    value: 14,
    description: "Tasks assigned to you",
    icon: ListTodo,
  },
  {
    title: "Completed",
    value: 27,
    description: "Completed tasks",
    icon: CheckCircle2,
  },
];

export default function DashboardPage() {
  return (
    <section className="w-full space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>

                <Icon className="size-5 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid w-full gap-6 lg:grid-cols-2">
        <RecentProjects />
        <MyTasks />
      </div>
    </section>
  );
}