import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count: number;
  mouseRef: React.MutableRefObject<[number, number]>;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ count, mouseRef }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle coordinates with spherical distribution
  const positions = useMemo(() => {
    const tempPositions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 2.0 + Math.random() * 6.0; // Hollow sphere feel
      
      tempPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      tempPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      tempPositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return tempPositions;
  }, [count]);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    // Slow orbital rotation
    points.rotation.y = state.clock.getElapsedTime() * 0.02;
    points.rotation.x = state.clock.getElapsedTime() * 0.01;

    // Interpolate mouse coordinates for parallax
    const targetX = mouseRef.current[0] * 0.4;
    const targetY = mouseRef.current[1] * 0.4;

    points.position.x += (targetX - points.position.x) * 0.05;
    points.position.y += (targetY - points.position.y) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#D4FF00"
        sizeAttenuation={true}
        transparent={true}
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const Particles: React.FC = () => {
  const mouseRef = useRef<[number, number]>([0, 0]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize values in range [-1.5, 1.5]
      mouseRef.current = [
        ((e.clientX / window.innerWidth) * 2 - 1) * 1.5,
        (- (e.clientY / window.innerHeight) * 2 + 1) * 1.5
      ];
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50 bg-[#08090C]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.2} />
        <ParticleSystem count={isMobile ? 350 : 1200} mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
};
export default Particles;
