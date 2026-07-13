import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Hook to apply a high-performance magnetic effect to elements.
 * Uses GSAP quickTo for smooth spring-like translation.
 */
export function useMagnetic(strength = 0.3) {
  const ref = useRef<any>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, "x", { duration: 0.8, ease: "power3.out" });
    const yTo = gsap.quickTo(element, "y", { duration: 0.8, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = element.getBoundingClientRect();
      
      // Calculate mouse position relative to element center
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      xTo(x * strength);
      yTo(y * strength);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return ref;
}
