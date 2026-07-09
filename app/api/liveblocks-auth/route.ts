import { currentUser } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

import { cursorColorForUser, getLiveblocksClient } from "@/lib/liveblocks"
import { prisma } from "@/lib/prisma"
import { getCurrentIdentity, hasProjectAccess } from "@/lib/project-access"

export async function POST(request: NextRequest) {
  const identity = await getCurrentIdentity()

  if (!identity.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const roomId = typeof body?.room === "string" ? body.room : ""

  if (!roomId) {
    return NextResponse.json({ error: "Missing room" }, { status: 400 })
  }

  const project = await prisma.project.findUnique({
    where: { id: roomId },
    include: { collaborators: true },
  })

  if (!project || !hasProjectAccess(project, identity)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const liveblocks = getLiveblocksClient()
  await liveblocks.getOrCreateRoom(roomId, { defaultAccesses: [] })

  const user = await currentUser()
  const name =
    user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "Anonymous"
  const avatar = user?.imageUrl ?? ""
  const color = cursorColorForUser(identity.userId)

  const session = liveblocks.prepareSession(identity.userId, {
    userInfo: { name, avatar, color },
  })
  session.allow(roomId, ["*:write"])

  const { status, body: responseBody } = await session.authorize()

  return new NextResponse(responseBody, {
    status,
    headers: { "Content-Type": "application/json" },
  })
}
