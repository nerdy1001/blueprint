"use client"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import type { Project } from "@/app/generated/prisma/client"

type DialogState =
  | { type: "create" }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project }
  | null

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function generateSuffix(): string {
  return Math.random().toString(36).slice(2, 8)
}

export function useProjectActions() {
  const router = useRouter()
  const params = useParams<{ roomId?: string }>()

  const [dialog, setDialog] = useState<DialogState>(null)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suffix, setSuffix] = useState(generateSuffix)

  const roomId = useMemo(() => {
    const slug = slugify(name)
    return slug ? `${slug}-${suffix}` : ""
  }, [name, suffix])

  function openCreateDialog() {
    setSuffix(generateSuffix())
    setName("")
    setDialog({ type: "create" })
  }

  function openRenameDialog(project: Project) {
    setName(project.name)
    setDialog({ type: "rename", project })
  }

  function openDeleteDialog(project: Project) {
    setDialog({ type: "delete", project })
  }

  function closeDialog() {
    if (isLoading) return
    setDialog(null)
  }

  async function submitCreate() {
    const trimmed = name.trim()
    if (!trimmed) return
    setIsLoading(true)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      })
      if (!response.ok) return
      const project: Project = await response.json()
      setDialog(null)
      router.push(`/editor/${project.id}`)
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  async function submitRename() {
    if (dialog?.type !== "rename") return
    const trimmed = name.trim()
    if (!trimmed) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${dialog.project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      })
      if (!response.ok) return
      setDialog(null)
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  async function submitDelete() {
    if (dialog?.type !== "delete") return
    const target = dialog.project
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${target.id}`, {
        method: "DELETE",
      })
      if (!response.ok) return
      setDialog(null)
      if (params?.roomId === target.id) {
        router.push("/editor")
      }
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return {
    dialog,
    name,
    setName,
    roomId,
    isLoading,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  }
}
