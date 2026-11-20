import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { animateHero } from '../animations/hero';
import { Particles } from './Particles';
import { MagneticButton } from './MagneticButton';
import { useMouse } from '../hooks/useMouse';

export const Landing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const typewriterWrapperRef = useRef<HTMLDivElement>(null);
  const avatarContainerRef = useRef<HTMLDivElement>(null);

  // Focus directly on AI Engineering, Autonomous Agents, Veixon AI OS, RAG
  const typewriterLines = [
    "AI Engineer — VEIXON AI OS · Autonomous Agents · RAG",
    "Research Enthusiast — Multi-Agent RL · Smart Grids",
    "Competitive Programmer — LeetCode: arjun08j",
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
        setCurrentText(
          isDeleting 
            ? fullText.substring(0, currentText.length - 1)
            : fullText.substring(0, currentText.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, lineIndex, typewriterLines, prefersReducedMotion]);

  // Entrance animations via GSAP
  useEffect(() => {
    const cleanup = animateHero(
      containerRef.current,
      nameRef.current,
      avatarContainerRef.current,
      typewriterWrapperRef.current,
      null
    );

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // Calculate 3D avatar tilt angles (max 8 degrees)
  const maxTilt = 8;
  const rotateX = isHovered ? -position.y * maxTilt : 0;
  const rotateY = isHovered ? position.x * maxTilt : 0;

  const tiltStyle: React.CSSProperties = prefersReducedMotion 
    ? {} 
    : {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
      };

  return (
    <section 
      ref={containerRef}
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center px-6 md:px-12 lg:px-24 overflow-hidden pt-28 pb-16 bg-[#08090C]"
    >
      {/* 3D Dynamic Cybernetic Wave Grid */}
      <Particles />

      {/* Hero content grid */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start justify-center">
          <div className="mb-4">
            <span className="font-code text-xs md:text-sm text-primary font-semibold tracking-widest uppercase">
              // AI ENGINEER & SYSTEM ARCHITECT
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
              <span className="font-code text-xs md:text-sm text-[#C5C8D4]">~</span>
              <div className="font-code text-xs md:text-sm text-secondary font-medium tracking-tight">
                {currentText}
                {!prefersReducedMotion && <span className="animate-pulse text-primary font-bold">▌</span>}
              </div>
            </div>
          </div>

          {/* CTA Buttons: Main button is "See My Work" linking to projects */}
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <MagneticButton strength={0.2}>
              <a 
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 font-code text-xs uppercase tracking-widest font-bold text-[#08090C] bg-primary border border-primary px-7 py-3.5 rounded-full hover:bg-transparent hover:text-primary transition-all duration-300 clickable shadow-[0_0_25px_rgba(212,255,0,0.25)]"
              >
                See My Work <ArrowRight className="w-4 h-4" />
              </a>
            </MagneticButton>

            <MagneticButton strength={0.2}>
              <a 
                href="/resume.pdf"
                download="J_Arjun_Resume.pdf"
                className="flex items-center gap-2 font-code text-xs uppercase tracking-widest font-bold text-white border border-borderMuted bg-card/60 backdrop-blur-md px-6 py-3.5 rounded-full hover:border-secondary transition-all duration-300 clickable"
              >
                Download Resume <Download className="w-4 h-4 text-secondary" />
              </a>
            </MagneticButton>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.08] w-full max-w-lg">
            <div>
              <span className="font-display font-bold text-xl md:text-2xl text-white block">348+</span>
              <span className="font-code text-[10px] md:text-xs text-textMuted uppercase tracking-wider">LeetCode Solved</span>
            </div>
            <div>
              <span className="font-display font-bold text-xl md:text-2xl text-primary block">Top 12%</span>
              <span className="font-code text-[10px] md:text-xs text-textMuted uppercase tracking-wider">Global Contest</span>
            </div>
            <div>
              <span className="font-display font-bold text-xl md:text-2xl text-secondary block">109+</span>
              <span className="font-code text-[10px] md:text-xs text-textMuted uppercase tracking-wider">GitHub Matrix</span>
            </div>
          </div>
        </div>

        {/* Center-Right Section: 3D Tilting Conic-Ring Avatar with Holographic Chips */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          
          <div 
            ref={avatarContainerRef}
            className="relative flex items-center justify-center"
          >
            {/* Ambient Background Glow behind the head */}
            <div className="absolute w-[350px] h-[350px] md:w-[480px] md:h-[480px] bg-primary/10 rounded-full blur-[90px] -z-10 pointer-events-none" />

            {/* Top-Right Holographic Chip */}
            <div className="hidden sm:flex absolute -top-3 -right-2 md:-right-6 bg-[#0F1117]/95 border border-primary/40 backdrop-blur-md px-3.5 py-1.5 rounded-full items-center gap-2 shadow-[0_0_20px_rgba(212,255,0,0.15)] z-20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-code text-[11px] text-white font-medium">VEIXON AI OS • Agents</span>
            </div>

            {/* Bottom-Left Holographic Chip */}
            <div className="hidden sm:flex absolute -bottom-3 -left-4 md:-left-8 bg-[#0F1117]/95 border border-secondary/40 backdrop-blur-md px-3.5 py-1.5 rounded-full items-center gap-2 shadow-[0_0_20px_rgba(0,245,160,0.15)] z-20">
              <span className="text-secondary text-xs">🎓</span>
              <span className="font-code text-[11px] text-white font-medium">2+2 CS • Anurag → ASU</span>
            </div>

            {/* Conic Ring Wrapper */}
            <div 
              ref={avatarRef}
              style={tiltStyle}
              className="relative rounded-full p-[2px] cursor-grab active:cursor-grabbing"
            >
              {/* Spinning Conic Border Ring in Signature Acid-Lime and Mint */}
              <div 
                className="absolute inset-0 rounded-full animate-spin-slow opacity-90 blur-[1px]"
                style={{
                  background: 'conic-gradient(from 0deg, #D4FF00, #00F5A0, #D4FF00)',
                }}
              />

              {/* Outer Dashed Tech Ring rotating counter-clockwise */}
              <div 
                className="absolute -inset-4 rounded-full border border-dashed border-secondary/30 animate-spin-reverse opacity-60 pointer-events-none"
                style={{ animationDuration: '24s' }}
              />

              {/* Masking container for headshot */}
              <div className="relative rounded-full overflow-hidden bg-[#08090C] w-[260px] h-[260px] md:w-[390px] md:h-[390px] flex items-center justify-center">
                <img 
                  src="/images/arjun-hero.webp" 
                  alt="J. Arjun headshot"
                  className="w-full h-full object-cover select-none pointer-events-none"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>

            {/* Floating Role Monogram Badge */}
            <div className="absolute -bottom-4 right-4 md:right-8 bg-[#0F1117]/90 border border-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl z-20">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
              <span className="font-code text-xs text-white uppercase tracking-wider font-semibold">
                Dev @ Veixon
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
export default Landing;
