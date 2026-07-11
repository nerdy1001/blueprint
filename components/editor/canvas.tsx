"use client"

import { useCallback, type DragEvent } from "react"
import { useCanRedo, useCanUndo, useRedo, useUndo } from "@liveblocks/react"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type DefaultEdgeOptions,
} from "@xyflow/react"

import { CanvasControlBar } from "@/components/editor/canvas-control-bar"
import { CanvasEdge as CanvasEdgeRenderer } from "@/components/editor/canvas-edge"
import { CanvasEdgeActionsProvider } from "@/components/editor/canvas-edge-actions"
import { CanvasNode as CanvasNodeRenderer } from "@/components/editor/canvas-node"
import { CanvasNodeActionsProvider } from "@/components/editor/canvas-node-actions"
import { useRegisterTemplateImportHandler } from "@/components/editor/canvas-template-actions"
import { ShapePanel } from "@/components/editor/shape-panel"
import { instantiateTemplate, type CanvasTemplate } from "@/components/editor/starter-templates"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import {
  DEFAULT_NODE_COLOR,
  SHAPE_DRAG_MIME_TYPE,
  type CanvasEdge,
  type CanvasNode,
  type ShapeDragPayload,
} from "@/types/canvas"

import "@xyflow/react/dist/style.css"

const nodeTypes = { canvasNode: CanvasNodeRenderer }
const edgeTypes = { canvasEdge: CanvasEdgeRenderer }

// New connections render via the custom edge renderer with a light stroke
// and an arrowhead, per ui-context.md's Edge Style.
const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "canvasEdge",
  markerEnd: { type: MarkerType.ArrowClosed, color: "#f8fafc" },
}

let nodeIdCounter = 0

function CanvasInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      nodes: { initial: [] },
      edges: { initial: [] },
      suspense: true,
    })
  const reactFlowInstance = useReactFlow()
  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = reactFlowInstance

  const undo = useUndo()
  const redo = useRedo()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  useKeyboardShortcuts({ reactFlowInstance, undo, redo })

  const handleZoomIn = useCallback(() => zoomIn({ duration: 200 }), [zoomIn])
  const handleZoomOut = useCallback(() => zoomOut({ duration: 200 }), [zoomOut])
  const handleFitView = useCallback(() => fitView({ duration: 200 }), [fitView])

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }, [])

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const raw = event.dataTransfer.getData(SHAPE_DRAG_MIME_TYPE)
      if (!raw) return

      const payload = JSON.parse(raw) as ShapeDragPayload
      const center = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      nodeIdCounter += 1
      const id = `${payload.shape}-${Date.now()}-${nodeIdCounter}`

      const newNode: CanvasNode = {
        id,
        type: "canvasNode",
        position: {
          x: center.x - payload.width / 2,
          y: center.y - payload.height / 2,
        },
        width: payload.width,
        height: payload.height,
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR,
          shape: payload.shape,
        },
      }

      onNodesChange([{ type: "add", item: newNode }])
    },
    [onNodesChange, screenToFlowPosition]
  )

  const updateNodeLabel = useCallback(
    (nodeId: string, label: string) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return
      onNodesChange([
        { id: nodeId, type: "replace", item: { ...node, data: { ...node.data, label } } },
      ])
    },
    [nodes, onNodesChange]
  )

  const updateNodeColor = useCallback(
    (nodeId: string, color: string) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return
      onNodesChange([
        { id: nodeId, type: "replace", item: { ...node, data: { ...node.data, color } } },
      ])
    },
    [nodes, onNodesChange]
  )

  const updateEdgeLabel = useCallback(
    (edgeId: string, label: string) => {
      const edge = edges.find((e) => e.id === edgeId)
      if (!edge) return
      onEdgesChange([
        { id: edgeId, type: "replace", item: { ...edge, data: { ...edge.data, label } } },
      ])
    },
    [edges, onEdgesChange]
  )

  const importTemplate = useCallback(
    (template: CanvasTemplate) => {
      const { nodes: templateNodes, edges: templateEdges } = instantiateTemplate(template)

      // useLiveblocksFlow's onNodesChange/onEdgesChange treat a "remove"
      // NodeChange/EdgeChange as a no-op (only "add"/"replace" are wired up)
      // - onDelete is the mutation that actually deletes from storage.
      onDelete({ nodes, edges })
      onNodesChange(templateNodes.map((item) => ({ type: "add" as const, item })))
      onEdgesChange(templateEdges.map((item) => ({ type: "add" as const, item })))

      // Wait a frame so the new nodes are rendered/measured before fitting -
      // fitView reads each node's current DOM dimensions.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => fitView({ duration: 200 }))
      })
    },
    [nodes, edges, onDelete, onNodesChange, onEdgesChange, fitView]
  )

  useRegisterTemplateImportHandler(importTemplate)

  return (
    <CanvasNodeActionsProvider value={{ updateNodeLabel, updateNodeColor }}>
      <CanvasEdgeActionsProvider value={{ updateEdgeLabel }}>
        <div
          className="relative h-full w-full"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionMode={ConnectionMode.Loose}
            colorMode="dark"
            fitView
            className="bg-base"
          >
            <Background variant={BackgroundVariant.Dots} />
          </ReactFlow>
          <CanvasControlBar
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFitView={handleFitView}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
          <ShapePanel />
        </div>
      </CanvasEdgeActionsProvider>
    </CanvasNodeActionsProvider>
  )
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  )
}
