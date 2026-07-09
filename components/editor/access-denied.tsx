import Link from "next/link"
import { Lock } from "lucide-react"

import { Button } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-base px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-subtle">
        <Lock className="h-5 w-5 text-copy-muted" />
      </div>
      <p className="text-sm text-copy-muted">
        You don&apos;t have access to this project.
      </p>
      <Button asChild variant="outline" size="sm">
        <Link href="/editor">Back to projects</Link>
      </Button>
    </div>
  )
}
