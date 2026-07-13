import { useEffect, useState, useRef } from 'react';

interface Options extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

/**
 * Hook to track whether an element is visible in the viewport.
 * Useful for triggering entrance transitions.
 */
export function useIntersection(options: Options = { triggerOnce: true }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (options.triggerOnce) {
          observer.unobserve(element);
        }
      } else if (!options.triggerOnce) {
        setIsIntersecting(false);
      }
    }, options);

    observer.observe(element);

    return () => {
      if (element && !options.triggerOnce) {
        observer.unobserve(element);
      }
    };
  }, [options.threshold, options.root, options.rootMargin, options.triggerOnce]);

  return [ref, isIntersecting] as const;
}
