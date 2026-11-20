import React from 'react';
import { SectionTitle } from './SectionTitle';
import { GlowingCard } from './GlowingCard';
import { MagneticButton } from './MagneticButton';
import { config } from '../constants/config';
import { FiLinkedin, FiArrowUpRight } from 'react-icons/fi';

export const LinkedInConnect: React.FC = () => {
  return (
    <section 
      id="linkedin-connect" 
      className="relative py-20 px-6 md:px-12 lg:px-24 bg-[#08090C] border-b border-borderMuted flex items-center justify-center overflow-hidden"
    >
      {/* Background neon ambient highlight */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10">
        <SectionTitle 
          number="09" 
          title="Professional Network" 
          subtitle="Connecting with startup builders, research mentors, and engineering leads globally."
        />

        <GlowingCard 
          className="mt-8 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
          glowColor="rgba(34, 211, 238, 0.15)"
        >
          {/* Left Details */}
          <div className="flex items-center gap-6 text-left">
            {/* LinkedIn Glowing Icon */}
            <div className="p-5 bg-[#0077B5]/10 rounded-2xl border border-[#0077B5]/35 text-[#0077B5] shadow-[0_0_15px_rgba(0,119,181,0.15)] shrink-0 hidden sm:block">
              <FiLinkedin className="w-10 h-10" />
            </div>
            
            <div>
              <span className="font-code text-xs text-secondary font-bold tracking-widest uppercase block mb-1">
                // LINKEDIN PROFILE
              </span>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white mb-2 tracking-tight">
                Connect with {config.name}
              </h3>
              <p className="font-body text-sm text-textMuted max-w-xl font-light leading-relaxed">
                Follow my professional updates, insights on machine learning research, Multi-Agent grids, Flutter mobile designs, and product releases from Hyderabad to Tempe.
              </p>
            </div>
          </div>

          {/* Right CTA Button */}
          <div className="shrink-0">
            <MagneticButton strength={0.25}>
              <a 
                href={config.linkedinUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2.5 font-code text-xs uppercase tracking-widest font-bold text-[#08090C] bg-[#0077B5] border border-[#0077B5] px-8 py-4 rounded-full hover:bg-transparent hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(0,119,181,0.2)] hover:shadow-none clickable"
              >
                <FiLinkedin className="w-4 h-4" /> View Profile <FiArrowUpRight className="w-4 h-4" />
              </a>
            </MagneticButton>
          </div>
        </GlowingCard>
      </div>
    </section>
  );
};
export default LinkedInConnect;
