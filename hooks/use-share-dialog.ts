"use client"

import { useState } from "react"

import type { EnrichedCollaborator } from "@/lib/collaborators"

interface UseShareDialogOptions {
  projectId: string
}

export function useShareDialog({ projectId }: UseShareDialogOptions) {
  const [owner, setOwner] = useState<EnrichedCollaborator | null>(null)
  const [collaborators, setCollaborators] = useState<EnrichedCollaborator[]>(
    []
  )
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [email, setEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>("")

  async function load() {
    setEmail("")
    setInviteError(null)
    setIsLoadingList(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`)
      const data: { owner: EnrichedCollaborator | null; collaborators: EnrichedCollaborator[] } =
        response.ok
          ? await response.json()
          : { owner: null, collaborators: [] }
      setOwner(data.owner ?? null)
      setCollaborators(data.collaborators ?? [])
    } finally {
      setIsLoadingList(false)
    }
  }

  async function submitInvite() {
    const trimmed = email.trim()
    if (!trimmed) return

    setIsInviting(true)
    setInviteError(null)
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        setInviteError(
          typeof body?.error === "string" ? body.error : "Couldn't invite that email"
        )
        return
      }

      const created: EnrichedCollaborator = await response.json()
      setCollaborators((current) => [...current, created])
      setEmail("")
    } finally {
      setIsInviting(false)
    }
  }

  async function removeCollaborator(collaboratorId: string) {
    setRemovingId(collaboratorId)
    try {
      const response = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        { method: "DELETE" }
      )
      if (!response.ok) return
      setCollaborators((current) =>
        current.filter((c) => c.id !== collaboratorId)
      )
    } finally {
      setRemovingId(null)
    }
  }

  async function copyLink() {
    const url = `${window.location.origin}/editor/${projectId}`

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      setError('Unable to copy link to clipboard.')
    }
  }

  return {
    owner,
    collaborators,
    isLoadingList,
    load,
    email,
    setEmail,
    isInviting,
    inviteError,
    submitInvite,
    removingId,
    removeCollaborator,
    copied,
    copyLink,
  }
}
