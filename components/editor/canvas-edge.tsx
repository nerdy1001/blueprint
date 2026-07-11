"use client"

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react"
import { EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from "@xyflow/react"

import { useCanvasEdgeActions } from "@/components/editor/canvas-edge-actions"
import type { CanvasEdge as CanvasEdgeType } from "@/types/canvas"

// Kept dim at rest, brightened on hover/select/edit - the visible stroke
// width never changes, only color, so hovering doesn't shift layout.
const STROKE_DIM = "rgba(248, 250, 252, 0.5)"
const STROKE_BRIGHT = "#f8fafc"

// A separate, wide, invisible path carries pointer events instead of the
// thin visible one - this is what makes hover/click easier without making
// the line itself thicker.
const INTERACTION_STROKE_WIDTH = 20

export function CanvasEdge({
  id,
  data,
  selected,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps<CanvasEdgeType>) {
  const { updateEdgeLabel } = useCanvasEdgeActions()
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draftLabel, setDraftLabel] = useState(data?.label ?? "")
  const inputRef = useRef<HTMLInputElement>(null)

  const label = data?.label ?? ""
  const isActive = selected || isHovered || isEditing

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
  })

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const startEditing = (event: ReactMouseEvent) => {
    event.stopPropagation()
    setDraftLabel(label)
    setIsEditing(true)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftLabel(event.target.value)
    updateEdgeLabel(id, event.target.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Keep canvas-level shortcuts (e.g. deleting the selected edge) from
    // firing while typing a label.
    event.stopPropagation()
    if (event.key === "Enter" || event.key === "Escape") {
      event.preventDefault()
      setIsEditing(false)
    }
  }

  const stopEventPropagation = (event: ReactMouseEvent) => {
    event.stopPropagation()
  }

  return (
    <>
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={INTERACTION_STROKE_WIDTH}
        style={{ pointerEvents: "stroke", cursor: "pointer" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={startEditing}
      />
      <path
        d={edgePath}
        fill="none"
        stroke={isActive ? STROKE_BRIGHT : STROKE_DIM}
        strokeWidth={1.5}
        strokeLinecap="round"
        markerEnd={markerEnd}
        style={{ pointerEvents: "none" }}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={stopEventPropagation}
          onDoubleClick={startEditing}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              value={draftLabel}
              size={Math.max(draftLabel.length, 1)}
              onChange={handleChange}
              onBlur={() => setIsEditing(false)}
              onKeyDown={handleKeyDown}
              className="rounded-full border border-surface-border bg-elevated px-2 py-0.5 text-center text-xs text-copy-primary outline-none"
            />
          ) : label ? (
            <span className="rounded-full border border-surface-border bg-elevated px-2 py-0.5 text-xs text-copy-primary shadow-sm">
              {label}
            </span>
          ) : isActive ? (
            <span className="pointer-events-none rounded-full px-2 py-0.5 text-xs text-copy-secondary opacity-60">
              Add label
            </span>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
