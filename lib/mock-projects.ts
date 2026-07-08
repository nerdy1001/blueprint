export interface Project {
  id: string
  name: string
  slug: string
}

export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export const INITIAL_MY_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Marketing Site Redesign",
    slug: "marketing-site-redesign",
  },
  {
    id: "2",
    name: "Internal Dashboard",
    slug: "internal-dashboard",
  },
]

export const SHARED_PROJECTS: Project[] = [
  {
    id: "3",
    name: "Q3 Roadmap",
    slug: "q3-roadmap",
  },
]
