import React from 'react';
import { SectionTitle } from './SectionTitle';
import { GlowingCard } from './GlowingCard';
import { Cpu, Layout, Smartphone, Globe, BarChart2 } from 'lucide-react';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  tech: string[];
}

const services: Service[] = [
  {
    icon: <Layout className="w-8 h-8 text-primary" />,
    title: "Full-Stack Development",
    description: "Architecting high-fidelity user interfaces and scalable backend infrastructures. Focusing on clean code, microservices, and fast rendering architectures.",
    tech: ["React", "Next.js", "Node.js", "Express", "PostgreSQL", "MongoDB", "Spring Boot"]
  },
  {
    icon: <Cpu className="w-8 h-8 text-secondary" />,
    title: "AI Engineering",
    description: "Integrating Large Language Models, optimizing semantic search embeddings, and building autonomous agent pipelines for voice and text companions.",
    tech: ["OpenAI API", "LangChain", "Vector DBs", "RAG Pipeline", "Model Fine-tuning"]
  },
  {
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    title: "Flutter & Mobile Apps",
    description: "Engineering immersive, cross-platform mobile experiences with Flutter, including custom graphics layouts, state management, and native offline device links.",
    tech: ["Flutter", "Dart", "React Native", "BLoC / Provider", "SQLite", "Native Bridges"]
  },
  {
    icon: <Globe className="w-8 h-8 text-secondary" />,
    title: "Creative Web & WebGL",
    description: "Developing cinematic 3D storytelling layouts using Three.js and custom shaders. Maximizing performance and responsiveness under complex point meshes.",
    tech: ["Three.js", "React Three Fiber", "Drei", "GSAP ScrollTrigger", "GLSL Shaders"]
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-primary" />,
    title: "Grid Optimization Research",
    description: "Simulating multi-agent reinforcement learning (MAPPO) pipelines for smart grids to predict pricing dynamics and dynamic electricity tariffs.",
    tech: ["Python", "Ray RLlib", "PyTorch", "pandapower", "IEEE Target"]
  }
];

export const WhatIDo: React.FC = () => {
  return (
    <section 
      id="what-i-do" 
      className="relative min-h-screen py-24 px-6 md:px-12 lg:px-24 bg-[#060810] border-b border-borderMuted flex items-center justify-center"
    >
      <div className="w-full max-w-7xl relative z-10">
        <SectionTitle 
          number="02" 
          title="What I Do" 
          subtitle="Engineering specialized technical solutions, robust system layouts, and interactive interfaces."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {services.map((service, index) => (
            <GlowingCard 
              key={service.title} 
              className="p-8 flex flex-col justify-between min-h-[380px]"
              glowColor={index % 2 === 0 ? "rgba(124, 92, 255, 0.15)" : "rgba(34, 211, 238, 0.15)"}
            >
              <div>
                <div className="mb-6 p-3 bg-white/5 rounded-xl w-fit border border-white/10">
                  {service.icon}
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-3">
                  {service.title}
                </h3>
                <p className="font-body text-sm text-textMuted font-light leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Tech Chips */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {service.tech.map((t) => (
                  <span 
                    key={t}
                    className="font-code text-[10px] tracking-wider text-secondary px-2.5 py-1 bg-white/[0.03] border border-white/[0.05] rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
};
export default WhatIDo;
