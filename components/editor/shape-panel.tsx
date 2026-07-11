"use client"

import { useRef, useState, type ComponentType, type DragEvent } from "react"
import { Circle, Cylinder, Diamond, Hexagon, Pill, Square } from "lucide-react"

import { NodeShape } from "@/components/editor/node-shape"
import {
  DEFAULT_NODE_COLOR,
  NODE_SHAPES,
  SHAPE_DRAG_MIME_TYPE,
  type CanvasNodeShape,
  type NodeShapeDefinition,
  type ShapeDragPayload,
} from "@/types/canvas"

const SHAPE_ICONS: Record<CanvasNodeShape, ComponentType<{ className?: string }>> = {
  rectangle: Square,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Cylinder,
  hexagon: Hexagon,
}

// A 1x1 transparent GIF, used to suppress the browser's default drag
// thumbnail so our own cursor-following ghost preview is what's visible.
const TRANSPARENT_DRAG_IMAGE =
  typeof Image !== "undefined" ? new Image() : undefined
if (TRANSPARENT_DRAG_IMAGE) {
  TRANSPARENT_DRAG_IMAGE.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
}

interface DragPreview {
  shape: CanvasNodeShape
  width: number
  height: number
  x: number
  y: number
}

export function ShapePanel() {
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null)
  const dragPreviewRef = useRef<DragPreview | null>(null)

  const handleDragStart = (
    event: DragEvent<HTMLButtonElement>,
    shapeDef: NodeShapeDefinition
  ) => {
    const payload: ShapeDragPayload = {
      shape: shapeDef.shape,
      width: shapeDef.defaultSize.width,
      height: shapeDef.defaultSize.height,
    }
    event.dataTransfer.setData(SHAPE_DRAG_MIME_TYPE, JSON.stringify(payload))
    event.dataTransfer.effectAllowed = "copy"
    if (TRANSPARENT_DRAG_IMAGE) {
      event.dataTransfer.setDragImage(TRANSPARENT_DRAG_IMAGE, 0, 0)
    }

    const preview: DragPreview = {
      shape: shapeDef.shape,
      width: shapeDef.defaultSize.width,
      height: shapeDef.defaultSize.height,
      x: event.clientX,
      y: event.clientY,
    }
    dragPreviewRef.current = preview
    setDragPreview(preview)
  }

  const handleDrag = (event: DragEvent<HTMLButtonElement>) => {
    // Browsers fire a final `drag` event with clientX/clientY pinned to 0
    // right before `dragend` — ignore it so the ghost doesn't jump to the
    // corner for a frame.
    if (event.clientX === 0 && event.clientY === 0) return
    const current = dragPreviewRef.current
    if (!current) return
    const next = { ...current, x: event.clientX, y: event.clientY }
    dragPreviewRef.current = next
    setDragPreview(next)
  }

  const handleDragEnd = () => {
    dragPreviewRef.current = null
    setDragPreview(null)
  }

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-surface-border bg-elevated p-2 shadow-xl">
          {NODE_SHAPES.map((shapeDef) => {
            const Icon = SHAPE_ICONS[shapeDef.shape]
            return (
              <button
                key={shapeDef.shape}
                type="button"
                draggable
                onDragStart={(event) => handleDragStart(event, shapeDef)}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                title={shapeDef.label}
                aria-label={`Drag to add a ${shapeDef.label} shape`}
                className="flex h-10 w-10 cursor-grab items-center justify-center rounded-full text-copy-secondary transition-colors hover:bg-subtle hover:text-copy-primary active:cursor-grabbing"
              >
                <Icon className="h-5 w-5" />
              </button>
            )
          })}
        </div>
      </div>
      {dragPreview && (
        <div
          className="pointer-events-none fixed z-50 opacity-70"
          style={{
            left: dragPreview.x - dragPreview.width / 2,
            top: dragPreview.y - dragPreview.height / 2,
            width: dragPreview.width,
            height: dragPreview.height,
          }}
        >
          <NodeShape
            shape={dragPreview.shape}
            width={dragPreview.width}
            height={dragPreview.height}
            fill={DEFAULT_NODE_COLOR}
            borderColor="var(--border-default)"
          />
        </div>
      )}
    </>
  )
}
