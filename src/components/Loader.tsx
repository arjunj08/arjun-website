import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const targetText = "ARJUN JAMMALMADAKA";
  const scramblePool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!+=?";

  useEffect(() => {
    const animationObj = { value: 0 };
    
    // Soft scale-in for loader background pulse
    gsap.fromTo(".loader-bg-pulse",
      { opacity: 0.15, scale: 0.95 },
      { opacity: 0.35, scale: 1.05, duration: 2, repeat: -1, yoyo: true, ease: "power1.inOut" }
    );

    const tl = gsap.timeline({
      onComplete: () => {
        // Curtain transition sequence
        const curtainTl = gsap.timeline({
          onComplete: onComplete
        });

        curtainTl.to(".curtain-panel-top", {
          y: "-100%",
          duration: 1.0,
          ease: "power4.inOut",
        });

        curtainTl.to(".curtain-panel-bottom", {
          y: "100%",
          duration: 1.0,
          ease: "power4.inOut"
        }, "<0.15");
      }
    });

    tl.to(animationObj, {
      value: 100,
      duration: 3.2,
      ease: "power2.out",
      onUpdate: () => {
        setProgress(Math.floor(animationObj.value));
      }
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  // Scramble and decrypt logic tied to the progress value
  useEffect(() => {
    const totalLength = targetText.length;
    const decryptThreshold = Math.floor((progress / 100) * totalLength);
    
    let result = "";
    for (let i = 0; i < totalLength; i++) {
      if (i < decryptThreshold) {
        // Decrypted letter
        result += targetText[i];
      } else if (targetText[i] === " ") {
        // Keep spaces clean
        result += " ";
      } else {
        // Render random scramble character
        const randomIndex = Math.floor(Math.random() * scramblePool.length);
        result += scramblePool[randomIndex];
      }
    }
    setDisplayText(result);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-between p-8 md:p-12 overflow-hidden bg-[#060810] select-none">
      {/* Background soft glowing pulse */}
      <div className="loader-bg-pulse absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent pointer-events-none" 
           style={{ background: 'radial-gradient(circle, rgba(124,92,255,0.1) 0%, rgba(6,8,16,0) 70%)' }} />
      
      {/* Double curtain panels that slide out vertically */}
      <div className="curtain-panel-top absolute top-0 left-0 w-full h-1/2 bg-[#0c0f1d] border-b border-borderMuted z-10" />
      <div className="curtain-panel-bottom absolute bottom-0 left-0 w-full h-1/2 bg-[#0c0f1d] border-t border-borderMuted z-10" />

      {/* Main Loader UI */}
      <div className="relative z-20 flex flex-col justify-between h-full w-full">
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="font-code text-xs text-primary tracking-widest font-semibold uppercase">
            // DECRYPTING PORTFOLIO OS
          </span>
          <span className="font-code text-xs text-secondary tracking-widest font-semibold uppercase">
            v1.2.0
          </span>
        </div>

        {/* Scrambling title */}
        <div className="text-center my-auto px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white font-code min-h-[96px] flex justify-center items-center">
            {displayText}
          </h1>
          <p className="font-code text-xs md:text-sm text-textMuted uppercase tracking-widest mt-2 h-6">
            {progress < 100 ? `decrypting credentials... [${progress}%]` : `decryption successful. launching.`}
          </p>
        </div>

        {/* Footer info & numerical counter */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div className="w-full md:w-1/3 h-[2px] bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="text-right">
            <span className="font-display text-8xl md:text-9xl font-light text-white tracking-tighter leading-none select-none">
              {progress.toString().padStart(3, '0')}
            </span>
            <span className="font-code text-sm text-secondary ml-2 font-bold">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
