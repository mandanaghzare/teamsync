type ProjectProgressProps = {
  value: number
}

export function ProjectProgress({
  value,
}: ProjectProgressProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${value}%` }}
        />
      </div>

      <span className="text-sm">
        {value}%
      </span>
    </div>
  )
}