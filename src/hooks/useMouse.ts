import { useState, useEffect, useRef } from 'react';

/**
 * Hook to track mouse coordinates.
 * If bound to a ref, tracks normalized coordinates [-0.5, 0.5] relative to the element center.
 * If unbound, tracks absolute screen coordinates (clientX, clientY).
 */
export function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    const element = ref.current;
    
    if (!element) {
      const handleGlobalMove = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleGlobalMove);
      return () => window.removeEventListener('mousemove', handleGlobalMove);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      setPosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setPosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { position, isHovered, ref };
}
