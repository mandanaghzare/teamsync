import { ColumnDef } from "@tanstack/react-table";

type Project = {
  id: number;
  name: string;
  team: string;
  status: "Active" | "Review" | "Completed";
  progress: number;
  dueDate: string;
};

const projects: Project[] = [
  {
    id: 1,
    name: "TeamSync Frontend",
    team: "Core Team",
    status: "Active",
    progress: 42,
    dueDate: "Jul 30",
  },
  {
    id: 2,
    name: "Backend API",
    team: "Core Team",
    status: "Review",
    progress: 83,
    dueDate: "Aug 10",
  },
  {
    id: 3,
    name: "Marketing Website",
    team: "Design Team",
    status: "Completed",
    progress: 100,
    dueDate: "Jul 18",
  },
];

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Project",
  },
  {
    accessorKey: "team",
    header: "Team",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "progress",
    header: "Progress",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
];

export default function ProjectsTable() {
  return <div>Projects Table</div>;
}