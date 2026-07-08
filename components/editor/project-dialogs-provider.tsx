"use client"

import * as React from "react"

import { EditorDialog } from "@/components/editor/editor-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"
import {
  INITIAL_MY_PROJECTS,
  SHARED_PROJECTS,
  type Project,
} from "@/lib/mock-projects"

interface ProjectDialogsContextValue {
  myProjects: Project[]
  sharedProjects: Project[]
  openCreateDialog: () => void
  openRenameDialog: (project: Project) => void
  openDeleteDialog: (project: Project) => void
}

const ProjectDialogsContext =
  React.createContext<ProjectDialogsContextValue | null>(null)

export function useProjectDialogsContext() {
  const context = React.useContext(ProjectDialogsContext)
  if (!context) {
    throw new Error(
      "useProjectDialogsContext must be used within a ProjectDialogsProvider"
    )
  }
  return context
}

export function ProjectDialogsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [myProjects, setMyProjects] =
    React.useState<Project[]>(INITIAL_MY_PROJECTS)

  const {
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
  } = useProjectDialogs({
    onCreate: ({ name, slug }) => {
      setMyProjects((projects) => [
        ...projects,
        { id: crypto.randomUUID(), name, slug },
      ])
    },
    onRename: (project, next) => {
      setMyProjects((projects) =>
        projects.map((p) => (p.id === project.id ? { ...p, ...next } : p))
      )
    },
    onDelete: (project) => {
      setMyProjects((projects) => projects.filter((p) => p.id !== project.id))
    },
  })

  return (
    <ProjectDialogsContext.Provider
      value={{
        myProjects,
        sharedProjects: SHARED_PROJECTS,
        openCreateDialog,
        openRenameDialog,
        openDeleteDialog,
      }}
    >
      {children}

      <EditorDialog
        open={dialog?.type === "create"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Create project"
        description="Give your project a name to get started."
        footer={
          <>
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={submitCreate}
              disabled={isLoading || !name.trim()}
            >
              Create
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-2">
          <Input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && submitCreate()}
            placeholder="Project name"
          />
          <p className="font-mono text-sm text-copy-muted">
            /{slug || "your-project-slug"}
          </p>
        </div>
      </EditorDialog>

      <EditorDialog
        open={dialog?.type === "rename"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Rename project"
        description={
          dialog?.type === "rename"
            ? `Renaming "${dialog.project.name}".`
            : undefined
        }
        footer={
          <>
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={submitRename}
              disabled={isLoading || !name.trim()}
            >
              Save
            </Button>
          </>
        }
      >
        <Input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && submitRename()}
        />
      </EditorDialog>

      <EditorDialog
        open={dialog?.type === "delete"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Delete project"
        description={
          dialog?.type === "delete"
            ? `This will permanently delete "${dialog.project.name}". This action cannot be undone.`
            : undefined
        }
        footer={
          <>
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={submitDelete}
              disabled={isLoading}
            >
              Delete
            </Button>
          </>
        }
      />
    </ProjectDialogsContext.Provider>
  )
}
