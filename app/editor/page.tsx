"use client"

import { Plus } from "lucide-react"

import { useProjectDialogsContext } from "@/components/editor/project-dialogs-provider"
import { Button } from "@/components/ui/button"

export default function EditorPage() {
  const { openCreateDialog } = useProjectDialogsContext()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-lg font-medium text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-copy-muted">
          Start a new workspace, or choose a project from the sidebar
        </p>
      </div>
      <Button onClick={openCreateDialog}>
        <Plus data-icon="inline-start" className="size-4" />
        New Project
      </Button>
    </div>
  )
}
