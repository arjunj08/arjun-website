import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Syncs the timeline SVG line progress and animates the cards as they scroll into view.
 */
export function animateTimeline(
  container: HTMLElement | null,
  linePath: SVGPathElement | null,
  cards: HTMLElement[]
) {
  if (!container) return;

  const ctx = gsap.context(() => {
    // 1. Animate SVG stroke dashoffset on scroll
    if (linePath) {
      const length = linePath.getTotalLength();
      
      // Set initial styles
      gsap.set(linePath, {
        strokeDasharray: length,
        strokeDashoffset: length
      });

      gsap.to(linePath, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top 40%",
          end: "bottom 80%",
          scrub: true,
        }
      });
    }

    // 2. Animate timeline cards sliding in alternately
    if (cards && cards.length > 0) {
      cards.forEach((card, index) => {
        const isLeft = index % 2 === 0;
        gsap.fromTo(card,
          {
            x: isLeft ? -50 : 50,
            opacity: 0,
            scale: 0.92
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 65%",
              scrub: 0.5,
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }
  }, container);

  return () => ctx.revert();
}
