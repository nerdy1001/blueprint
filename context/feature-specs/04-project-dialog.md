## Goal

Build the `editor` home screen and add project dialogs/sidebar actions. No API calls or data persistence needed yet.

## Editor Home

Reuse the existing editor layout. Do not modify the navbar or sidebar behavior.

In the center of the page, add:

- Heading: `Create a project or open an existing one`.
- Description: `Start a new workspace, or choose a project from the sidebar`.
- `New Project` button with a `Plus` icon.

Keep the layout minimal. Do not wrap this content in cards.

Clicking `New Project` should open the `Create Project` dialog

## Dialogs

### Create Project

- Project name input.
- Live slug preview based on the name.
- Preview updates as the user types.

### Rename Project

- Prefilled project name input.
- Current project name shown in the description.
- Input auto-focuses.
- Enter submits

### Delete Project

- Destructive confirmation only.
- No input.
- Confirm button uses destructive styling.


## Sidebar

Add project item actions:

- rename
- delete

Show actions only for owned projects.

Hide actions for shared/collaborator projects.

on mobile:

- Tapping outside the sidebar closes it.
- Add a backdrop scrim.

## Implementation

Create a dedicated hook to manage:

- Dialog state
- Form state
- Loading state

Wire:

- Editor home `New Project` -> Create dialog
- Sidebar create -> Create dialog
- Sidebar rename -> Rename dialog
- Sidebar delete -> Delete dialog

Use mock project data only. Do not add API calls or persistence.

## Check When Done

- Sidebar actions are wired.
- Slug preview works.
- No TypeScript errors.
- No lint errors.