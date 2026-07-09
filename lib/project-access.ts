import { auth, currentUser } from "@clerk/nextjs/server"

import type { Project, ProjectCollaborator } from "@/app/generated/prisma/client"

export interface CurrentIdentity {
  userId: string | null
  email: string | null
}

export async function getCurrentIdentity(): Promise<CurrentIdentity> {
  const { userId } = await auth()
  const user = userId ? await currentUser() : null
  const email = user?.primaryEmailAddress?.emailAddress ?? null
  return { userId, email }
}

export function hasProjectAccess(
  project: Project & { collaborators: ProjectCollaborator[] },
  identity: CurrentIdentity
): boolean {
  const isOwner =
    identity.userId !== null && project.ownerId === identity.userId
  const isCollaborator =
    identity.email !== null
      ? project.collaborators.some(
          (c) => c.email.toLowerCase() === identity.email!.toLowerCase()
        )
      : false
  return isOwner || isCollaborator
}
