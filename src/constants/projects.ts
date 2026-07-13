export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tech: string[];
  status: 'In Development' | 'Live' | 'Research' | 'Competition';
  links: {
    github?: string;
    live?: string;
  };
  image: string;
  media: {
    type: 'image' | 'video';
    src: string;
  };
}

export const projects: Project[] = [
  {
    id: "selfcall",
    title: "SelfCall / Self OS",
    subtitle: "Flutter AI Companion",
    description: "An AI companion that calls you to conduct voice journaling, track mood trends, and build an offline speaker relationship.",
    longDescription: "SelfCall is an advanced, personalized Flutter AI companion. It initiates scheduled calls for voice journaling and mood tracking. It features an extensive 90-screen custom design system and coordinates with a paired offline physical speaker device for absolute security. Built with Dart, Flutter, Node.js, and private LLM instances.",
    tech: ["Flutter", "Dart", "Node.js", "MongoDB", "Whisper API", "LLMs"],
    status: "In Development",
    links: {
      github: "https://github.com/arjunj08/self-os",
    },
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
    media: {
      type: "video",
      src: "/images/projects/selfcall.mp4"
    }
  },
  {
    id: "dayzero",
    title: "DayZero Foundry",
    subtitle: "Idea to MVP Accelerator",
    description: "Submit raw SaaS ideas and get a functional, deployed free MVP designed and developed within days by the Veixon team.",
    longDescription: "DayZero Foundry is a community platform launched at Veixon. Users submit raw startup concepts, and the team selects, implements, and deploys fully operational MVPs. Developed with Node.js, Express, MongoDB, and Tailwind CSS to handle fast validation, pipeline scheduling, and project submissions.",
    tech: ["React", "Node.js", "Express", "MongoDB", "TailwindCSS"],
    status: "Live",
    links: {
      github: "https://github.com/arjunj08/veixon-cofounders",
      live: "https://dayzero.veixon.com",
    },
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop",
    media: {
      type: "image",
      src: "/images/projects/dayzero.webp"
    }
  },
  {
    id: "skillbridge",
    title: "SkillBridge",
    subtitle: "AI Placement Prep",
    description: "AI-driven mock interview simulator and prep platform specifically tailored for competitive CS students in India.",
    longDescription: "SkillBridge helps Indian Computer Science students clear technical rounds. It offers company-tagged algorithmic problems, a generative AI mock interview simulator that critiques voice answers, and a highly polished, interactive Three.js homepage showcasing candidate performance metrics.",
    tech: ["Next.js", "Three.js", "FastAPI", "PostgreSQL", "WebRTC"],
    status: "Live",
    links: {
      github: "https://github.com/arjunj08/skill-bridge",
      live: "https://skillbridge.edu"
    },
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
    media: {
      type: "image",
      src: "/images/projects/skillbridge.webp"
    }
  },
  {
    id: "gridpulse",
    title: "GridPulse",
    subtitle: "Multi-Agent RL Power Research",
    description: "Deep multi-agent reinforcement learning (MAPPO) simulations for smart grids, predicting real-time pricing and dynamic tariffs.",
    longDescription: "GridPulse is a research project aiming for IEEE publication. It models electricity grids using pandapower and implements Multi-Agent Proximal Policy Optimization (MAPPO) via Ray RLlib to stabilize voltage variations and optimize dynamic retail electricity tariffs under high solar penetration.",
    tech: ["Python", "Ray RLlib", "PyTorch", "pandapower", "Matplotlib"],
    status: "Research",
    links: {
      github: "https://github.com/arjunj08/gridpulse"
    },
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    media: {
      type: "image",
      src: "/images/projects/gridpulse.webp"
    }
  },
  {
    id: "eventsync",
    title: "AUISC EventSync",
    subtitle: "Club Event Coordinator",
    description: "Multi-platform event coordinator and ticketing dashboard built for the Anurag University Information Security Club.",
    longDescription: "EventSync coordinates all events, workshops, hackathons, and credentials for the AUISC club. Features QR-code scanning for attendance tracking, real-time ticket sales tracking, and custom role assignments. Scaled across a React-based admin panel and a React Native mobile application for student check-ins.",
    tech: ["React", "React Native", "Firebase", "Node.js", "Express"],
    status: "Live",
    links: {
      github: "https://github.com/arjunj08/ausic-eventsync"
    },
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    media: {
      type: "image",
      src: "/images/projects/eventsync.webp"
    }
  },
  {
    id: "edusphere",
    title: "EduSphere AI",
    subtitle: "Predictive Student Success",
    description: "Machine learning platform built for the 2026 Cintana Alliance AI Challenge, identifying students at risk of drop-out.",
    longDescription: "EduSphere AI utilizes longitudinal academic databases to identify early indicators of academic risk or discontinuation. Incorporates predictive classification models, explanatory AI (SHAP value analyses), and personalized academic remediation pathway recommendations. Honored at the Cintana Alliance Challenge.",
    tech: ["React", "Flask", "Scikit-Learn", "SHAP", "TailwindCSS"],
    status: "Competition",
    links: {
      github: "https://github.com/arjunj08/edusphere"
    },
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    media: {
      type: "image",
      src: "/images/projects/edusphere.webp"
    }
  }
];
