"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"

import { useProjectDialogsContext } from "@/components/editor/project-dialogs-provider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Project } from "@/app/generated/prisma/client"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center px-4 py-12 text-center text-sm text-copy-muted">
      {message}
    </div>
  )
}

function ProjectList({
  projects,
  emptyMessage,
  renderActions,
}: {
  projects: Project[]
  emptyMessage: string
  renderActions?: (project: Project) => React.ReactNode
}) {
  if (projects.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className="flex flex-col gap-0.5 p-2">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-copy-primary hover:bg-subtle"
        >
          <span className="truncate">{project.name}</span>
          {renderActions && (
            <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              {renderActions(project)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  const {
    myProjects,
    sharedProjects,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
  } = useProjectDialogsContext()

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 top-14 bottom-0 z-30 bg-black/50 transition-opacity duration-200 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed top-14 bottom-0 left-0 z-40 flex w-80 flex-col border-r border-surface-border bg-elevated transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Tabs
          defaultValue="my-projects"
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="shrink-0 px-4 pt-3">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1">
                My projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="my-projects" className="min-h-0 flex-1">
            <ScrollArea className="h-full">
              <ProjectList
                projects={myProjects}
                emptyMessage="No projects yet."
                renderActions={(project) => (
                  <>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Rename ${project.name}`}
                      onClick={() => openRenameDialog(project)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Delete ${project.name}`}
                      onClick={() => openDeleteDialog(project)}
                    >
                      <Trash2 />
                    </Button>
                  </>
                )}
              />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="shared" className="min-h-0 flex-1">
            <ScrollArea className="h-full">
              <ProjectList
                projects={sharedProjects}
                emptyMessage="No shared projects yet."
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="shrink-0 border-t border-surface-border p-3">
          <Button className="w-full" onClick={openCreateDialog}>
            <Plus data-icon="inline-start" className="size-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
