"use client"

import { EditorDialog } from "@/components/editor/editor-dialog"
import { NodeShape } from "@/components/editor/node-shape"
import { CANVAS_TEMPLATES, type CanvasTemplate } from "@/components/editor/starter-templates"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getDefaultNodeSize, getNodeTextColor } from "@/types/canvas"

const PREVIEW_WIDTH = 240
const PREVIEW_HEIGHT = 140
const PREVIEW_PADDING = 16

interface PreviewNode {
  id: string
  left: number
  top: number
  width: number
  height: number
  color: string
  borderColor: string
  shape: CanvasTemplate["nodes"][number]["data"]["shape"]
}

interface PreviewLine {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
}

// Fits the template's node positions into a fixed-size viewport, with no
// React Flow instance involved - just scaled/centered CSS boxes and an SVG
// overlay for the edge lines.
function layoutPreview(template: CanvasTemplate): {
  nodes: PreviewNode[]
  lines: PreviewLine[]
} {
  const sizedNodes = template.nodes.map((node) => {
    const size = getDefaultNodeSize(node.data.shape)
    return {
      ...node,
      width: node.width ?? size.width,
      height: node.height ?? size.height,
    }
  })

  const minX = Math.min(...sizedNodes.map((node) => node.position.x))
  const minY = Math.min(...sizedNodes.map((node) => node.position.y))
  const maxX = Math.max(...sizedNodes.map((node) => node.position.x + node.width))
  const maxY = Math.max(...sizedNodes.map((node) => node.position.y + node.height))

  const boundsWidth = Math.max(maxX - minX, 1)
  const boundsHeight = Math.max(maxY - minY, 1)

  const scale = Math.min(
    (PREVIEW_WIDTH - PREVIEW_PADDING * 2) / boundsWidth,
    (PREVIEW_HEIGHT - PREVIEW_PADDING * 2) / boundsHeight
  )

  const offsetX = (PREVIEW_WIDTH - boundsWidth * scale) / 2
  const offsetY = (PREVIEW_HEIGHT - boundsHeight * scale) / 2

  const nodes: PreviewNode[] = sizedNodes.map((node) => ({
    id: node.id,
    left: offsetX + (node.position.x - minX) * scale,
    top: offsetY + (node.position.y - minY) * scale,
    width: node.width * scale,
    height: node.height * scale,
    color: node.data.color,
    borderColor: getNodeTextColor(node.data.color),
    shape: node.data.shape,
  }))

  const centerOf = (id: string) => {
    const node = nodes.find((entry) => entry.id === id)!
    return { x: node.left + node.width / 2, y: node.top + node.height / 2 }
  }

  const lines: PreviewLine[] = template.edges.map((edge) => {
    const from = centerOf(edge.source)
    const to = centerOf(edge.target)
    return { id: edge.id, x1: from.x, y1: from.y, x2: to.x, y2: to.y }
  })

  return { nodes, lines }
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  const { nodes, lines } = layoutPreview(template)

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-lg border border-surface-border bg-base"
      style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
    >
      <svg
        width={PREVIEW_WIDTH}
        height={PREVIEW_HEIGHT}
        className="absolute inset-0"
      >
        {lines.map((line) => (
          <line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="var(--border-default)"
            strokeWidth={1.5}
          />
        ))}
      </svg>
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute"
          style={{ left: node.left, top: node.top, width: node.width, height: node.height }}
        >
          <NodeShape
            shape={node.shape}
            width={node.width}
            height={node.height}
            fill={node.color}
            borderColor={node.borderColor}
          />
        </div>
      ))}
    </div>
  )
}

interface StarterTemplatesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (template: CanvasTemplate) => void
}

export function StarterTemplatesModal({
  open,
  onOpenChange,
  onImport,
}: StarterTemplatesModalProps) {
  const handleImport = (template: CanvasTemplate) => {
    onImport(template)
    onOpenChange(false)
  }

  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Start from a template"
      description="Import a starter diagram to replace the current canvas."
      contentClassName="sm:max-w-3xl"
    >
      <ScrollArea className="max-h-[60vh] pr-3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CANVAS_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="flex flex-col gap-3 rounded-xl border border-surface-border bg-subtle/40 p-3"
            >
              <TemplatePreview template={template} />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-copy-primary">
                  {template.name}
                </p>
                <p className="text-xs text-copy-muted">{template.description}</p>
              </div>
              <Button
                type="button"
                size="sm"
                className="mt-auto self-start"
                onClick={() => handleImport(template)}
              >
                Import
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </EditorDialog>
  )
}
