export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'mobile' | 'tools' | 'other';
}

export const skills: Skill[] = [
  { name: "Flutter", category: "mobile" },
  { name: "React", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "Node.js", category: "backend" },
  { name: "Express", category: "backend" },
  { name: "MongoDB", category: "backend" },
  { name: "PostgreSQL", category: "backend" },
  { name: "Java", category: "backend" },
  { name: "Python", category: "backend" },
  { name: "Three.js", category: "frontend" },
  { name: "GSAP", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "Figma", category: "tools" },
  { name: "TailwindCSS", category: "frontend" }
];
