"use client"

import { Check, Link as LinkIcon, Mail, X } from "lucide-react"

import { EditorDialog } from "@/components/editor/editor-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { EnrichedCollaborator } from "@/lib/collaborators"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isOwner: boolean
  owner: EnrichedCollaborator | null
  collaborators: EnrichedCollaborator[]
  isLoadingList: boolean
  email: string
  setEmail: (email: string) => void
  isInviting: boolean
  inviteError: string | null
  submitInvite: () => void
  removingId: string | null
  removeCollaborator: (collaboratorId: string) => void
  copied: boolean
  copyLink: () => void
}

function PersonAvatar({ person }: { person: EnrichedCollaborator }) {
  if (person.avatarUrl) {
    return (
      <img
        src={person.avatarUrl}
        alt=""
        className="h-9 w-9 shrink-0 rounded-full object-cover"
      />
    )
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-subtle text-sm font-medium text-copy-secondary">
      {(person.name ?? person.email).charAt(0).toUpperCase()}
    </div>
  )
}

export function ShareDialog({
  open,
  onOpenChange,
  isOwner,
  owner,
  collaborators,
  isLoadingList,
  email,
  setEmail,
  isInviting,
  inviteError,
  submitInvite,
  removingId,
  removeCollaborator,
  copied,
  copyLink,
}: ShareDialogProps) {
  const totalCount = (owner ? 1 : 0) + collaborators.length

  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Share project"
      description="Invite collaborators, copy the workspace link, and manage access."
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-surface-border bg-subtle/60 p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-copy-primary">
              Workspace link
            </p>
            <p className="mt-1 text-xs text-copy-muted">
              Share a direct link with teammates after you grant them access.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={copyLink}
          >
            {copied ? (
              <Check className="size-3.5 text-success" />
            ) : (
              <LinkIcon className="size-3.5" />
            )}
            {copied ? "Copied!" : "Copy link"}
          </Button>
        </div>

        {isOwner && (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              submitInvite()
            }}
          >
            <div className="flex items-center gap-2.5 rounded-xl border border-surface-border px-3 py-2 focus-within:border-ring">
              <Mail className="size-4 shrink-0 text-copy-muted" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
              <Button
                type="submit"
                size="sm"
                className="shrink-0"
                disabled={isInviting || !email.trim()}
              >
                {isInviting ? "Inviting…" : "Invite"}
              </Button>
            </div>
            {inviteError && (
              <p className="mt-2 text-sm text-error">{inviteError}</p>
            )}
          </form>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-copy-primary">
              People with access
            </p>
            <p className="text-xs text-copy-muted">{totalCount} total</p>
          </div>

          {isLoadingList ? (
            <p className="px-1 py-2 text-sm text-copy-muted">Loading…</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {owner && (
                <li className="flex items-center gap-3 rounded-lg px-1 py-2">
                  <PersonAvatar person={owner} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm text-copy-primary">
                        {owner.name ?? owner.email}
                      </p>
                      <span className="shrink-0 rounded-full bg-accent-dim px-2 py-0.5 text-[10px] font-semibold tracking-wide text-brand">
                        OWNER
                      </span>
                    </div>
                    {owner.name && owner.email && (
                      <p className="mt-0.5 truncate text-xs text-copy-muted">
                        {owner.email}
                      </p>
                    )}
                  </div>
                </li>
              )}
              {collaborators.map((collaborator) => (
                <li
                  key={collaborator.id}
                  className="group flex items-center gap-3 rounded-lg px-1 py-2"
                >
                  <PersonAvatar person={collaborator} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-copy-primary">
                      {collaborator.name ?? collaborator.email}
                    </p>
                    {collaborator.name && (
                      <p className="mt-0.5 truncate text-xs text-copy-muted">
                        {collaborator.email}
                      </p>
                    )}
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Remove ${collaborator.email}`}
                      onClick={() => removeCollaborator(collaborator.id)}
                      disabled={removingId === collaborator.id}
                    >
                      <X />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </EditorDialog>
  )
}
