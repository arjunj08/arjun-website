import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Handles horizontal scroll pinning for desktop viewports (min-width: 1024px).
 * On mobile/tablet, it falls back to normal vertical stacking.
 */
export function animateProjects(
  container: HTMLElement | null,
  slider: HTMLElement | null,
  panels: HTMLElement[]
) {
  if (!container || !slider || panels.length === 0) return;

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const amountToScroll = slider.scrollWidth - window.innerWidth;

      gsap.to(slider, {
        x: -amountToScroll,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          start: "top top",
          end: () => `+=${amountToScroll}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const indicator = document.getElementById("projects-scroll-indicator");
            if (indicator) {
              indicator.style.width = `${self.progress * 100}%`;
            }
          }
        }
      });
    });
  }, container);

  return () => ctx.revert();
}
