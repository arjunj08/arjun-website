import React, { useState } from 'react';
import { SectionTitle } from './SectionTitle';
import { GlowingCard } from './GlowingCard';
import { MagneticButton } from './MagneticButton';
import { config } from '../constants/config';
import { FiCopy, FiCheck, FiMail, FiDownload, FiPhone } from 'react-icons/fi';

export const Contact: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopy = (str: string, key: string) => {
    navigator.clipboard.writeText(str);
    setCopiedEmail(key);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <section 
      id="contact" 
      className="relative py-24 px-6 md:px-12 lg:px-24 bg-[#060810] flex items-center justify-center"
    >
      {/* Background ambient lighting */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-7xl relative z-10 text-center">
        <SectionTitle 
          number="10" 
          title="Start a Conversation" 
          align="center"
        />

        {/* Call to action glass panel */}
        <GlowingCard 
          className="mt-8 p-8 md:p-14 flex flex-col items-center justify-center"
          glowColor="rgba(124, 92, 255, 0.2)"
        >
          <h3 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-6 tracking-tight leading-tight max-w-xl mx-auto">
            Have an idea? <br />
            <span className="text-gradient-purple-cyan">Let's build it.</span>
          </h3>
          
          <p className="font-body text-sm md:text-base text-textMuted font-light max-w-lg mx-auto mb-10 leading-relaxed">
            I am always open to exploring startup ideas, mobile/web contract developments, academic research discussions, or standard engineering opportunities.
          </p>

          {/* Email & Contact Contacts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-12">
            
            {/* Personal Email Card */}
            <div className="flex flex-col items-center p-5 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:border-primary/20 hover:bg-white/[0.02] transition-all duration-300">
              <span className="font-code text-[10px] text-secondary uppercase tracking-widest mb-2">// Personal Email</span>
              <a href={`mailto:${config.emails.personal}`} className="font-code text-[11px] sm:text-xs text-white hover:text-primary transition-colors mb-3 break-all font-medium select-all">{config.emails.personal}</a>
              <button 
                onClick={() => handleCopy(config.emails.personal, 'personal')}
                className="flex items-center gap-1.5 font-code text-[10px] uppercase text-textMuted hover:text-white transition-colors"
              >
                {copiedEmail === 'personal' ? (
                  <>
                    <FiCheck className="text-success" /> Copied!
                  </>
                ) : (
                  <>
                    <FiCopy /> Copy
                  </>
                )}
              </button>
            </div>

            {/* Anurag Email Card */}
            <div className="flex flex-col items-center p-5 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:border-primary/20 hover:bg-white/[0.02] transition-all duration-300">
              <span className="font-code text-[10px] text-secondary uppercase tracking-widest mb-2">// Anurag Univ</span>
              <a href={`mailto:${config.emails.anurag}`} className="font-code text-[11px] sm:text-xs text-white hover:text-primary transition-colors mb-3 break-all font-medium select-all">{config.emails.anurag}</a>
              <button 
                onClick={() => handleCopy(config.emails.anurag, 'anurag')}
                className="flex items-center gap-1.5 font-code text-[10px] uppercase text-textMuted hover:text-white transition-colors"
              >
                {copiedEmail === 'anurag' ? (
                  <>
                    <FiCheck className="text-success" /> Copied!
                  </>
                ) : (
                  <>
                    <FiCopy /> Copy
                  </>
                )}
              </button>
            </div>

            {/* ASU Email Card */}
            <div className="flex flex-col items-center p-5 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:border-primary/20 hover:bg-white/[0.02] transition-all duration-300">
              <span className="font-code text-[10px] text-secondary uppercase tracking-widest mb-2">// Arizona State</span>
              <a href={`mailto:${config.emails.asu}`} className="font-code text-[11px] sm:text-xs text-white hover:text-primary transition-colors mb-3 break-all font-medium select-all">{config.emails.asu}</a>
              <button 
                onClick={() => handleCopy(config.emails.asu, 'asu')}
                className="flex items-center gap-1.5 font-code text-[10px] uppercase text-textMuted hover:text-white transition-colors"
              >
                {copiedEmail === 'asu' ? (
                  <>
                    <FiCheck className="text-success" /> Copied!
                  </>
                ) : (
                  <>
                    <FiCopy /> Copy
                  </>
                )}
              </button>
            </div>

            {/* Phone Card */}
            <div className="flex flex-col items-center p-5 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:border-primary/20 hover:bg-white/[0.02] transition-all duration-300">
              <span className="font-code text-[10px] text-secondary uppercase tracking-widest mb-2">// Call / WhatsApp</span>
              <a href={`tel:${config.phone.replace(/\s+/g, '')}`} className="font-code text-[11px] sm:text-xs text-white hover:text-primary transition-colors mb-3 break-all font-medium select-all">{config.phone}</a>
              <button 
                onClick={() => handleCopy(config.phone, 'phone')}
                className="flex items-center gap-1.5 font-code text-[10px] uppercase text-textMuted hover:text-white transition-colors"
              >
                {copiedEmail === 'phone' ? (
                  <>
                    <FiCheck className="text-success" /> Copied!
                  </>
                ) : (
                  <>
                    <FiCopy /> Copy
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Interactive Button row */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            
            {/* Direct Mail */}
            <MagneticButton strength={0.2}>
              <a 
                href={`mailto:${config.emails.personal}`}
                className="flex items-center gap-3 font-code text-xs tracking-widest uppercase font-bold text-[#060810] bg-white border border-white px-8 py-4 rounded-full hover:bg-transparent hover:text-white transition-all duration-300 clickable"
              >
                <FiMail className="w-4 h-4" /> Send Email
              </a>
            </MagneticButton>

            {/* Phone Contact */}
            <MagneticButton strength={0.2}>
              <a 
                href={`tel:${config.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-3 font-code text-xs tracking-widest uppercase font-bold text-white border border-borderMuted bg-card/60 backdrop-blur-md px-8 py-4 rounded-full hover:border-secondary transition-all duration-300 clickable"
              >
                <FiPhone className="w-4 h-4 text-secondary" /> Call Phone
              </a>
            </MagneticButton>

            {/* Download Resume */}
            <MagneticButton strength={0.2}>
              <a 
                href="/resume.pdf"
                download
                className="flex items-center gap-3 font-code text-xs tracking-widest uppercase font-bold text-white border border-borderMuted bg-card/60 backdrop-blur-md px-8 py-4 rounded-full hover:border-secondary transition-all duration-300 clickable"
              >
                <FiDownload className="w-4 h-4 text-secondary" /> Download Resume
              </a>
            </MagneticButton>

          </div>
        </GlowingCard>
      </div>
    </section>
  );
};
export default Contact;
