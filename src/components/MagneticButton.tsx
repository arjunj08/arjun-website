import React from 'react';
import { useMagnetic } from '../hooks/useMagnetic';

interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.3,
  className = "",
  ...props
}) => {
  const ref = useMagnetic(strength);

  return (
    <div ref={ref} className={`inline-block ${className}`} {...props}>
      {children}
    </div>
  );
};
