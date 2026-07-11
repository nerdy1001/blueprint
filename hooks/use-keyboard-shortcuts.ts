"use client"

import { useEffect } from "react"
import type { ReactFlowInstance } from "@xyflow/react"

const ZOOM_DURATION = 200

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable
}

interface UseKeyboardShortcutsOptions {
  reactFlowInstance: ReactFlowInstance | null
  undo: () => void
  redo: () => void
}

// Global shortcuts for the canvas control bar's actions: +/- for zoom,
// Cmd/Ctrl+Z (and Shift+Z / Y variants) for Liveblocks undo/redo.
export function useKeyboardShortcuts({
  reactFlowInstance,
  undo,
  redo,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return

      const isModPressed = event.metaKey || event.ctrlKey

      if (isModPressed && event.key.toLowerCase() === "z") {
        event.preventDefault()
        if (event.shiftKey) {
          redo()
        } else {
          undo()
        }
        return
      }

      if (isModPressed && event.key.toLowerCase() === "y") {
        event.preventDefault()
        redo()
        return
      }

      if (isModPressed) return

      if (event.key === "+" || event.key === "=") {
        event.preventDefault()
        reactFlowInstance?.zoomIn({ duration: ZOOM_DURATION })
        return
      }

      if (event.key === "-") {
        event.preventDefault()
        reactFlowInstance?.zoomOut({ duration: ZOOM_DURATION })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [reactFlowInstance, undo, redo])
}
