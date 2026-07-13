import React, { useEffect, useRef, useState } from 'react';
import { Particles } from './Particles';
import { useMouse } from '../hooks/useMouse';
import { animateHero } from '../animations/hero';
import { config } from '../constants/config';
import { MagneticButton } from './MagneticButton';
import { Download, ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const typewriterWrapperRef = useRef<HTMLDivElement>(null);
  const wordsWrapperRef = useRef<HTMLDivElement>(null);

  // Typewriter lines configuration
  const typewriterLines = [
    "Flutter Developer @ Veixon",
    "Full-stack Engineer (MERN / Next.js)",
    "Three.js & Creative Web Developer",
    "Competitive Programmer — LeetCode: arjun08j",
    "AI Product Builder — SelfCall · SkillBridge · GridPulse",
    "B.Tech CS · Anurag University → Arizona State University"
  ];

  const [lineIndex, setLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // 3D Mouse Tilt Hook on Avatar
  const { position, isHovered, ref: avatarRef } = useMouse();

  // Detect reduced motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Typewriter Loop
  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentText(typewriterLines[0]);
      return;
    }

    let timer: number;
    const fullText = typewriterLines[lineIndex];
    const typingSpeed = isDeleting ? 25 : 55;

    if (!isDeleting && currentText === fullText) {
      timer = window.setTimeout(() => setIsDeleting(true), 1700);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setLineIndex((prev) => (prev + 1) % typewriterLines.length);
    } else {
      timer = window.setTimeout(() => {
        setCurrentText((prev) => 
          isDeleting 
            ? fullText.substring(0, prev.length - 1)
            : fullText.substring(0, prev.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, lineIndex, prefersReducedMotion]);

  // Entrance Animations
  useEffect(() => {
    const revertAnimation = animateHero(
      containerRef.current,
      nameRef.current,
      avatarContainerRef.current,
      typewriterWrapperRef.current,
      wordsWrapperRef.current
    );
    return () => {
      if (revertAnimation) revertAnimation();
    };
  }, []);

  // Compute Spring-Loaded 3D rotation matrix
  const tiltStyle = {
    transform: isHovered
      ? `perspective(1000px) rotateX(${-position.y * 14}deg) rotateY(${position.x * 14}deg) scale3d(1.02, 1.02, 1.02)`
      : `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center py-20 px-6 md:px-12 lg:px-24 overflow-hidden z-10 select-none"
      id="home"
    >
      {/* Three.js R3F Canvas in background */}
      <Particles />

      {/* Grid Overlay for premium texture */}
      <div 
        className="absolute inset-0 bg-transparent opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main Grid Wrapper */}
      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mt-8">
        
        {/* Left Section: Name & Details */}
        <div className="lg:col-span-7 flex flex-col items-start justify-center">
          <div className="mb-4">
            <span className="font-code text-xs md:text-sm text-primary font-semibold tracking-widest uppercase">
              // HELLO! I'M
            </span>
          </div>

          {/* Large Name Display */}
          <h1 
            ref={nameRef}
            className="text-white font-display font-extrabold leading-[0.95] tracking-tight uppercase mb-8"
            style={{ fontSize: 'clamp(44px, 8vw, 96px)' }}
          >
            J. <br />
            <span className="text-outline-stroke font-bold whitespace-nowrap">ARJUN</span>
          </h1>

          {/* Typewriter Line */}
          <div ref={typewriterWrapperRef} className="min-h-[44px] mb-8 w-full max-w-xl">
            <div className="flex items-center gap-2 border border-borderMuted bg-card/60 backdrop-blur-md px-4 py-2.5 rounded-lg w-fit">
              <span className="font-code text-xs md:text-sm text-[#B6B8C2]">~</span>
              <div className="font-code text-xs md:text-sm text-secondary font-medium tracking-tight">
                {currentText}
                {!prefersReducedMotion && <span className="animate-pulse text-[#22D3EE] font-bold">▌</span>}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <MagneticButton strength={0.2}>
              <a 
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 font-code text-xs uppercase tracking-widest font-bold text-[#060810] bg-white border border-white px-6 py-3.5 rounded-full hover:bg-transparent hover:text-white transition-all duration-300 clickable"
              >
                Let's Build <ArrowRight className="w-4 h-4" />
              </a>
            </MagneticButton>

            <MagneticButton strength={0.2}>
              <a 
                href="/resume.pdf"
                download
                className="flex items-center gap-2 font-code text-xs uppercase tracking-widest font-bold text-white border border-borderMuted bg-card/60 backdrop-blur-md px-6 py-3.5 rounded-full hover:border-secondary transition-all duration-300 clickable"
              >
                Download Resume <Download className="w-4 h-4 text-secondary" />
              </a>
            </MagneticButton>
          </div>
        </div>

        {/* Center-Right Section: 3D Tilting Conic-Ring Avatar */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          
          <div 
            ref={avatarContainerRef}
            className="relative flex items-center justify-center"
          >
            {/* Ambient Background Glow behind the head */}
            <div className="absolute w-[350px] h-[350px] md:w-[480px] md:h-[480px] bg-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

            {/* Conic Ring Wrapper */}
            <div 
              ref={avatarRef}
              style={tiltStyle}
              className="relative rounded-full p-[2px] cursor-grab active:cursor-grabbing"
            >
              {/* Spinning Conic Border Ring */}
              <div 
                className="absolute inset-0 rounded-full animate-spin-slow opacity-90 blur-[1px]"
                style={{
                  background: 'conic-gradient(from 0deg, #7C5CFF, #22D3EE, #7C5CFF)',
                }}
              />

              {/* Outer Dashed Tech Ring rotating counter-clockwise */}
              <div 
                className="absolute -inset-4 rounded-full border border-dashed border-secondary/20 animate-spin-reverse opacity-60 pointer-events-none"
                style={{ animationDuration: '24s' }}
              />

              {/* Masking container for headshot */}
              <div className="relative rounded-full overflow-hidden bg-[#060810] w-[260px] h-[260px] md:w-[390px] md:h-[390px] flex items-center justify-center">
                <img 
                  src="/images/arjun-hero.webp" 
                  alt="Arjun Jammalmadaka, developer at Veixon"
                  className="w-full h-full object-cover scale-[1.01]"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>

          {/* Right Section / Hover Flip Words below on mobile, aligned next to avatar on desktop */}
          <div 
            ref={wordsWrapperRef} 
            className="mt-8 flex flex-wrap gap-4 items-center justify-center"
          >
            {config.roles.map((role) => (
              <div 
                key={role}
                className="group relative overflow-hidden px-4 py-1.5 rounded-full border border-borderMuted bg-card/40 backdrop-blur-sm cursor-default transition-all duration-300 hover:border-primary/50"
              >
                {/* Visual hover flip wrapper */}
                <div className="relative flex flex-col transition-transform duration-500 ease-out transform group-hover:-translate-y-full">
                  <span className="font-code text-xs md:text-sm text-textMuted tracking-wider font-semibold py-0.5">
                    {role}
                  </span>
                  <span className="absolute top-full left-0 font-code text-xs md:text-sm text-secondary tracking-wider font-bold py-0.5">
                    {role}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
export default Landing;
