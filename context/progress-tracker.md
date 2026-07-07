# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Design system foundation (`context/feature-specs/01-design-system.md`) — complete
- Editor chrome shell (`context/feature-specs/02-editor.md`) — complete

## Current Goal

- Move to the next feature unit (see `context/feature-specs/` for what's next; none beyond `02-editor.md` exist yet).

## Completed

- shadcn/ui installed and configured (`components.json`, style `radix-nova`, RSC, lucide icon library, `@/*` aliases).
- Added UI primitives: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea (`components/ui/*`, untouched post-generation).
- Installed `lucide-react`.
- Added `lib/utils.ts` with `cn()` (clsx + tailwind-merge).
- Wired the full dark theme token set from `context/ui-context.md` into `app/globals.css`, mapped both as app-level Tailwind utilities (`bg-base`, `text-copy-primary`, etc.) and onto the standard shadcn tokens (`--background`, `--primary`, `--card`, etc.) so `components/ui/*` renders the same palette.
- Forced dark mode by adding the `dark` class to `<html>` in `app/layout.tsx` (app is dark-only, no toggle).
- Verified: `npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass; visually verified via a temporary headless-browser smoke test (removed after use) — dark background, cyan brand accent, working Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea, no light-mode styling, no console errors.
- Editor chrome shell (`context/feature-specs/02-editor.md`):
  - `components/editor/editor-navbar.tsx` — fixed `h-14` top bar, left/center/right sections, sidebar toggle button swapping `PanelLeftOpen`/`PanelLeftClose` based on an `isSidebarOpen` prop, `bg-elevated` with bottom border. Center/right sections render as empty placeholders (spec only defines behavior for the left section and says the right stays empty "for now").
  - `components/editor/project-sidebar.tsx` — floating overlay (`fixed`, not in flow) that slides in/out via `translate-x` transform driven by an `isOpen` prop, positioned below the navbar. Header with title + close button, shadcn `Tabs` ("My projects" / "Shared") each with an empty placeholder state, full-width `New Project` button with a `Plus` icon at the bottom.
  - `components/editor/editor-dialog.tsx` — reusable dialog pattern wrapping `components/ui/dialog.tsx` primitives, restyled with app tokens (`bg-elevated`, `border-surface-border`, `rounded-3xl`). Takes `title`, optional `description`, `footer`, and `children` (body). No concrete dialog instances built yet, per spec.
  - Verified: `npx tsc --noEmit` and `npm run lint` pass; visually verified via a temporary route + headless-browser (Playwright + system Edge) smoke test (removed after use) — navbar renders with working toggle, sidebar slides in/out without pushing canvas content, tabs and empty states render, dialog opens centered with title/description/footer styled in the dark palette, no console errors.

## In Progress

- None.

## Next Up

- Await the next feature spec in `context/feature-specs/` (likely wiring this chrome into an actual editor route/page, plus the canvas itself, and the first concrete dialog built on the `EditorDialog` pattern).

## Open Questions

- None currently open.

## Architecture Decisions

- `context/ui-context.md`'s theme table only gave example Tailwind utility names (`bg-base`, `text-copy-primary`, etc.) without a full mapping for every token. Resolved by extending that table with an explicit "Tailwind Utility" column for every CSS variable, following the naming pattern implied by the given examples (e.g. `border-*` variables → `border-surface-border[-subtle]`, `text-*` variables → `text-copy-*`, state colors → `text-*`/`bg-*` pairs).
- App-level components use the custom tokens documented in `ui-context.md` (`bg-base`, `text-copy-primary`, ...). The shadcn tokens (`bg-primary`, `text-foreground`, `border-border`, ...) remain reserved for use inside `components/ui/*`, both point at the same dark palette so they render identically.

## Session Notes

- shadcn CLI (v4.13.0) uses a new preset system; installed with the "Nova" preset (`Lucide / Geist`), which matches the project's existing icon/font choices, and the `radix` base library (Radix UI primitives via the unified `radix-ui` package) rather than the newer non-Radix `base` option.
- Do not modify `components/ui/*` — per `context/ai-workflow-rules.md`, project-specific styling belongs in app-level components instead.
- Next.js app router treats any `app/` folder prefixed with `_` as a private, non-routable segment — a temporary smoke-test route must use a plain folder name (e.g. `app/smoke-test/`) or it 404s.
