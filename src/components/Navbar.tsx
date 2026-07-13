import React, { useEffect, useState } from 'react';
import { MagneticButton } from './MagneticButton';

interface NavLink {
  label: string;
  id: string;
}

const navLinks: NavLink[] = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "What I Do", id: "what-i-do" },
  { label: "Timeline", id: "timeline" },
  { label: "Projects", id: "projects" },
  { label: "Tech", id: "tech" },
  { label: "Stats", id: "stats" },
  { label: "Contact", id: "contact" }
];

export const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [visible, setVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // 1. Scroll Progress & Hide/Reveal on scroll direction
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Compute scroll percentage
      if (totalHeight > 0) {
        setScrollProgress((currentScrollY / totalHeight) * 100);
      }

      // Hide on scroll down, show on scroll up
      if (currentScrollY > 150) {
        if (currentScrollY > lastScrollY) {
          setVisible(false); // scrolling down
        } else {
          setVisible(true); // scrolling up
        }
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 2. Active Section Tracking via Intersection Observer
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // triggers when section covers center of screen
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    navLinks.forEach((link) => {
      const section = document.getElementById(link.id);
      if (section) observer.observe(section);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [lastScrollY]);

  // Smooth scroll to section
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ease-out ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Scroll Progress Bar */}
      <div 
        className="h-[2px] bg-gradient-to-r from-primary to-secondary transition-all duration-100 ease-out origin-left"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Main Navbar Panel */}
      <div className="w-full flex justify-between items-center px-6 md:px-12 py-5 bg-background/30 backdrop-blur-md border-b border-white/[0.05]">
        {/* Logo Monogram */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, "home")}
          className="font-display font-extrabold text-xl tracking-tighter text-gradient-purple-cyan clickable"
        >
          ARJUN.
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <MagneticButton key={link.id} strength={0.2}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`relative px-4 py-2 font-code text-xs tracking-wider uppercase transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-textMuted hover:text-white'
                  }`}
                >
                  {link.label}
                  {/* Underline Indicator */}
                  {isActive && (
                    <span 
                      className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-secondary"
                      style={{ content: '""' }}
                    />
                  )}
                </a>
              </MagneticButton>
            );
          })}
        </nav>

        {/* Action Button (magnetic CTA) */}
        <div className="flex items-center">
          <MagneticButton strength={0.25}>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="px-6 py-2.5 font-code text-xs uppercase tracking-widest text-white border border-borderMuted rounded-full bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-secondary whitespace-nowrap clickable"
            >
              Contact
            </a>
          </MagneticButton>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
