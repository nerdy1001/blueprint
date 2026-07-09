import { NextRequest, NextResponse } from "next/server"

import { enrichCollaborators, enrichOwner } from "@/lib/collaborators"
import { prisma } from "@/lib/prisma"
import { getCurrentIdentity, hasProjectAccess } from "@/lib/project-access"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await getCurrentIdentity()

  if (!identity.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: true },
  })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (!hasProjectAccess(project, identity)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const [owner, collaborators] = await Promise.all([
    enrichOwner(project.ownerId),
    enrichCollaborators(project.collaborators),
  ])

  return NextResponse.json({ owner, collaborators })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await getCurrentIdentity()

  if (!identity.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId } })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (project.ownerId !== identity.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""

  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required" },
      { status: 400 }
    )
  }

  const existing = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId, email } },
  })

  if (existing) {
    return NextResponse.json(
      { error: "Already a collaborator" },
      { status: 409 }
    )
  }

  const collaborator = await prisma.projectCollaborator.create({
    data: { projectId, email },
  })

  const [enriched] = await enrichCollaborators([collaborator])

  return NextResponse.json(enriched, { status: 201 })
}
