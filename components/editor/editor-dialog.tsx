"use client"

import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  footer?: React.ReactNode
  children?: React.ReactNode
}

export function EditorDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
}: EditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 rounded-3xl border border-surface-border bg-elevated p-6 text-copy-primary ring-0 sm:max-w-md">
        <DialogHeader className="gap-1.5">
          <DialogTitle className="text-copy-primary">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-copy-muted">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        {footer && (
          <DialogFooter className="-mx-6 -mb-6 border-surface-border bg-transparent p-6 pt-0">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
