import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children?: React.ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-in';
  delay?: number;
  duration?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 1.0,
  className = ""
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      let fromVars: gsap.TweenVars = { opacity: 0 };
      let toVars: gsap.TweenVars = {
        opacity: 1,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      };

      switch (animation) {
        case 'fade-up':
          fromVars.y = 40;
          toVars.y = 0;
          break;
        case 'fade-down':
          fromVars.y = -40;
          toVars.y = 0;
          break;
        case 'fade-left':
          fromVars.x = 40;
          toVars.x = 0;
          break;
        case 'fade-right':
          fromVars.x = -40;
          toVars.x = 0;
          break;
        case 'scale-in':
          fromVars.scale = 0.93;
          toVars.scale = 1;
          break;
      }

      gsap.fromTo(element, fromVars, toVars);
    });

    return () => ctx.revert();
  }, [animation, delay, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
