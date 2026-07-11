"use client"

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react"
import { Handle, NodeResizer, Position, type NodeProps } from "@xyflow/react"

import { useCanvasNodeActions } from "@/components/editor/canvas-node-actions"
import { NodeColorToolbar } from "@/components/editor/node-color-toolbar"
import { NodeShape } from "@/components/editor/node-shape"
import {
  getDefaultNodeSize,
  getNodeTextColor,
  MIN_NODE_SIZE,
  type CanvasNode as CanvasNodeType,
} from "@/types/canvas"

const handleClassName =
  "!h-2 !w-2 !rounded-full !border !border-base !bg-white !opacity-0 transition-opacity group-hover:!opacity-100"

// Small white squares (vs. the circular connection handles), only shown for
// the selected node - kept subtle via NodeResizer's own default sizing.
const resizerHandleClassName =
  "!h-2 !w-2 !rounded-[2px] !border !border-surface-border !bg-white"

// Rectangle/pill/circle render via CSS in NodeShape; diamond/hexagon/cylinder
// render as scaled inline SVG there. The label is a separate overlay since
// SVG text doesn't truncate/center as cleanly as a flex div.
export function CanvasNode({ id, data, width, height, selected }: NodeProps<CanvasNodeType>) {
  const { updateNodeLabel, updateNodeColor } = useCanvasNodeActions()
  const [isEditing, setIsEditing] = useState(false)
  const [draftLabel, setDraftLabel] = useState(data.label)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const textColor = getNodeTextColor(data.color)
  const defaultSize = getDefaultNodeSize(data.shape)
  const w = width ?? defaultSize.width
  const h = height ?? defaultSize.height
  const borderColor = selected ? textColor : "var(--border-default)"

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus()
      textareaRef.current?.select()
    }
  }, [isEditing])

  const startEditing = () => {
    setDraftLabel(data.label)
    setIsEditing(true)
  }

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDraftLabel(event.target.value)
    updateNodeLabel(id, event.target.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Keep canvas-level shortcuts (e.g. deleting the selected node) from
    // firing while typing a label.
    event.stopPropagation()
    if (event.key === "Escape") {
      event.preventDefault()
      setIsEditing(false)
    }
  }

  const stopEventPropagation = (event: MouseEvent<HTMLTextAreaElement>) => {
    event.stopPropagation()
  }

  return (
    <div
      className="group relative"
      style={{ width: w, height: h }}
      onDoubleClick={isEditing ? undefined : startEditing}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={MIN_NODE_SIZE.width}
        minHeight={MIN_NODE_SIZE.height}
        handleClassName={resizerHandleClassName}
        lineClassName="!border-none"
      />
      {selected && (
        <NodeColorToolbar
          activeColor={data.color}
          onSelect={(color) => updateNodeColor(id, color)}
        />
      )}
      <Handle type="source" position={Position.Top} className={handleClassName} />
      <Handle type="source" position={Position.Right} className={handleClassName} />
      <Handle type="source" position={Position.Bottom} className={handleClassName} />
      <Handle type="source" position={Position.Left} className={handleClassName} />
      <NodeShape shape={data.shape} width={w} height={h} fill={data.color} borderColor={borderColor} />
      {isEditing ? (
        <div className="nodrag nopan absolute inset-0 flex items-center justify-center px-6">
          <textarea
            ref={textareaRef}
            value={draftLabel}
            onChange={handleChange}
            onBlur={() => setIsEditing(false)}
            onKeyDown={handleKeyDown}
            onMouseDown={stopEventPropagation}
            placeholder="Label"
            rows={1}
            className="max-h-full w-full resize-none bg-transparent text-center text-sm outline-none"
            style={{ color: textColor }}
          />
        </div>
      ) : (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-sm"
          style={{ color: textColor, opacity: data.label ? 1 : 0.5 }}
        >
          <span className="truncate">{data.label || "Double-click to add a label"}</span>
        </div>
      )}
    </div>
  )
}
