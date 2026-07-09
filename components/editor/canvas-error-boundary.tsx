"use client"

import { Component, type ReactNode } from "react"

export function CanvasErrorFallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-base px-4 text-center">
      <p className="text-sm text-copy-primary">
        Couldn&apos;t connect to the canvas.
      </p>
      <p className="text-xs text-copy-muted">
        Refresh the page to try again.
      </p>
    </div>
  )
}

interface CanvasErrorBoundaryProps {
  children: ReactNode
}

interface CanvasErrorBoundaryState {
  hasError: boolean
}

export class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  state: CanvasErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): CanvasErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <CanvasErrorFallback />
    }

    return this.props.children
  }
}
