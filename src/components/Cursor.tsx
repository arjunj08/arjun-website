import React, { useEffect, useRef, useState } from 'react';
import { initCursor } from '../animations/cursor';

export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // 1. Detect touch device to disable custom cursor
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0
      );
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);

    if (isTouchDevice) return;

    // 2. Initialize spring-loaded cursor physics
    const cleanup = initCursor(dotRef.current, ringRef.current);

    return () => {
      window.removeEventListener('resize', checkTouch);
      cleanup();
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed w-2 h-2 bg-secondary rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference opacity-0 transition-opacity duration-300"
      />
      {/* Outer Trailing Elastic Ring */}
      <div
        ref={ringRef}
        className="fixed w-9 h-9 border border-primary/45 rounded-full pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-transform duration-100 ease-out"
        style={{ transitionProperty: 'border-color, background-color' }}
      />
    </>
  );
};
export default Cursor;
