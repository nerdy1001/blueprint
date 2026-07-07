"use client"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

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

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
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

      <Tabs defaultValue="my-projects" className="flex min-h-0 flex-1 flex-col">
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
            <EmptyState message="No projects yet." />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="shared" className="min-h-0 flex-1">
          <ScrollArea className="h-full">
            <EmptyState message="No shared projects yet." />
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="shrink-0 border-t border-surface-border p-3">
        <Button className="w-full">
          <Plus data-icon="inline-start" className="size-4" />
          New Project
        </Button>
      </div>
    </aside>
  )
}
