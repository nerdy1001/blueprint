"use client"

import { createContext, useContext } from "react"

interface CanvasEdgeActions {
  updateEdgeLabel: (edgeId: string, label: string) => void
}

const CanvasEdgeActionsContext = createContext<CanvasEdgeActions | null>(null)

export const CanvasEdgeActionsProvider = CanvasEdgeActionsContext.Provider

// Lets the custom edge dispatch label updates through the same
// useLiveblocksFlow-backed onEdgesChange used everywhere else, without
// threading the callback through edgeTypes props.
export function useCanvasEdgeActions(): CanvasEdgeActions {
  const context = useContext(CanvasEdgeActionsContext)
  if (!context) {
    throw new Error(
      "useCanvasEdgeActions must be used within a CanvasEdgeActionsProvider"
    )
  }
  return context
}
