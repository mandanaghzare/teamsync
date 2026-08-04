"use client"

import { useState } from "react"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { Plus, UserPlus } from "lucide-react"
import { toast } from "sonner"

import {
  createTeam,
  getMyTeams,
  joinTeam,
} from "@/lib/team-service"
import { Breadcrumbs } from "@/components/shared/Breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TeamsPage() {
  const queryClient = useQueryClient()

  const [teamName, setTeamName] = useState("")
  const [inviteCode, setInviteCode] = useState("")

  const {
    data: teams = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: getMyTeams,
  })

  const createMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["teams"],
      })

      setTeamName("")
      toast.success("Team created successfully")
    },
    onError: () => {
      toast.error("Failed to create team")
    },
  })

  const joinMutation = useMutation({
    mutationFn: joinTeam,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["teams"],
      })

      setInviteCode("")
      toast.success("You joined the team")
    },
    onError: () => {
      toast.error("Failed to join team")
    },
  })

  function handleCreateTeam() {
    const name = teamName.trim()

    if (!name) {
      toast.error("Enter a team name")
      return
    }

    createMutation.mutate(name)
  }

  function handleJoinTeam() {
    const code = inviteCode.trim()

    if (!code) {
      toast.error("Enter an invite code")
      return
    }

    joinMutation.mutate(code)
  }

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
              href: "/dashboard",
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
          Create a team, join another team, and manage your memberships.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border p-5">
          <div>
            <h2 className="font-semibold">
              Create a team
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Create a new workspace and become its owner.
            </p>
          </div>

          <Input
            value={teamName}
            onChange={(event) =>
              setTeamName(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleCreateTeam()
              }
            }}
            placeholder="Team name"
          />

          <Button
            type="button"
            onClick={handleCreateTeam}
            disabled={createMutation.isPending}
            className="w-full"
          >
            <Plus className="size-4" />

            {createMutation.isPending
              ? "Creating..."
              : "Create Team"}
          </Button>
        </div>

        <div className="space-y-4 rounded-lg border p-5">
          <div>
            <h2 className="font-semibold">
              Join a team
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter an invite code shared by a team owner.
            </p>
          </div>

          <Input
            value={inviteCode}
            onChange={(event) =>
              setInviteCode(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleJoinTeam()
              }
            }}
            placeholder="Invite code"
          />

          <Button
            type="button"
            variant="outline"
            onClick={handleJoinTeam}
            disabled={joinMutation.isPending}
            className="w-full"
          >
            <UserPlus className="size-4" />

            {joinMutation.isPending
              ? "Joining..."
              : "Join Team"}
          </Button>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h2 className="font-semibold">
            No teams found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a team or join one using an invite code.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teams.map((membership) => (
            <div
              key={membership.id}
              className="rounded-lg border p-5"
            >
              <h2 className="font-semibold">
                {membership.team.name}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Role: {membership.role}
              </p>

              <p className="mt-1 break-all text-sm text-muted-foreground">
                Invite code: {membership.team.inviteCode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}