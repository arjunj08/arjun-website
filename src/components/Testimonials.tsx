import React from 'react';
import { SectionTitle } from './SectionTitle';
import { GlowingCard } from './GlowingCard';
import { testimonials } from '../constants/testimonials';
import { Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  // If no testimonials are configured, skip rendering entirely
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section 
      id="testimonials" 
      className="relative py-24 px-6 md:px-12 lg:px-24 bg-[#060810] border-b border-borderMuted flex items-center justify-center overflow-hidden"
    >
      {/* Background glow backdrop */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-7xl relative z-10">
        <SectionTitle 
          number="08" 
          title="What People Say" 
          subtitle="Feedback from mentors, startup founders, and project collaborators."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {testimonials.map((t) => (
            <GlowingCard 
              key={t.id}
              className="p-8 md:p-10 flex flex-col justify-between min-h-[220px]"
              glowColor="rgba(124, 92, 255, 0.12)"
            >
              <div>
                <Quote className="w-8 h-8 text-primary/30 mb-6" />
                <p className="font-body text-sm md:text-base text-textMuted font-light italic leading-relaxed mb-8">
                  "{t.quote}"
                </p>
              </div>
              <div className="border-t border-white/[0.05] pt-6 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-base text-white">
                    {t.author}
                  </h4>
                  <span className="font-code text-xs text-secondary font-medium tracking-wide">
                    {t.role}
                  </span>
                </div>
              </div>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
