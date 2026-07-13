import React from 'react';
import { SectionTitle } from './SectionTitle';
import Marquee from 'react-fast-marquee';
import { 
  SiFlutter, SiReact, SiNextdotjs, SiNodedotjs, SiExpress, SiMongodb, 
  SiPostgresql, SiPython, SiThreedotjs, SiTypescript, SiFigma, SiTailwindcss, SiGreensock
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

interface SkillItem {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const skillsRow1: SkillItem[] = [
  { name: "Flutter", icon: <SiFlutter />, color: "#02569B" },
  { name: "React", icon: <SiReact />, color: "#61DAFB" },
  { name: "Next.js", icon: <SiNextdotjs />, color: "#FFFFFF" },
  { name: "Node.js", icon: <SiNodedotjs />, color: "#339933" },
  { name: "Express", icon: <SiExpress />, color: "#808080" },
  { name: "MongoDB", icon: <SiMongodb />, color: "#47A248" },
  { name: "PostgreSQL", icon: <SiPostgresql />, color: "#4169E1" }
];

const skillsRow2: SkillItem[] = [
  { name: "Java", icon: <FaJava />, color: "#007396" },
  { name: "Python", icon: <SiPython />, color: "#3776AB" },
  { name: "Three.js", icon: <SiThreedotjs />, color: "#000000" },
  { name: "GSAP", icon: <SiGreensock />, color: "#88CE02" },
  { name: "TypeScript", icon: <SiTypescript />, color: "#3178C6" },
  { name: "Figma", icon: <SiFigma />, color: "#F24E1E" },
  { name: "TailwindCSS", icon: <SiTailwindcss />, color: "#06B6D4" }
];

export const TechStack: React.FC = () => {
  return (
    <section 
      id="tech" 
      className="relative py-24 bg-[#060810] border-b border-borderMuted flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-7xl px-6 md:px-12 lg:px-24 mb-14">
        <SectionTitle 
          number="05" 
          title="Technological Core" 
          subtitle="My primary design tools, engineering languages, databases, and animation libraries."
        />
      </div>

      {/* Marquees container */}
      <div className="w-full flex flex-col gap-6 relative z-10 py-4">
        {/* Row 1 - Left to Right */}
        <Marquee 
          direction="left" 
          speed={45} 
          pauseOnHover={true} 
          gradient={true} 
          gradientColor="#060810" 
          gradientWidth={100}
        >
          <div className="flex gap-6 pr-6">
            {skillsRow1.map((skill) => (
              <div 
                key={skill.name}
                className="group flex items-center gap-3 px-6 py-4 rounded-xl border border-borderMuted bg-card/60 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-card clickable"
              >
                <div 
                  className="text-2xl transition-transform duration-300 group-hover:scale-110" 
                  style={{ color: skill.color }}
                >
                  {skill.icon}
                </div>
                <span className="font-code text-sm tracking-wider font-semibold text-white">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </Marquee>

        {/* Row 2 - Right to Left */}
        <Marquee 
          direction="right" 
          speed={45} 
          pauseOnHover={true} 
          gradient={true} 
          gradientColor="#060810" 
          gradientWidth={100}
        >
          <div className="flex gap-6 pr-6">
            {skillsRow2.map((skill) => (
              <div 
                key={skill.name}
                className="group flex items-center gap-3 px-6 py-4 rounded-xl border border-borderMuted bg-card/60 backdrop-blur-md transition-all duration-300 hover:border-secondary/40 hover:bg-card clickable"
              >
                <div 
                  className="text-2xl transition-transform duration-300 group-hover:scale-110" 
                  style={{ color: skill.color }}
                >
                  {skill.icon}
                </div>
                <span className="font-code text-sm tracking-wider font-semibold text-white">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </Marquee>
      </div>

    </section>
  );
};
export default TechStack;
