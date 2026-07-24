type ProjectInfoProps = {
  label: string
  value: React.ReactNode
}

export function ProjectInfo({
  label,
  value,
}: ProjectInfoProps) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value}
      </p>
    </div>
  )
}