"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TasksPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/projects")
  }, [router])

  return (
    <div className="flex h-40 items-center justify-center text-muted-foreground">
      Redirecting to projects...
    </div>
  )
}