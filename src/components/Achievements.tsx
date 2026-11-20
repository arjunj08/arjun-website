import React, { useEffect, useRef, useState } from 'react';
import { SectionTitle } from './SectionTitle';
import { GlowingCard } from './GlowingCard';
import { achievements } from '../constants/achievements';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CountUpProps {
  value: number;
  suffix: string;
}

const CountUp: React.FC<CountUpProps> = ({ value, suffix }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = spanRef.current;
    if (!element) return;

    const counterObj = { count: 0 };

    const tween = gsap.to(counterObj, {
      count: value,
      duration: 2.0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      onUpdate: () => {
        setDisplayValue(Math.floor(counterObj.count));
      }
    });

    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <span ref={spanRef} className="font-display font-extrabold text-5xl md:text-6xl text-white tracking-tighter mr-1">
      {displayValue}{suffix}
    </span>
  );
};

export const Achievements: React.FC = () => {
  return (
    <section 
      id="achievements" 
      className="relative py-24 px-6 md:px-12 lg:px-24 bg-[#08090C] border-b border-borderMuted flex items-center justify-center"
    >
      <div className="w-full max-w-7xl relative z-10">
        <SectionTitle 
          number="06" 
          title="Milestones" 
          subtitle="Quantifying core engineering output, competitive performance, and design systems scale."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {achievements.map((item) => (
            <GlowingCard 
              key={item.id}
              className="p-8 flex flex-col justify-between min-h-[220px]"
              glowColor="rgba(34, 211, 238, 0.12)"
            >
              <div>
                <CountUp value={item.value} suffix={item.suffix} />
                <h3 className="font-display font-bold text-lg text-white mt-4 mb-2">
                  {item.title}
                </h3>
                <span className="font-code text-xs text-secondary font-semibold uppercase tracking-wider block mb-3">
                  {item.subtitle}
                </span>
              </div>
              <p className="font-body text-xs text-textMuted font-light leading-relaxed">
                {item.description}
              </p>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Achievements;
