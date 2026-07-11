"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react"

import type { CanvasTemplate } from "@/components/editor/starter-templates"

type ImportTemplateHandler = (template: CanvasTemplate) => void

const CanvasTemplateActionsContext =
  createContext<RefObject<ImportTemplateHandler | null> | null>(null)

// Bridges the navbar's "Starter templates" button (an ancestor of the canvas,
// mounted in EditorShell) to the canvas's actual import implementation (a
// descendant, mounted deep inside CanvasInner via the page's children prop).
// A ref keeps this a plain callback registration rather than a piece of
// shared React state.
export function CanvasTemplateActionsProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<ImportTemplateHandler | null>(null)
  return (
    <CanvasTemplateActionsContext.Provider value={handlerRef}>
      {children}
    </CanvasTemplateActionsContext.Provider>
  )
}

// Called by the canvas to register the function that actually clears and
// imports a template.
export function useRegisterTemplateImportHandler(handler: ImportTemplateHandler) {
  const ref = useContext(CanvasTemplateActionsContext)
  useEffect(() => {
    if (!ref) return
    ref.current = handler
    return () => {
      if (ref.current === handler) ref.current = null
    }
  }, [ref, handler])
}

// Called by the navbar/modal to trigger the import.
export function useCanvasTemplateImport(): ImportTemplateHandler {
  const ref = useContext(CanvasTemplateActionsContext)
  return (template) => ref?.current?.(template)
}
