import React, { useEffect, useRef, useState } from 'react';
import { SectionTitle } from './SectionTitle';
import { projects, Project } from '../constants/projects';
import { animateProjects } from '../animations/projects';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { Sparkles } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { ProjectModal } from './ProjectModal';
import { sound } from '../utils/sound';

interface ProjectsProps {
  externalSelectedProject?: Project | null;
  onClearExternalProject?: () => void;
}

export const Projects: React.FC<ProjectsProps> = ({ 
  externalSelectedProject, 
  onClearExternalProject 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (externalSelectedProject) {
      setSelectedProject(externalSelectedProject);
    }
  }, [externalSelectedProject]);

  useEffect(() => {
    const panels = cardRefs.current.filter((el) => el !== null);
    const cleanup = animateProjects(containerRef.current, sliderRef.current, panels);
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const handleOpenModal = (project: Project) => {
    sound.playClick();
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    if (onClearExternalProject) {
      onClearExternalProject();
    }
  };

  return (
    <div ref={containerRef} id="projects" className="relative bg-[#08090C] border-b border-borderMuted">
      
      {/* Scroll Slider Content Wrapper */}
      <section className="relative w-full overflow-hidden flex flex-col justify-center min-h-screen py-24 px-6 md:px-12 lg:px-24">
        <div className="w-full max-w-7xl mx-auto mb-6">
          <SectionTitle 
            number="01" 
            title="Featured Work" 
            subtitle="Explore some of my core autonomous agent systems, AI frameworks, and active research developments."
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
                <div 
                  className="group relative rounded-2xl border border-borderMuted bg-card overflow-hidden flex flex-col justify-between h-[540px] glass-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_10px_40px_-10px_rgba(124,92,255,0.2)]"
                  onMouseEnter={() => sound.playHover()}
                >
                  
                  {/* Card Media Area with zoom on card hover */}
                  <div 
                    className="relative h-[220px] w-full overflow-hidden border-b border-borderMuted bg-background cursor-pointer"
                    onClick={() => handleOpenModal(project)}
                  >
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

                    {/* Hover Overlay Prompt */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="flex items-center gap-1.5 font-code text-xs font-bold text-white uppercase tracking-wider px-4 py-2 rounded-full bg-white/20 border border-white/30 backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5 text-secondary" /> Architecture Deep Dive
                      </span>
                    </div>
                    
                    {/* Status Badge overlay */}
                    <div className="absolute top-4 left-4 z-10">
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
                      <h3 
                        onClick={() => handleOpenModal(project)}
                        className="font-display font-extrabold text-xl text-white mb-2 tracking-tight hover:text-secondary transition-colors cursor-pointer"
                      >
                        {project.title}
                      </h3>
                      <p className="font-body text-xs text-textMuted font-light leading-relaxed mb-4 line-clamp-3">
                        {project.longDescription}
                      </p>
                    </div>

                    {/* Tech Chips */}
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.tech.map((t) => (
                          <span 
                            key={t}
                            className="font-code text-[9px] tracking-wider text-[#B6B8C2] px-2 py-0.5 bg-white/[0.03] border border-white/[0.05] rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Links Buttons + Deep Dive Trigger */}
                      <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-white/[0.04]">
                        <div className="flex items-center gap-2">
                          {project.links.github && (
                            <MagneticButton strength={0.2}>
                              <a 
                                href={project.links.github} 
                                target="_blank" 
                                rel="noreferrer"
                                onClick={() => sound.playClick()}
                                className="flex items-center gap-1.5 font-code text-xs tracking-wider text-white border border-borderMuted bg-white/5 px-3 py-1.5 rounded-full hover:border-primary transition-all duration-300 clickable"
                              >
                                <FiGithub className="w-3.5 h-3.5" /> Code
                              </a>
                            </MagneticButton>
                          )}
                          {project.links.live && (
                            <MagneticButton strength={0.2}>
                              <a 
                                href={project.links.live} 
                                target="_blank" 
                                rel="noreferrer"
                                onClick={() => sound.playClick()}
                                className="flex items-center gap-1.5 font-code text-xs tracking-wider text-[#08090C] bg-secondary border border-secondary px-3 py-1.5 rounded-full hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 font-bold clickable"
                              >
                                <FiExternalLink className="w-3.5 h-3.5" /> Demo
                              </a>
                            </MagneticButton>
                          )}
                        </div>

                        {/* Deep Dive Action */}
                        <button
                          onClick={() => handleOpenModal(project)}
                          className="flex items-center gap-1 text-[11px] font-code text-textMuted hover:text-white uppercase tracking-wider transition-colors"
                        >
                          Deep Dive →
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Project Architecture Deep Dive Modal */}
      <ProjectModal 
        project={selectedProject} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};
export default Projects;
