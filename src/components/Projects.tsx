import React, { useEffect, useRef } from 'react';
import { SectionTitle } from './SectionTitle';
import { projects } from '../constants/projects';
import { animateProjects } from '../animations/projects';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { MagneticButton } from './MagneticButton';

export const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const panels = cardRefs.current.filter((el) => el !== null);
    const cleanup = animateProjects(containerRef.current, sliderRef.current, panels);
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div ref={containerRef} id="projects" className="relative bg-[#060810] border-b border-borderMuted">
      
      {/* Scroll Slider Content Wrapper */}
      <section className="relative w-full overflow-hidden flex flex-col justify-center min-h-screen py-24 px-6 md:px-12 lg:px-24">
        <div className="w-full max-w-7xl mx-auto mb-6">
          <SectionTitle 
            number="04" 
            title="Featured Work" 
            subtitle="Explore some of my core projects, open-source systems, and active research developments."
          />
          {/* Horizontal scroll progress bar for desktop */}
          <div className="hidden lg:block w-full h-[2px] bg-white/5 relative mt-8 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-secondary transition-all duration-100 ease-out origin-left"
              id="projects-scroll-indicator"
              style={{ width: '0%' }}
            />
          </div>
        </div>

        {/* Horizontal Slider Area */}
        <div className="relative mt-8">
          <div 
            ref={sliderRef}
            className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full lg:w-fit lg:flex-nowrap"
          >
            {projects.map((project, index) => (
              <div 
                key={project.id}
                ref={(el) => {
                  if (el) cardRefs.current[index] = el;
                }}
                className="w-full lg:w-[480px] shrink-0"
              >
                {/* Individual Card */}
                <div className="group relative rounded-2xl border border-borderMuted bg-card overflow-hidden flex flex-col justify-between h-[520px] glass-card transition-all duration-300">
                  
                  {/* Card Media Area with zoom on card hover */}
                  <div className="relative h-[220px] w-full overflow-hidden border-b border-borderMuted bg-background">
                    {project.media.type === 'video' ? (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={project.image}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      >
                        <source src={project.media.src} type="video/mp4" />
                        {/* Fallback image */}
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                        />
                      </video>
                    ) : (
                      <img 
                        src={project.media.src} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = project.image;
                        }}
                      />
                    )}
                    
                    {/* Status Badge overlay */}
                    <div className="absolute top-4 left-4">
                      <span className={`font-code text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full backdrop-blur-md border ${
                        project.status === 'Live' 
                          ? 'bg-success/15 border-success/35 text-success' 
                          : project.status === 'Research'
                          ? 'bg-secondary/15 border-secondary/35 text-secondary'
                          : 'bg-primary/15 border-primary/35 text-primary'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <span className="font-code text-xs text-secondary mb-1 block font-semibold tracking-wider">
                        {project.subtitle}
                      </span>
                      <h3 className="font-display font-extrabold text-xl text-white mb-2 tracking-tight">
                        {project.title}
                      </h3>
                      <p className="font-body text-xs text-textMuted font-light leading-relaxed mb-4 line-clamp-3">
                        {project.longDescription}
                      </p>
                    </div>

                    {/* Tech Chips */}
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.tech.map((t) => (
                          <span 
                            key={t}
                            className="font-code text-[9px] tracking-wider text-[#B6B8C2] px-2 py-0.5 bg-white/[0.03] border border-white/[0.05] rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Links Buttons */}
                      <div className="flex items-center gap-4 mt-auto">
                        {project.links.github && (
                          <MagneticButton strength={0.2}>
                            <a 
                              href={project.links.github} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center gap-2 font-code text-xs tracking-wider text-white border border-borderMuted bg-white/5 px-4 py-2 rounded-full hover:border-primary transition-all duration-300 clickable"
                            >
                              <FiGithub className="w-4 h-4" /> Github
                            </a>
                          </MagneticButton>
                        )}
                        {project.links.live && (
                          <MagneticButton strength={0.2}>
                            <a 
                              href={project.links.live} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center gap-2 font-code text-xs tracking-wider text-[#060810] bg-secondary border border-secondary px-4 py-2 rounded-full hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all duration-300 font-bold clickable"
                            >
                              <FiExternalLink className="w-4 h-4" /> Live Demo
                            </a>
                          </MagneticButton>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
};
export default Projects;
