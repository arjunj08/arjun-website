export interface TimelineItem {
  year: string;
  role: string;
  company: string;
  description: string[];
  type: 'education' | 'experience';
}

export const timeline: TimelineItem[] = [
  {
    year: "2027",
    role: "B.Tech Computer Science (Dual Degree)",
    company: "Arizona State University",
    description: [
      "Transferred to Arizona State University under the prestigious 2+2 Dual Degree program.",
      "Focusing on Artificial Intelligence, Advanced Algorithms, and Software Engineering methodologies.",
      "Expanding global network and participating in academic research on campus."
    ],
    type: "education"
  },
  {
    year: "2026",
    role: "Scholar & AI Competitor",
    company: "ITS Surabaya & Cintana Alliance",
    description: [
      "Awarded full scholarship for CommTECH Camp at ITS Surabaya, Indonesia (2026). Worked on sustainable community-centric tech solutions.",
      "Developed EduSphere AI, a predictive student-success platform, representing Anurag University at the 2026 Cintana Alliance AI Challenge."
    ],
    type: "education"
  },
  {
    year: "2025",
    role: "Developer",
    company: "Veixon (Tech Startup, Hyderabad)",
    description: [
      "Shipped the SelfCall design system (90+ mobile UI screens) and laid down foundational frontend systems.",
      "Built and launched DayZero Foundry, a web platform translating raw product ideas into functional MVPs.",
      "Integrated AI capabilities and LLMs into production workflow pipelines for clients."
    ],
    type: "experience"
  },
  {
    year: "2024",
    role: "B.Tech CS Student & AUISC Core Member",
    company: "Anurag University",
    description: [
      "Began 2+2 Dual Degree program in Computer Science.",
      "Selected as Core Member of Anurag University Information Security Club (AUISC).",
      "Orchestrated programming competitions and mentored peers in competitive programming."
    ],
    type: "education"
  }
];
