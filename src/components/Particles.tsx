import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CyberWaveProps {
  mouseRef: React.MutableRefObject<[number, number]>;
}

const CyberWave: React.FC<CyberWaveProps> = ({ mouseRef }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const gridX = 55;
  const gridY = 55;
  const count = gridX * gridY;

  // Grid coordinates + Dual Color Palette (Acid Lime #D4FF00 -> Mint #00F5A0)
  const { positions, colors, initialY } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const initY = new Float32Array(count);

    const colorA = new THREE.Color('#D4FF00'); // Acid Lime
    const colorB = new THREE.Color('#00F5A0'); // Mint
    const colorC = new THREE.Color('#10B981'); // Deep Emerald

    let idx = 0;
    const spacing = 0.35;
    const offsetX = (gridX * spacing) / 2;
    const offsetZ = (gridY * spacing) / 2;

    for (let x = 0; x < gridX; x++) {
      for (let z = 0; z < gridY; z++) {
        const posX = x * spacing - offsetX;
        const posZ = z * spacing - offsetZ;
        const posY = -1.6;

        pos[idx * 3] = posX;
        pos[idx * 3 + 1] = posY;
        pos[idx * 3 + 2] = posZ;
        initY[idx] = posY;

        // Radial color mix
        const distFromCenter = Math.sqrt(posX * posX + posZ * posZ) / 10;
        const mixedColor = new THREE.Color().lerpColors(
          distFromCenter < 0.5 ? colorA : colorB,
          colorC,
          Math.min(distFromCenter, 1)
        );

        col[idx * 3] = mixedColor.r;
        col[idx * 3 + 1] = mixedColor.g;
        col[idx * 3 + 2] = mixedColor.b;

        idx++;
      }
    }
    return { positions: pos, colors: col, initialY: initY };
  }, [count, gridX, gridY]);

  // Constellation Starfield floating in background
  const { starPositions, starColors } = useMemo(() => {
    const starCount = 350;
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);
    const starA = new THREE.Color('#D4FF00');
    const starB = new THREE.Color('#00F5A0');

    for (let i = 0; i < starCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16 + 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3;

      const c = Math.random() > 0.5 ? starA : starB;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { starPositions: pos, starColors: col };
  }, []);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    const time = state.clock.getElapsedTime();
    const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    // Mouse velocity target
    const targetX = mouseRef.current[0] * 0.4;
    const targetZ = mouseRef.current[1] * 0.3;

    // Tilt grid towards cursor
    points.rotation.y = THREE.MathUtils.lerp(points.rotation.y, targetX * 0.25, 0.05);
    points.rotation.x = THREE.MathUtils.lerp(points.rotation.x, 0.45 + targetZ * 0.2, 0.05);

    // Compute undulating cyber wave
    let idx = 0;
    for (let x = 0; x < gridX; x++) {
      for (let z = 0; z < gridY; z++) {
        const u = x * 0.15;
        const v = z * 0.15;
        // Dual harmonic wave with cursor interaction
        const wave =
          Math.sin(u + time * 0.8) * Math.cos(v + time * 0.6) * 0.35 +
          Math.sin(Math.sqrt(u * u + v * v) * 2 - time * 1.2) * 0.2;

        array[idx * 3 + 1] = initialY[idx] + wave;
        idx++;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group>
      {/* Dynamic Cybernetic Wave Grid */}
      <points ref={pointsRef} position={[0, -0.6, -2]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors={true}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Floating Constellation Dust */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
            count={350}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[starColors, 3]}
            count={350}
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors={true}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export const Particles: React.FC = () => {
  const mouseRef = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize values in range [-1.5, 1.5]
      mouseRef.current = [
        ((e.clientX / window.innerWidth) * 2 - 1) * 1.5,
        (- (e.clientY / window.innerHeight) * 2 + 1) * 1.5
      ];
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-60 bg-[#08090C]">
      <Canvas
        camera={{ position: [0, 1.2, 5.5], fov: 55 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.4} />
        <CyberWave mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
};
export default Particles;
