import React, { useEffect, useRef } from 'react';
import { SectionTitle } from './SectionTitle';
import { timeline } from '../constants/timeline';
import { animateTimeline } from '../animations/timeline';
import { GraduationCap, Briefcase } from 'lucide-react';

export const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const cards = cardRefs.current.filter((el) => el !== null);
    const cleanup = animateTimeline(containerRef.current, pathRef.current, cards);
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="timeline" 
      className="relative min-h-screen py-24 px-6 md:px-12 lg:px-24 bg-[#08090C] border-b border-borderMuted flex items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-5xl relative z-10">
        <SectionTitle 
          number="04" 
          title="My Journey" 
          subtitle="Education, startups, and scholarships along the Hyderabad-ASU pipeline."
        />

        <div className="relative mt-20">
          {/* Vertical central timeline line */}
          <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2 -z-10" />
          
          {/* GSAP Drawn SVG Path Overlay */}
          <svg 
            className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-[2px] h-full -translate-x-1/2 -z-10 pointer-events-none" 
            preserveAspectRatio="none"
          >
            <path
              ref={pathRef}
              d="M 1 0 L 1 5000" /* Long vertical line drawn dynamically */
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              className="h-full"
            />
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C5CFF" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
          </svg>

          {/* Cards Grid */}
          <div className="flex flex-col gap-12 relative">
            {timeline.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div 
                  key={item.year}
                  className={`flex flex-col md:flex-row relative items-start ${
                    isLeft ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Central Node Indicator */}
                  <div className="absolute left-[30px] md:left-1/2 w-6 h-6 rounded-full bg-card border-[2px] border-primary -translate-x-1/2 flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                  </div>

                  {/* Empty space filler for layout */}
                  <div className="hidden md:block w-1/2" />

                  {/* Card Element */}
                  <div 
                    ref={(el) => {
                      if (el) cardRefs.current[index] = el;
                    }}
                    className="w-full md:w-[calc(50%-40px)] ml-14 md:ml-0"
                  >
                    <div className="p-6 md:p-8 rounded-2xl bg-card border border-borderMuted glass-card">
                      {/* Card Header */}
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <span className="font-code text-xs text-secondary font-bold tracking-widest block uppercase mb-1">
                            {item.year}
                          </span>
                          <h3 className="font-display font-extrabold text-xl text-white">
                            {item.role}
                          </h3>
                          <span className="font-body text-xs text-textMuted font-medium">
                            {item.company}
                          </span>
                        </div>
                        <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 text-primary">
                          {item.type === 'education' ? (
                            <GraduationCap className="w-5 h-5" />
                          ) : (
                            <Briefcase className="w-5 h-5" />
                          )}
                        </div>
                      </div>

                      {/* Card Description */}
                      <ul className="list-none flex flex-col gap-2 font-body text-sm text-textMuted font-light leading-relaxed">
                        {item.description.map((desc, dIdx) => (
                          <li key={dIdx} className="flex gap-2 items-start">
                            <span className="text-secondary mt-1.5">•</span>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Timeline;
