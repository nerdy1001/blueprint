"use client"

import type { ComponentType, DragEvent } from "react"
import { Circle, Cylinder, Diamond, Hexagon, Pill, Square } from "lucide-react"

import {
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

export function ShapePanel() {
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
  }

  return (
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
  )
}
