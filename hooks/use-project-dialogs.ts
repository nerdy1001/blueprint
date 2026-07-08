"use client"

import { useMemo, useState } from "react"

import { slugify, type Project } from "@/lib/mock-projects"

type DialogState =
  | { type: "create" }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project }
  | null

interface UseProjectDialogsOptions {
  onCreate: (project: { name: string; slug: string }) => void
  onRename: (project: Project, next: { name: string; slug: string }) => void
  onDelete: (project: Project) => void
}

const MOCK_LATENCY_MS = 300

export function useProjectDialogs({
  onCreate,
  onRename,
  onDelete,
}: UseProjectDialogsOptions) {
  const [dialog, setDialog] = useState<DialogState>(null)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const slug = useMemo(() => slugify(name), [name])

  function openCreateDialog() {
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
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
    onCreate({ name: trimmed, slug: slugify(trimmed) })
    setIsLoading(false)
    setDialog(null)
  }

  async function submitRename() {
    if (dialog?.type !== "rename") return
    const trimmed = name.trim()
    if (!trimmed) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
    onRename(dialog.project, { name: trimmed, slug: slugify(trimmed) })
    setIsLoading(false)
    setDialog(null)
  }

  async function submitDelete() {
    if (dialog?.type !== "delete") return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
    onDelete(dialog.project)
    setIsLoading(false)
    setDialog(null)
  }

  return {
    dialog,
    name,
    setName,
    slug,
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
