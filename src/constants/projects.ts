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
    id: "veixon-ai-os",
    title: "VEIXON AI OS",
    subtitle: "Enterprise Agentic Runtime",
    description: "Autonomous multi-agent orchestration runtime with low-latency tool dispatch, persistent memory, and RAG vector indexing.",
    longDescription: "VEIXON AI OS is an enterprise-grade agent orchestration framework engineered at Veixon. It provisions specialized autonomous agents with sandboxed code execution, semantic memory indexing, and dynamic tool chaining. Built to deliver sub-50ms dispatch latency across hybrid cloud and local model deployments.",
    tech: ["Python", "TypeScript", "FastAPI", "Qdrant", "LangGraph", "Docker"],
    status: "In Development",
    links: {
      github: "https://github.com/arjunj08/veixon-cofounders",
    },
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    media: {
      type: "image",
      src: "/images/projects/veixon-ai-os.webp"
    }
  },
  {
    id: "kaalbench",
    title: "KaalBench",
    subtitle: "Temporal LLM Benchmark",
    description: "Benchmarking framework evaluating long-context temporal comprehension, causal reasoning, and latency in frontier language models.",
    longDescription: "KaalBench is an automated evaluation suite that stress-tests LLM context windows against temporal drift, multi-step counterfactual questions, and long-horizon causal chains. Includes automated dataset generation, synthetic perturbation tests, and latency profiling.",
    tech: ["PyTorch", "Python", "HuggingFace", "FastAPI", "PostgreSQL"],
    status: "Research",
    links: {
      github: "https://github.com/arjunj08/gridpulse"
    },
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    media: {
      type: "image",
      src: "/images/projects/kaalbench.webp"
    }
  },
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
      github: "https://github.com/arjunj08/veixon-cofounders"
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
    longDescription: "SkillBridge helps Indian Computer Science students clear technical rounds. It offers company-tagged algorithmic problems, a generative AI mock interview simulator that critiques voice answers, and a highly polished interactive interface showcasing candidate performance metrics.",
    tech: ["Next.js", "Three.js", "FastAPI", "PostgreSQL", "WebRTC"],
    status: "Live",
    links: {
      github: "https://github.com/arjunj08/skill-bridge"
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
  }
];
