type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Project Details</h1>

      <p className="text-muted-foreground">
        Project ID: {id}
      </p>
    </div>
  )
}