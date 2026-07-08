# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Design system foundation (`context/feature-specs/01-design-system.md`) — complete
- Editor chrome shell (`context/feature-specs/02-editor.md`) — complete
- Auth (`context/feature-specs/03-auth.md`) — complete

## Current Goal

- Move to the next feature unit (see `context/feature-specs/` for what's next; none beyond `03-auth.md` exist yet).

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
- Auth (`context/feature-specs/03-auth.md`):
  - Installed `@clerk/ui` (peer of the already-installed `@clerk/nextjs`), needed for the `dark` base theme import.
  - `lib/clerk-appearance.ts` — shared Clerk `Appearance` config (`theme: dark` from `@clerk/ui/themes`, `variables` mapped entirely to the app's existing CSS custom properties via `var(--...)` — no hardcoded colors), passed to `ClerkProvider` so it cascades to `SignIn`, `SignUp`, and `UserButton` alike.
  - `app/layout.tsx` — wrapped in `ClerkProvider appearance={clerkAppearance}`.
  - `proxy.ts` (project root) — this Next.js version (16.2.10) renamed `middleware.ts` to `proxy.ts` (same underlying mechanism/type, `NextMiddleware`); uses `clerkMiddleware` + `createRouteMatcher` from `@clerk/nextjs/server`. Public routes are derived from `NEXT_PUBLIC_CLERK_SIGN_IN_URL`/`NEXT_PUBLIC_CLERK_SIGN_UP_URL` (added to `.env.local` as `/sign-in`/`/sign-up` — they weren't set previously); everything else calls `auth.protect()`.
  - `app/page.tsx` — now an async Server Component: authenticated users `redirect("/editor")`, unauthenticated `redirect("/sign-in")` (belt-and-suspenders alongside the proxy-level redirect, per spec).
  - `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` — catch-all optional routes (required by Clerk's own internal step routing), each rendering `<SignIn />`/`<SignUp />` inside the shared `AuthLayout`.
  - `components/auth/auth-layout.tsx` — 50/50 two-panel layout (hidden below `lg`): left panel on `bg-surface` (vs. the right panel's `bg-base`) for contrast between halves, icon-badge logo (`Sparkles` in a `bg-accent-dim` square) + "BluePrint" wordmark at top, bold headline + subtext + a 3-item feature list (icon badge, title, description) in the middle, copyright line at the bottom; right panel centers the form only. No gradients, hero imagery, feature cards, or scroll-heavy layout.
  - `components/editor/editor-navbar.tsx` — added Clerk's `<UserButton />` to the navbar's right section (previously an empty placeholder).
  - Fixed a pre-existing bug in `app/globals.css`: `--font-sans` was self-referential (`--font-sans: var(--font-sans)`), so it never resolved to the loaded Geist Sans font and every page silently fell back to the browser's serif default. Now maps `--font-sans` → `var(--font-geist-sans)` and added the missing `--font-mono` → `var(--font-geist-mono)`, per `ui-context.md`'s typography table.
  - Verified: `npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass (`proxy.ts` shows up as "ƒ Proxy (Middleware)" in the build output). Visually verified via a dev server + headless-browser (Playwright + system Edge) smoke test — unauthenticated visits to `/` and `/editor` redirect to `/sign-in?redirect_url=...`; `/sign-in` and `/sign-up` render the 50/50 dark layout with the cyan brand accent and Geist Sans applied correctly, no console errors.

## In Progress

- None.

## Next Up

- Await the next feature spec in `context/feature-specs/` (likely the canvas itself, project creation/persistence, and the first concrete dialog built on the `EditorDialog` pattern).

## Open Questions

- None currently open.

## Architecture Decisions

- `context/ui-context.md`'s theme table only gave example Tailwind utility names (`bg-base`, `text-copy-primary`, etc.) without a full mapping for every token. Resolved by extending that table with an explicit "Tailwind Utility" column for every CSS variable, following the naming pattern implied by the given examples (e.g. `border-*` variables → `border-surface-border[-subtle]`, `text-*` variables → `text-copy-*`, state colors → `text-*`/`bg-*` pairs).
- App-level components use the custom tokens documented in `ui-context.md` (`bg-base`, `text-copy-primary`, ...). The shadcn tokens (`bg-primary`, `text-foreground`, `border-border`, ...) remain reserved for use inside `components/ui/*`, both point at the same dark palette so they render identically.
- This project's Next.js version (16.2.10) renamed the `middleware.ts` file convention to `proxy.ts` (functionally identical — same `NextMiddleware` type, same execution model, just a new file name and export name). `@clerk/nextjs`'s `clerkMiddleware()` helper still returns a `NextMiddleware`-compatible function, so it default-exports cleanly from `proxy.ts` with no adapter needed.

## Session Notes

- shadcn CLI (v4.13.0) uses a new preset system; installed with the "Nova" preset (`Lucide / Geist`), which matches the project's existing icon/font choices, and the `radix` base library (Radix UI primitives via the unified `radix-ui` package) rather than the newer non-Radix `base` option.
- Do not modify `components/ui/*` — per `context/ai-workflow-rules.md`, project-specific styling belongs in app-level components instead.
- Next.js app router treats any `app/` folder prefixed with `_` as a private, non-routable segment — a temporary smoke-test route must use a plain folder name (e.g. `app/smoke-test/`) or it 404s.
- Gotcha: since `--color-base` is defined as a theme token in `globals.css`, Tailwind v4 auto-generates `bg-base` *and* `text-base` as color utilities — meaning `text-base` here is a text **color** (page background color), not Tailwind's default font-size utility. Don't use `text-base` for sizing; it silently collides with any text-color utility on the same element.
