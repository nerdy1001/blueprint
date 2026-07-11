import type { Edge, Node } from "@xyflow/react"

export type CanvasNodeShape =
  | "rectangle"
  | "diamond"
  | "circle"
  | "pill"
  | "cylinder"
  | "hexagon"

export interface CanvasNodeData extends Record<string, unknown> {
  label: string
  color: string
  shape: CanvasNodeShape
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">

export interface CanvasEdgeData extends Record<string, unknown> {
  label?: string
}

export type CanvasEdge = Edge<CanvasEdgeData, "canvasEdge">

export interface NodeColorPair {
  fill: string
  text: string
}

// 8 defined color pairs (dark fill + contrasting text), per ui-context.md.
export const NODE_COLORS: NodeColorPair[] = [
  { fill: "#1F1F1F", text: "#EDEDED" },
  { fill: "#10233D", text: "#52A8FF" },
  { fill: "#2E1938", text: "#BF7AF0" },
  { fill: "#331B00", text: "#FF990A" },
  { fill: "#3C1618", text: "#FF6166" },
  { fill: "#3A1726", text: "#F75F8F" },
  { fill: "#0F2E18", text: "#62C073" },
  { fill: "#062822", text: "#0AC7B4" },
]

export const DEFAULT_NODE_COLOR = NODE_COLORS[0].fill

export function getNodeTextColor(fill: string): string {
  return (
    NODE_COLORS.find((pair) => pair.fill === fill)?.text ?? NODE_COLORS[0].text
  )
}

export interface NodeSize {
  width: number
  height: number
}

export interface NodeShapeDefinition {
  shape: CanvasNodeShape
  label: string
  defaultSize: NodeSize
}

// 6 supported shapes, per ui-context.md. Rectangles are wider than tall,
// circles are square, and diamonds are sized up so their inscribed area
// still leaves room for a label.
export const NODE_SHAPES: NodeShapeDefinition[] = [
  { shape: "rectangle", label: "Rectangle", defaultSize: { width: 160, height: 80 } },
  { shape: "diamond", label: "Diamond", defaultSize: { width: 180, height: 180 } },
  { shape: "circle", label: "Circle", defaultSize: { width: 100, height: 100 } },
  { shape: "pill", label: "Pill", defaultSize: { width: 160, height: 56 } },
  { shape: "cylinder", label: "Cylinder", defaultSize: { width: 120, height: 100 } },
  { shape: "hexagon", label: "Hexagon", defaultSize: { width: 160, height: 100 } },
]

export function getDefaultNodeSize(shape: CanvasNodeShape): NodeSize {
  return (
    NODE_SHAPES.find((entry) => entry.shape === shape)?.defaultSize ??
    NODE_SHAPES[0].defaultSize
  )
}

// Floor for interactive resizing - keeps a node large enough to stay
// legible and grabbable regardless of shape.
export const MIN_NODE_SIZE: NodeSize = { width: 60, height: 40 }

export const SHAPE_DRAG_MIME_TYPE = "application/x-blueprint-shape"

export interface ShapeDragPayload {
  shape: CanvasNodeShape
  width: number
  height: number
}
