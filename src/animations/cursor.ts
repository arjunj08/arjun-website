import { gsap } from 'gsap';

/**
 * Custom cursor controller using spring interpolation.
 */
export function initCursor(
  dot: HTMLElement | null,
  ring: HTMLElement | null
) {
  if (!dot || !ring) return () => {};

  const mouse = { x: 0, y: 0 };
  const ringPos = { x: 0, y: 0 };

  const handleMouseMove = (e: MouseEvent) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Immediately position the inner dot
    gsap.set(dot, {
      x: mouse.x,
      y: mouse.y,
      opacity: 1
    });
    
    gsap.set(ring, {
      opacity: 1
    });
  };

  window.addEventListener('mousemove', handleMouseMove);

  // Elastic loop for the outer ring using requestAnimationFrame
  let rafId: number;
  const updateRing = () => {
    const ease = 0.15; // spring ease
    ringPos.x += (mouse.x - ringPos.x) * ease;
    ringPos.y += (mouse.y - ringPos.y) * ease;

    gsap.set(ring, {
      x: ringPos.x,
      y: ringPos.y
    });

    rafId = requestAnimationFrame(updateRing);
  };
  rafId = requestAnimationFrame(updateRing);

  // Hover states for links and buttons
  const handleMouseEnter = () => {
    gsap.to(dot, { scale: 0, duration: 0.2 });
    gsap.to(ring, { 
      scale: 2.2, 
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: '#22D3EE',
      duration: 0.3 
    });
  };

  const handleMouseLeave = () => {
    gsap.to(dot, { scale: 1, duration: 0.2 });
    gsap.to(ring, { 
      scale: 1, 
      backgroundColor: 'transparent',
      borderColor: 'rgba(124, 92, 255, 0.4)',
      duration: 0.3 
    });
  };

  const attachEvents = () => {
    const interactives = document.querySelectorAll('a, button, input, select, textarea, [role="button"], .clickable');
    interactives.forEach(el => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });
  };

  // Run initial attach
  attachEvents();

  // Watch DOM mutations to attach events dynamically
  const observer = new MutationObserver(attachEvents);
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    cancelAnimationFrame(rafId);
    observer.disconnect();
  };
}
