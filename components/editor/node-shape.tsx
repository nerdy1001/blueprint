import type { ReactNode } from "react"

import type { CanvasNodeShape } from "@/types/canvas"

interface NodeShapeProps {
  shape: CanvasNodeShape
  width: number
  height: number
  fill: string
  borderColor: string
}

const STROKE_WIDTH = 1.5

// Rectangle, pill, and circle are plain CSS-styled boxes. Diamond, hexagon,
// and cylinder render as inline SVG (scaled to the node's box via viewBox)
// since their outlines can't be expressed with CSS borders/border-radius.
export function NodeShape({ shape, width, height, fill, borderColor }: NodeShapeProps) {
  switch (shape) {
    case "rectangle":
      return (
        <div
          className="h-full w-full rounded-lg border"
          style={{ backgroundColor: fill, borderColor }}
        />
      )
    case "pill":
    case "circle":
      return (
        <div
          className="h-full w-full rounded-full border"
          style={{ backgroundColor: fill, borderColor }}
        />
      )
    case "diamond":
      return (
        <SvgShape width={width} height={height}>
          <polygon
            points={`${width / 2},${STROKE_WIDTH} ${width - STROKE_WIDTH},${height / 2} ${width / 2},${height - STROKE_WIDTH} ${STROKE_WIDTH},${height / 2}`}
            fill={fill}
            stroke={borderColor}
            strokeWidth={STROKE_WIDTH}
            strokeLinejoin="round"
          />
        </SvgShape>
      )
    case "hexagon":
      return (
        <SvgShape width={width} height={height}>
          <polygon
            points={`${width * 0.25},${STROKE_WIDTH} ${width * 0.75},${STROKE_WIDTH} ${width - STROKE_WIDTH},${height / 2} ${width * 0.75},${height - STROKE_WIDTH} ${width * 0.25},${height - STROKE_WIDTH} ${STROKE_WIDTH},${height / 2}`}
            fill={fill}
            stroke={borderColor}
            strokeWidth={STROKE_WIDTH}
            strokeLinejoin="round"
          />
        </SvgShape>
      )
    case "cylinder": {
      const rx = width / 2 - STROKE_WIDTH / 2
      const ry = Math.min(height * 0.18, rx * 0.8)
      const bodyPath = `M${STROKE_WIDTH / 2},${ry} A${rx},${ry} 0 0 1 ${width - STROKE_WIDTH / 2},${ry} L${width - STROKE_WIDTH / 2},${height - ry} A${rx},${ry} 0 0 1 ${STROKE_WIDTH / 2},${height - ry} Z`
      return (
        <SvgShape width={width} height={height}>
          <path d={bodyPath} fill={fill} stroke={borderColor} strokeWidth={STROKE_WIDTH} />
          <ellipse
            cx={width / 2}
            cy={ry}
            rx={rx}
            ry={ry}
            fill={fill}
            stroke={borderColor}
            strokeWidth={STROKE_WIDTH}
          />
        </SvgShape>
      )
    }
  }
}

function SvgShape({
  width,
  height,
  children,
}: {
  width: number
  height: number
  children: ReactNode
}) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="block"
    >
      {children}
    </svg>
  )
}
