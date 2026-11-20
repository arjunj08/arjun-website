import React, { useEffect, useRef } from 'react';
import { SectionTitle } from './SectionTitle';
import { splitText } from '../utils/splitText';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const About: React.FC = () => {
  const storyRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Gentle floating animation for casual selfie using GSAP
    if (imageWrapperRef.current) {
      gsap.to(imageWrapperRef.current, {
        y: -10,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }

    // 2. Word-by-word text reveal on scroll
    let ctx: any;
    if (storyRef.current) {
      ctx = gsap.context(() => {
        const paragraphs = storyRef.current?.querySelectorAll('.reveal-para');
        paragraphs?.forEach((p) => {
          const words = splitText(p as HTMLElement, 'words');
          
          gsap.fromTo(words,
            { y: 15, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.012,
              ease: "power2.out",
              scrollTrigger: {
                trigger: p,
                start: "top 85%",
                toggleActions: "play none none none"
              }
            }
          );
        });
      }, storyRef);
    }

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section 
      id="about" 
      className="relative min-h-screen py-24 px-6 md:px-12 lg:px-24 flex items-center justify-center border-b border-borderMuted bg-[#08090C]"
    >
      {/* Background soft ambient light */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-7xl relative z-10">
        <SectionTitle 
          number="02" 
          title="A Little About Me" 
          subtitle="Connecting startup product development, dynamic design interfaces, and competitive programming."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-12">
          
          {/* Story columns */}
          <div ref={storyRef} className="lg:col-span-7 flex flex-col gap-6 pr-0 lg:pr-8">
            <p className="reveal-para font-body text-base md:text-lg text-textMuted font-light leading-relaxed">
              I build web applications, design mobile systems, and research machine learning. Currently, I'm working as a Developer at Veixon, a technology startup in Hyderabad. I build mobile apps and web backends, shipping real products that people use—like SelfCall (a voice journal app paired with custom hardware) and DayZero (our startup MVP launcher).
            </p>
            <p className="reveal-para font-body text-base md:text-lg text-textMuted font-light leading-relaxed">
              Academically, I study Computer Science under a 2+2 Dual Degree program, starting at Anurag University in Hyderabad and transitioning to Arizona State University. I also spent time in Indonesia on a full scholarship for CommTECH Camp at ITS Surabaya.
            </p>
            <p className="reveal-para font-body text-base md:text-lg text-textMuted font-light leading-relaxed">
              When I'm not coding products, I do competitive programming (find me on LeetCode as arjun08j) and help organize security events as a core member of the Anurag University Information Security Club (AUISC). My research focuses on using multi-agent reinforcement learning (RL) to keep smart electricity grids stable during solar power fluctuations.
            </p>
          </div>

          {/* Floating Avatar Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div 
              ref={imageWrapperRef}
              className="relative p-[1.5px] rounded-full overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(212,255,0,0.6) 0%, rgba(0,245,160,0.6) 100%)'
              }}
            >
              {/* Inner Casual Selfie image */}
              <div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full overflow-hidden bg-[#08090C]">
                <img 
                  src="/images/arjun-casual-circle.webp" 
                  alt="Arjun in a casual setting"
                  className="w-full h-full object-cover scale-[1.01] pointer-events-none"
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Caption */}
            <span className="font-code text-xs text-primary mt-4 tracking-widest uppercase">
              ~ off-duty mode
            </span>

            {/* Quick Context Chips */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <span className="font-code text-[10px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-textMuted">
                📍 Hyderabad, IN
              </span>
              <span className="font-code text-[10px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-textMuted">
                ⚡ Multi-Agent RL
              </span>
              <span className="font-code text-[10px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-textMuted">
                🏎️ Speed & Craft
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
export default About;
