import React from 'react';
import { socials } from '../constants/socials';
import { MagneticButton } from './MagneticButton';
import { FiGithub, FiLinkedin, FiInstagram, FiArrowUp } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';

const getSocialIcon = (name: string) => {
  switch (name) {
    case 'github':
      return <FiGithub className="w-5 h-5" />;
    case 'linkedin':
      return <FiLinkedin className="w-5 h-5" />;
    case 'leetcode':
      return <SiLeetcode className="w-5 h-5" />;
    case 'instagram':
      return <FiInstagram className="w-5 h-5" />;
    default:
      return null;
  }
};

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#060810] border-t border-borderMuted py-10 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left: signature */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <span className="font-display font-extrabold text-sm text-white tracking-wide">
            J. ARJUN
          </span>
          <span className="font-code text-[10px] text-textMuted tracking-wider uppercase">
            © {new Date().getFullYear()} // Handcrafted with GSAP & R3F
          </span>
        </div>

        {/* Center: Social Icons */}
        <div className="flex items-center gap-4">
          {socials.map((link) => (
            <MagneticButton key={link.name} strength={0.3}>
              <a 
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={link.name}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-borderMuted bg-card text-textMuted hover:text-white hover:border-secondary transition-colors duration-300 clickable"
              >
                {getSocialIcon(link.iconName)}
              </a>
            </MagneticButton>
          ))}
        </div>

        {/* Right: Back to Top */}
        <MagneticButton strength={0.25}>
          <button 
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="flex items-center gap-2 font-code text-xs uppercase tracking-widest text-textMuted hover:text-white border border-borderMuted px-5 py-2.5 rounded-full bg-card/60 transition-all duration-300 clickable"
          >
            Back to Top <FiArrowUp className="w-3 h-3 text-secondary" />
          </button>
        </MagneticButton>

      </div>
    </footer>
  );
};
export default Footer;
