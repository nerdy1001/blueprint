"use client"

import { UserButton } from "@clerk/nextjs"
import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  projectName?: string
  isAiSidebarOpen?: boolean
  onToggleAiSidebar?: () => void
  onOpenShareDialog?: () => void
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  isAiSidebarOpen,
  onToggleAiSidebar,
  onOpenShareDialog,
}: EditorNavbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-surface-border bg-elevated px-3">
      <div className="flex flex-1 items-center justify-start">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        {projectName && (
          <span className="truncate text-sm font-medium text-copy-primary">
            {projectName}
          </span>
        )}
      </div>
      <div className="flex flex-1 items-center justify-end gap-1">
        {onToggleAiSidebar && (
          <>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onOpenShareDialog}
              aria-label="Share project"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleAiSidebar}
              aria-label={isAiSidebarOpen ? "Close AI panel" : "Open AI panel"}
            >
              <Sparkles
                className={cn("h-5 w-5", isAiSidebarOpen && "text-ai")}
              />
            </Button>
          </>
        )}
        <UserButton />
      </div>
    </header>
  )
}
