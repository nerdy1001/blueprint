import { EditorShell } from "@/components/editor/editor-shell"
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-provider"

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProjectDialogsProvider>
      <EditorShell>{children}</EditorShell>
    </ProjectDialogsProvider>
  )
}
