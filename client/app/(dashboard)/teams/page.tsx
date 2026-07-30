"use client"

import { useQuery } from "@tanstack/react-query"

import { getMyTeams } from "@/lib/team-service"
import { Breadcrumbs } from "@/components/shared/Breadcrumbs"

export default function TeamsPage() {
  const {
    data: teams = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: getMyTeams,
  })

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        Loading teams...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-40 items-center justify-center text-destructive">
        Failed to load teams.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            {
              label: "Dashboard",
              href: "/",
            },
            {
              label: "Teams",
            },
          ]}
        />

        <h1 className="text-3xl font-bold">
          Teams
        </h1>

        <p className="text-muted-foreground">
          View the teams you belong to.
        </p>
      </div>

      {teams.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h2 className="font-semibold">
            No teams found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            You are not a member of any team yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teams.map((membership) => (
            <div
              key={membership.team.id}
              className="rounded-lg border p-5"
            >
              <h2 className="font-semibold">
                {membership.team.name}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Role: {membership.role}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Invite code:{" "}
                {membership.team.inviteCode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}