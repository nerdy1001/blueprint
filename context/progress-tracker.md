# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Design system foundation (`context/feature-specs/01-design-system.md`) — complete

## Current Goal

- Move to the next feature unit (see `context/feature-specs/` for what's next; none beyond `01-design-system.md` exist yet).

## Completed

- shadcn/ui installed and configured (`components.json`, style `radix-nova`, RSC, lucide icon library, `@/*` aliases).
- Added UI primitives: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea (`components/ui/*`, untouched post-generation).
- Installed `lucide-react`.
- Added `lib/utils.ts` with `cn()` (clsx + tailwind-merge).
- Wired the full dark theme token set from `context/ui-context.md` into `app/globals.css`, mapped both as app-level Tailwind utilities (`bg-base`, `text-copy-primary`, etc.) and onto the standard shadcn tokens (`--background`, `--primary`, `--card`, etc.) so `components/ui/*` renders the same palette.
- Forced dark mode by adding the `dark` class to `<html>` in `app/layout.tsx` (app is dark-only, no toggle).
- Verified: `npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass; visually verified via a temporary headless-browser smoke test (removed after use) — dark background, cyan brand accent, working Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea, no light-mode styling, no console errors.

## In Progress

- None.

## Next Up

- Await the next feature spec in `context/feature-specs/`.

## Open Questions

- None currently open.

## Architecture Decisions

- `context/ui-context.md`'s theme table only gave example Tailwind utility names (`bg-base`, `text-copy-primary`, etc.) without a full mapping for every token. Resolved by extending that table with an explicit "Tailwind Utility" column for every CSS variable, following the naming pattern implied by the given examples (e.g. `border-*` variables → `border-surface-border[-subtle]`, `text-*` variables → `text-copy-*`, state colors → `text-*`/`bg-*` pairs).
- App-level components use the custom tokens documented in `ui-context.md` (`bg-base`, `text-copy-primary`, ...). The shadcn tokens (`bg-primary`, `text-foreground`, `border-border`, ...) remain reserved for use inside `components/ui/*`, both point at the same dark palette so they render identically.

## Session Notes

- shadcn CLI (v4.13.0) uses a new preset system; installed with the "Nova" preset (`Lucide / Geist`), which matches the project's existing icon/font choices, and the `radix` base library (Radix UI primitives via the unified `radix-ui` package) rather than the newer non-Radix `base` option.
- Do not modify `components/ui/*` — per `context/ai-workflow-rules.md`, project-specific styling belongs in app-level components instead.
