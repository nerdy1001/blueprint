import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/editor/access-denied"
import { CanvasRoom } from "@/components/editor/canvas-room"
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

  return <CanvasRoom roomId={project.id} />
}
