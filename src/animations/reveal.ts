import { gsap } from 'gsap';

/**
 * Standard reusable reveal animations using GSAP.
 */
export const reveal = {
  fadeUp: (element: HTMLElement | null, delay = 0, duration = 1.2) => {
    if (!element) return;
    return gsap.fromTo(
      element,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration, ease: "power3.out", delay }
    );
  },

  staggerFadeUp: (elements: HTMLElement[], stagger = 0.1, delay = 0, duration = 1.0) => {
    if (!elements || elements.length === 0) return;
    return gsap.fromTo(
      elements,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration, ease: "power3.out", stagger, delay }
    );
  },

  scaleIn: (element: HTMLElement | null, delay = 0, duration = 1.0) => {
    if (!element) return;
    return gsap.fromTo(
      element,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration, ease: "power3.out", delay }
    );
  }
};
