import React, { useEffect, useState } from 'react';
import { MagneticButton } from './MagneticButton';
import { Search, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/sound';

interface NavLink {
  label: string;
  id: string;
}

interface NavbarProps {
  onOpenCommandPalette?: () => void;
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

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [visible, setVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(sound.isEnabled());

  useEffect(() => {
    // 1. Clock in Indian Standard Time (IST)
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);

    // 2. Scroll Progress & Direction
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (totalHeight > 0) {
        setScrollProgress((currentScrollY / totalHeight) * 100);
      }

      if (currentScrollY > 150) {
        if (currentScrollY > lastScrollY) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 3. Active Section Tracking
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
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
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [lastScrollY]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    sound.playClick();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleSound = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
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
      <div className="w-full flex justify-between items-center px-4 sm:px-8 md:px-12 py-4 bg-[#060810]/75 backdrop-blur-md border-b border-white/[0.06]">
        {/* Left: Brand Monogram + Live Status */}
        <div className="flex items-center gap-4">
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, "home")}
            className="font-display font-extrabold text-xl tracking-tighter text-gradient-purple-cyan clickable"
          >
            ARJUN.
          </a>

          {/* Availability & IST Status indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-code text-textMuted">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-white/90">Available for Summer '26</span>
            <span className="text-white/30">•</span>
            <span>HYD {currentTime}</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <MagneticButton key={link.id} strength={0.15}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  onMouseEnter={() => sound.playHover()}
                  className={`relative px-3.5 py-1.5 font-code text-xs tracking-wider uppercase transition-colors duration-300 ${
                    isActive ? 'text-white font-semibold' : 'text-textMuted hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span 
                      className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-secondary"
                    />
                  )}
                </a>
              </MagneticButton>
            );
          })}
        </nav>

        {/* Right: Quick Tools (Spotlight + Sound + CTA) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Spotlight Search Trigger */}
          {onOpenCommandPalette && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenCommandPalette();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] hover:border-secondary/50 text-textMuted hover:text-white transition-all text-xs font-code clickable group"
              title="Open Command Palette (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-secondary group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[10px] bg-white/[0.06] text-white/70">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-full border transition-all clickable ${
              soundEnabled 
                ? 'border-secondary/40 bg-secondary/10 text-secondary' 
                : 'border-white/[0.08] bg-white/[0.02] text-textMuted/60 hover:text-white'
            }`}
            title={soundEnabled ? "Mute Sound FX" : "Enable Sound FX"}
            aria-label="Toggle Sound Effects"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Contact Magnetic CTA */}
          <MagneticButton strength={0.2}>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="px-5 py-2 font-code text-xs uppercase tracking-widest text-white border border-borderMuted rounded-full bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-secondary whitespace-nowrap clickable"
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
