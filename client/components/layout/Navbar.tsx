"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

const emptySubscribe = () => {
  return () => {}
}

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme()

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 pl-16 sm:px-5 sm:pl-16 md:px-6 md:pl-6">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold sm:text-xl">
          Dashboard
        </h1>

        <p className="truncate text-xs text-muted-foreground sm:text-sm">
          Welcome back 👋
        </p>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={() =>
          setTheme(
            resolvedTheme === "dark"
              ? "light"
              : "dark"
          )
        }
        aria-label="Toggle theme"
      >
        {mounted ? (
          resolvedTheme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )
        ) : (
          <span className="block size-5" />
        )}
      </Button>
    </header>
  )
}