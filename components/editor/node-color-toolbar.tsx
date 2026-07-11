"use client"

import { type MouseEvent } from "react"

import { cn } from "@/lib/utils"
import { NODE_COLORS } from "@/types/canvas"

interface NodeColorToolbarProps {
  activeColor: string
  onSelect: (color: string) => void
}

// Floats above a selected node (via the node's own `relative` wrapper).
// `nodrag nopan` + stopping mousedown keep swatch clicks from starting a
// node drag or a canvas pan, same escape hatch used by the label textarea.
export function NodeColorToolbar({ activeColor, onSelect }: NodeColorToolbarProps) {
  const stopEventPropagation = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return (
    <div
      className="nodrag nopan absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2"
      onMouseDown={stopEventPropagation}
      onDoubleClick={stopEventPropagation}
    >
      <div className="flex items-center gap-1.5 rounded-full border border-surface-border bg-elevated p-1.5 shadow-xl">
        {NODE_COLORS.map((pair) => {
          const isActive = pair.fill === activeColor
          return (
            <button
              key={pair.fill}
              type="button"
              aria-label={`Set node color to ${pair.text} on ${pair.fill}`}
              aria-pressed={isActive}
              onClick={() => onSelect(pair.fill)}
              style={
                {
                  backgroundColor: pair.fill,
                  borderColor: isActive ? pair.text : "transparent",
                  "--swatch-glow": pair.text,
                } as React.CSSProperties
              }
              className={cn(
                "h-5 w-5 shrink-0 cursor-pointer rounded-full border-2 transition-transform hover:scale-110 hover:shadow-[0_0_6px_0_var(--swatch-glow)]",
                isActive && "scale-110"
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
