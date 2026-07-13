import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '../utils/splitText';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedHeadingProps {
  text: string;
  type?: 'chars' | 'words';
  className?: string;
  delay?: number;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  type = 'chars',
  className = "",
  delay = 0
}) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      const items = splitText(element, type);

      gsap.fromTo(items,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: type === 'chars' ? 0.02 : 0.05,
          ease: "power4.out",
          delay,
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    return () => ctx.revert();
  }, [text, type, delay]);

  return (
    <h2 ref={ref} className={`inline-block ${className}`}>
      {text}
    </h2>
  );
};
