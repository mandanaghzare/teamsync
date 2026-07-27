import { cn } from "@/lib/utils"

type ProjectStatusBadgeProps = {
  status: "Active" | "Review" | "Completed"
}

const statusStyles = {
  Active:
    "bg-green-500/10 text-green-500 border-green-500/20",

  Review:
    "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",

  Completed:
    "bg-blue-500/10 text-blue-500 border-blue-500/20",
}

export function ProjectStatusBadge({status}: ProjectStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  )
}