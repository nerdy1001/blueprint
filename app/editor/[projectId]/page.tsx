import { auth, currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

import { prisma } from "@/lib/prisma"

export default async function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const { userId } = await auth()

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: true },
  })

  if (!project) {
    notFound()
  }

  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress
  const isOwner = project.ownerId === userId
  const isCollaborator = email
    ? project.collaborators.some((c) => c.email === email)
    : false

  if (!isOwner && !isCollaborator) {
    notFound()
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
      <h1 className="text-lg font-medium text-copy-primary">
        {project.name}
      </h1>
      <p className="text-sm text-copy-muted">Canvas coming soon.</p>
    </div>
  )
}
