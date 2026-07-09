"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Sparkles } from "lucide-react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
import { useProjectDialogsContext } from "@/components/editor/project-dialogs-provider"
import { useShareDialog } from "@/hooks/use-share-dialog"
import { cn } from "@/lib/utils"

interface EditorShellProps {
  children: React.ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [isAiSidebarOpen, setAiSidebarOpen] = useState(false)
  const [isShareDialogOpen, setShareDialogOpen] = useState(false)
  const params = useParams<{ roomId?: string }>()
  const { user } = useUser()
  const { myProjects, sharedProjects } = useProjectDialogsContext()
  const shareDialog = useShareDialog({ projectId: params?.roomId ?? "" })

  const roomId = params?.roomId
  const activeProject = roomId
    ? [...myProjects, ...sharedProjects].find(
        (project) => project.id === roomId
      )
    : undefined
  const isOwner = activeProject?.ownerId === user?.id

  return (
    <div className="flex h-screen flex-col bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        projectName={activeProject?.name}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={
          roomId ? () => setAiSidebarOpen((open) => !open) : undefined
        }
        onOpenShareDialog={
          roomId
            ? () => {
                setShareDialogOpen(true)
                shareDialog.load()
              }
            : undefined
        }
      />
      {roomId && activeProject && (
        <ShareDialog
          open={isShareDialogOpen}
          onOpenChange={setShareDialogOpen}
          isOwner={isOwner}
          {...shareDialog}
        />
      )}
      <div className="relative flex min-h-0 flex-1">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeProjectId={roomId}
        />
        <main className="h-full min-w-0 flex-1">{children}</main>
        {roomId && (
          <aside
            className={cn(
              "fixed top-14 right-0 bottom-0 z-40 hidden w-80 flex-col border-l border-surface-border bg-elevated shadow-xl transition-transform duration-200 ease-out lg:flex",
              isAiSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
            aria-hidden={!isAiSidebarOpen}
          >
            <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
              <Sparkles className="h-6 w-6 text-ai" />
              <p className="text-sm text-copy-muted">AI chat coming soon.</p>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
