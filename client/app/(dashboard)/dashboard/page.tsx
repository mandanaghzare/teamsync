"use client"

import { useQuery } from "@tanstack/react-query"

import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { MyTasks } from "@/components/dashboard/MyTasks"
import { RecentProjects } from "@/components/dashboard/RecentProjects"
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks"
import { getDashboard } from "@/lib/dashboard-service"

export default function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        Loading dashboard...
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-80 items-center justify-center text-destructive">
        Failed to load dashboard.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="mt-1 text-muted-foreground">
          Overview of your projects and tasks.
        </p>
      </header>

      <DashboardStats stats={data.stats} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentProjects projects={data.recentProjects} />
        <MyTasks tasks={data.myTasks} />
      </div>

      <UpcomingTasks tasks={data.upcomingTasks} />
    </div>
  )
}