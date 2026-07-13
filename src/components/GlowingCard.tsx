import React, { useRef, useState } from 'react';

interface GlowingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  glowColor?: string;
}

/**
 * A premium card that renders a mouse-following radial glow background.
 */
export const GlowingCard: React.FC<GlowingCardProps> = ({
  children,
  className = "",
  glowColor = "rgba(124, 92, 255, 0.15)",
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const { left, top } = card.getBoundingClientRect();
    setCoords({
      x: e.clientX - left,
      y: e.clientY - top
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative rounded-2xl border border-borderMuted bg-card overflow-hidden glass-card ${className}`}
      {...props}
    >
      {/* Radial glow background layer positioned absolutely behind content */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
        }}
      />
      
      {/* Render children directly to preserve the parent's flexbox alignment */}
      {children}
    </div>
  );
};
