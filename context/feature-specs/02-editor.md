We need the base chrome components that frame every editor screen - the top navbar and the left sidebar shell. These will be reused and extended in every chapter that follows.

### Editor Navbar

Create `components/editor/editor-navbar.tsx`.

Requirements:

- Fixed height top navbar.
- Left, center and right sections.
- The left section contains a sidebar toggle button.
- use `PanelLeftOpen`/`PanelLeftClose` icons based to define sidebar state.
- Right section stays empty for now.
- Dark background with subtle bottom border.

### Project Sidebar

Create `components/editor/project-sidebar.tsx`.

Requirements:

- Sidebar should float above the editor canvas.
- Opening it should not push page content. It should float above and overlay page content.
- It should slide in from the left.
- Accepts an `isOpen` and `onClose` prop.
- Header with `Projects` title + close button.
- Shadcn `tabs`:
    - My projects
    - Shared
- Both tabs show empty placeholder state.
- Full-width `New Project` button at the bottom with `Plus` icon.

### Dialog Pattern

Use the existing color tokens, from `globals.css` for dialog styling.

Support:

- title
- description
- footer actions

Do not build the actual dialogs yet.

### Check when done

- New components compile without TypeScript errors.
- No lint errors.
- Dialog pattern is ready for future use.
