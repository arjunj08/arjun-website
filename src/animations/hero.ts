import { gsap } from 'gsap';
import { splitText } from '../utils/splitText';

/**
 * Orchestrates the landing page entry animations.
 */
export function animateHero(
  container: HTMLElement | null,
  nameElement: HTMLElement | null,
  avatarElement: HTMLElement | null,
  typewriterElement: HTMLElement | null,
  wordsElement: HTMLElement | null
) {
  if (!container) return;

  const ctx = gsap.context(() => {
    // 1. Name reveal using custom split text
    if (nameElement) {
      const chars = splitText(nameElement, 'chars');
      gsap.fromTo(chars,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.03,
          ease: "power4.out",
          delay: 0.3
        }
      );
    }

    // 2. Avatar reveal
    if (avatarElement) {
      gsap.fromTo(avatarElement,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: "power4.out",
          delay: 0.8
        }
      );
    }

    // 3. Typewriter entry
    if (typewriterElement) {
      gsap.fromTo(typewriterElement,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.4
        }
      );
    }

    // 4. Vertical flip words entry
    if (wordsElement) {
      gsap.fromTo(wordsElement,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.2
        }
      );
    }
  }, container);

  return () => ctx.revert();
}
