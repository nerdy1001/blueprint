"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"

import { getNodeTextColor, type CanvasNode as CanvasNodeType } from "@/types/canvas"

// Basic renderer: every shape draws as a bordered rectangle with a centered
// label for now. Shape-specific visuals (diamond/circle/pill/cylinder/hexagon
// outlines) are a later unit.
export function CanvasNode({ data, width, height, selected }: NodeProps<CanvasNodeType>) {
  const textColor = getNodeTextColor(data.color)

  const handleClassName =
    "!h-2 !w-2 !border-none !bg-white !opacity-0 transition-opacity group-hover:!opacity-100"

  return (
    <div
      className="group relative flex items-center justify-center rounded-lg border px-3 py-2 text-center text-sm"
      style={{
        width: width ?? undefined,
        height: height ?? undefined,
        backgroundColor: data.color,
        color: textColor,
        borderColor: selected ? textColor : "var(--border-default)",
      }}
    >
      <Handle type="source" position={Position.Top} className={handleClassName} />
      <Handle type="source" position={Position.Right} className={handleClassName} />
      <Handle type="source" position={Position.Bottom} className={handleClassName} />
      <Handle type="source" position={Position.Left} className={handleClassName} />
      <span className="truncate">{data.label}</span>
    </div>
  )
}
