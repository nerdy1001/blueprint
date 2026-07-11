"use client"

import type { ReactNode } from "react"
import { Maximize, Redo2, Undo2, ZoomIn, ZoomOut } from "lucide-react"

import { cn } from "@/lib/utils"

interface ControlButtonProps {
  onClick: () => void
  disabled?: boolean
  label: string
  children: ReactNode
}

function ControlButton({ onClick, disabled, label, children }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full text-copy-secondary transition-colors hover:bg-subtle hover:text-copy-primary",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      {children}
    </button>
  )
}

interface CanvasControlBarProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onFitView: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

// Floating pill at the bottom-left, above the shape panel in stacking order.
// Zoom group on the left, a thin divider, history group on the right.
export function CanvasControlBar({
  onZoomIn,
  onZoomOut,
  onFitView,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: CanvasControlBarProps) {
  return (
    <div className="pointer-events-auto absolute bottom-6 left-6 z-20 flex items-center gap-1 rounded-full border border-surface-border bg-elevated p-2 shadow-xl">
      <ControlButton onClick={onZoomOut} label="Zoom out">
        <ZoomOut className="h-5 w-5" />
      </ControlButton>
      <ControlButton onClick={onFitView} label="Fit view">
        <Maximize className="h-5 w-5" />
      </ControlButton>
      <ControlButton onClick={onZoomIn} label="Zoom in">
        <ZoomIn className="h-5 w-5" />
      </ControlButton>
      <div className="mx-1 h-5 w-px bg-surface-border" />
      <ControlButton onClick={onUndo} disabled={!canUndo} label="Undo">
        <Undo2 className="h-5 w-5" />
      </ControlButton>
      <ControlButton onClick={onRedo} disabled={!canRedo} label="Redo">
        <Redo2 className="h-5 w-5" />
      </ControlButton>
    </div>
  )
}
