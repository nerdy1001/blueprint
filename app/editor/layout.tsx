import { auth, currentUser } from "@clerk/nextjs/server"

import { EditorShell } from "@/components/editor/editor-shell"
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-provider"
import { getOwnedProjects, getSharedProjects } from "@/lib/projects"

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  const user = userId ? await currentUser() : null
  const email = user?.primaryEmailAddress?.emailAddress

  const [myProjects, sharedProjects] = await Promise.all([
    userId ? getOwnedProjects(userId) : Promise.resolve([]),
    email ? getSharedProjects(email) : Promise.resolve([]),
  ])

  return (
    <ProjectDialogsProvider
      myProjects={myProjects}
      sharedProjects={sharedProjects}
    >
      <EditorShell>{children}</EditorShell>
    </ProjectDialogsProvider>
  )
}
