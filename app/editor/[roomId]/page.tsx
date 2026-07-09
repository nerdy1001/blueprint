import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/editor/access-denied"
import { prisma } from "@/lib/prisma"
import { getCurrentIdentity, hasProjectAccess } from "@/lib/project-access"

export default async function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = await params
  const identity = await getCurrentIdentity()

  if (!identity.userId) {
    redirect("/sign-in")
  }

  const project = await prisma.project.findUnique({
    where: { id: roomId },
    include: { collaborators: true },
  })

  if (!project || !hasProjectAccess(project, identity)) {
    return <AccessDenied />
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-base px-4 text-center">
      <h1 className="text-lg font-medium text-copy-primary">
        {project.name}
      </h1>
      <p className="text-sm text-copy-muted">Canvas coming soon.</p>
    </div>
  )
}
