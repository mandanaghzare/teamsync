"use client"

import {
  type ReactNode,
  useEffect,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import Navbar from "@/components/layout/Navbar"
import Sidebar from "@/components/layout/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.replace("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen md:flex">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />

        <main className="flex-1 px-4 pb-6 pt-20 sm:px-5 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}