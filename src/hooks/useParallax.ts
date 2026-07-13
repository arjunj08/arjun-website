import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook to apply parallax translation on scroll.
 * speed represents the offset in pixels the element will move.
 */
export function useParallax(speed = 80) {
  const ref = useRef<any>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(element,
        { y: -speed },
        {
          y: speed,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
}
