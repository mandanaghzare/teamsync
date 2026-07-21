"use client";

import {
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Teams",
    href: "/teams",
    icon: Users,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
];

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r bg-background px-4 py-6">
      <div className="mb-8 px-3">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          TeamSync
        </Link>

        <p className="mt-1 text-xs text-muted-foreground">
          Team workspace
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="size-5 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="flex w-full items-center cursor-pointer gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="size-5 shrink-0" />
        <span>Logout</span>
      </button>
    </aside>
  );
}