import React, { useEffect } from 'react';
import { X, ExternalLink, Github, Cpu, Layers, CheckCircle2, Sparkles } from 'lucide-react';
import { Project } from '../constants/projects';
import { sound } from '../utils/sound';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (project) {
      sound.playModal();
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#08090C]/85 backdrop-blur-lg transition-opacity duration-300"
        onClick={() => {
          sound.playClick();
          onClose();
        }}
      />

      {/* Modal Dialog */}
      <div 
        className="relative w-full max-w-3xl my-8 rounded-3xl border border-white/10 bg-[#0d101a] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9),0_0_60px_rgba(34,211,238,0.15)] overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Media Banner */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-black shrink-0">
          {project.media.type === 'video' ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={project.image}
              className="w-full h-full object-cover"
            >
              <source src={project.media.src} type="video/mp4" />
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            </video>
          ) : (
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = project.image;
              }}
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d101a] via-[#0d101a]/40 to-transparent" />

          {/* Close button */}
          <button 
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 border border-white/10 text-white/80 hover:text-white hover:bg-black/90 transition-all clickable"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges in header */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="font-code text-xs uppercase font-bold tracking-widest text-secondary block mb-1">
                // {project.subtitle}
              </span>
              <h2 className="font-display font-extrabold text-2xl md:text-4xl text-white tracking-tight">
                {project.title}
              </h2>
            </div>
            <span className={`font-code text-[11px] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full border backdrop-blur-md ${
              project.status === 'Live'
                ? 'bg-success/20 border-success/40 text-success'
                : project.status === 'Research'
                ? 'bg-secondary/20 border-secondary/40 text-secondary'
                : 'bg-primary/20 border-primary/40 text-primary'
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Overview */}
          <div>
            <h4 className="flex items-center gap-2 font-code text-xs uppercase tracking-widest text-textMuted mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Engineering Overview
            </h4>
            <p className="font-body text-sm md:text-base text-textMuted font-light leading-relaxed">
              {project.longDescription}
            </p>
          </div>

          {/* Technical Architecture Highlights */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h4 className="flex items-center gap-2 font-code text-xs uppercase tracking-widest text-white mb-3">
              <Cpu className="w-4 h-4 text-secondary" /> Architectural Highlights
            </h4>
            <ul className="space-y-2 text-xs md:text-sm text-textMuted font-light">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>Production scalability engineered with modular component separation and strict type-safety.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>Ultra-responsive user interface with low-latency client-side state caching and fallback handlers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>Containerized deployment pipelines ready for zero-downtime rolling updates.</span>
              </li>
            </ul>
          </div>

          {/* Tech Stack Breakdown */}
          <div>
            <h4 className="flex items-center gap-2 font-code text-xs uppercase tracking-widest text-textMuted mb-3">
              <Layers className="w-3.5 h-3.5 text-secondary" /> Technologies & Frameworks
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span 
                  key={t}
                  className="font-code text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white hover:border-primary/40 transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Links & Action Row */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick()}
                  className="flex items-center gap-2 font-code text-xs uppercase tracking-wider font-semibold text-white bg-white/10 border border-white/15 px-5 py-2.5 rounded-full hover:bg-white/20 transition-all clickable"
                >
                  <Github className="w-4 h-4" /> View Source Code
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick()}
                  className="flex items-center gap-2 font-code text-xs uppercase tracking-wider font-bold text-[#08090C] bg-secondary border border-secondary px-5 py-2.5 rounded-full hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] transition-all clickable"
                >
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="font-code text-xs text-textMuted hover:text-white transition-colors uppercase tracking-wider"
            >
              Close [ESC]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectModal;
