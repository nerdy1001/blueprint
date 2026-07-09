import { clerkClient } from "@clerk/nextjs/server"

import type { ProjectCollaborator } from "@/app/generated/prisma/client"

export interface EnrichedCollaborator {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  role: "owner" | "collaborator"
}

export async function enrichCollaborators(
  collaborators: ProjectCollaborator[]
): Promise<EnrichedCollaborator[]> {
  if (collaborators.length === 0) return []

  const emails = [...new Set(collaborators.map((c) => c.email.toLowerCase()))]
  const client = await clerkClient()
  const { data: users } = await client.users.getUserList({
    emailAddress: emails,
    limit: Math.min(emails.length, 100),
  })

  const userByEmail = new Map<string, (typeof users)[number]>()
  for (const user of users) {
    for (const address of user.emailAddresses) {
      userByEmail.set(address.emailAddress.toLowerCase(), user)
    }
  }

  return collaborators.map((collaborator) => {
    const user = userByEmail.get(collaborator.email.toLowerCase())
    return {
      id: collaborator.id,
      email: collaborator.email,
      name: user?.fullName ?? null,
      avatarUrl: user?.imageUrl ?? null,
      role: "collaborator",
    }
  })
}

export async function enrichOwner(ownerId: string): Promise<EnrichedCollaborator> {
  const client = await clerkClient()
  const user = await client.users.getUser(ownerId).catch(() => null)

  return {
    id: ownerId,
    email: user?.primaryEmailAddress?.emailAddress ?? "",
    name: user?.fullName ?? null,
    avatarUrl: user?.imageUrl ?? null,
    role: "owner",
  }
}
