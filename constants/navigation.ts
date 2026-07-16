export const NAVBAR_HEIGHT = 100;

export const NAVIGATION_SECTIONS = [
  { id: "about", label: "ABOUT" },
  { id: "skills", label: "SKILLS" },
  { id: "projects", label: "PROJECTS" },
  { id: "contact", label: "CONTACT" },
] as const;

export type NavigationSection = (typeof NAVIGATION_SECTIONS)[number]["id"];
