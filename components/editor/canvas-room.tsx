"use client"

import { useState, type ReactNode } from "react"
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  useErrorListener,
} from "@liveblocks/react"

import { Canvas } from "@/components/editor/canvas"
import {
  CanvasErrorBoundary,
  CanvasErrorFallback,
} from "@/components/editor/canvas-error-boundary"

function CanvasLoading() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-base px-4 text-center">
      <p className="text-sm text-copy-muted">Loading canvas…</p>
    </div>
  )
}

// Liveblocks connection/auth failures (e.g. a bad or missing
// LIVEBLOCKS_SECRET_KEY) are reported asynchronously via useErrorListener,
// not by throwing into the render tree, so a normal ErrorBoundary never
// catches them - the ClientSideSuspense fallback would otherwise be stuck
// on "Loading canvas..." forever.
function CanvasConnectionGuard({ children }: { children: ReactNode }) {
  const [hasConnectionError, setHasConnectionError] = useState(false)

  useErrorListener(() => setHasConnectionError(true))

  if (hasConnectionError) {
    return <CanvasErrorFallback />
  }

  return children
}

export function CanvasRoom({ roomId }: { roomId: string }) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId} initialPresence={{ cursor: null, isThinking: false }}>
        <CanvasConnectionGuard>
          <CanvasErrorBoundary>
            <ClientSideSuspense fallback={<CanvasLoading />}>
              <Canvas />
            </ClientSideSuspense>
          </CanvasErrorBoundary>
        </CanvasConnectionGuard>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
