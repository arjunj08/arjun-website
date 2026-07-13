import React from 'react';
import { AnimatedHeading } from './AnimatedHeading';
import { Reveal } from './Reveal';

interface SectionTitleProps {
  number: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  number,
  title,
  subtitle,
  align = 'left'
}) => {
  const isLeft = align === 'left';
  
  return (
    <div className={`mb-12 md:mb-16 flex flex-col ${isLeft ? 'items-start' : 'items-center text-center'}`}>
      <Reveal animation="fade-right" delay={0.05}>
        <span className="font-code text-primary text-sm font-semibold tracking-widest uppercase mb-2 block">
          // {number}
        </span>
      </Reveal>
      
      <AnimatedHeading
        text={title}
        type="words"
        className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight"
      />
      
      {subtitle && (
        <Reveal animation="fade-up" delay={0.2}>
          <p className="font-body text-textMuted text-base md:text-lg max-w-2xl font-light leading-relaxed">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
};
