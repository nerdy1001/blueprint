"use client"

import { createContext, useContext } from "react"

interface CanvasNodeActions {
  updateNodeLabel: (nodeId: string, label: string) => void
  updateNodeColor: (nodeId: string, color: string) => void
}

const CanvasNodeActionsContext = createContext<CanvasNodeActions | null>(null)

export const CanvasNodeActionsProvider = CanvasNodeActionsContext.Provider

// Lets a custom node dispatch label updates through the same
// useLiveblocksFlow-backed onNodesChange used everywhere else, without
// threading the callback through nodeTypes props.
export function useCanvasNodeActions(): CanvasNodeActions {
  const context = useContext(CanvasNodeActionsContext)
  if (!context) {
    throw new Error(
      "useCanvasNodeActions must be used within a CanvasNodeActionsProvider"
    )
  }
  return context
}
