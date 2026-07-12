"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import Book3D from "./Book3D";

// Procedural Nebula Glow Component
function NebulaGlow({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const texture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.3, "rgba(255, 255, 255, 0.6)");
      grad.addColorStop(0.6, "rgba(255, 255, 255, 0.15)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.02;
    }
    if (matRef.current) {
      const elapsed = state.clock.getElapsedTime();
      // Shift hue organically based on position coordinates to mix cosmic gases
      const hueOffset = Math.abs(position[0] * 0.15 + position[1] * 0.1) % 1;
      const hue = (elapsed * 0.025 + hueOffset) % 1;
      matRef.current.color.setHSL(hue, 0.8, 0.5);
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={position} scale={[scale, scale, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={matRef}
        color={new THREE.Color(color)}
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        map={texture}
      />
    </mesh>
  );
}

// 3-Layer Starfield Component (~3000 stars total)
function Starfield() {
  const farRef = useRef<THREE.Points>(null);
  const midRef = useRef<THREE.Points>(null);
  const nearRef = useRef<THREE.Points>(null);

  // Layer 1: Far (1800 tiny dim stars, slow drift)
  const farPositions = useMemo(() => {
    const pos = new Float32Array(1800 * 3);
    for (let i = 0; i < 1800; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 2] = -12 - Math.random() * 8;
    }
    return pos;
  }, []);

  // Layer 2: Mid (900 stars, mixed warm/cool white tints)
  const [midPositions, midColors] = useMemo(() => {
    const pos = new Float32Array(900 * 3);
    const cols = new Float32Array(900 * 3);
    const colorOptions = [
      new THREE.Color("#e0f2fe"), // cool light blue
      new THREE.Color("#fff7ed"), // warm cream
      new THREE.Color("#ffffff"), // white
      new THREE.Color("#e0e7ff"), // indigo tint
    ];
    for (let i = 0; i < 900; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = -6 - Math.random() * 8;
      const c = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    return [pos, cols];
  }, []);

  // Layer 3: Near (300 bright stars)
  const nearPositions = useMemo(() => {
    const pos = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = -1 - Math.random() * 6;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (farRef.current) farRef.current.rotation.z = elapsed * 0.004;
    if (midRef.current) midRef.current.rotation.z = elapsed * -0.006;
    if (nearRef.current) nearRef.current.rotation.z = elapsed * 0.01;
  });

  return (
    <>
      <points ref={farRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[farPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#93c5fd" transparent opacity={0.35} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      <points ref={midRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[midPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[midColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      <points ref={nearRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nearPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.8} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </>
  );
}

// Procedural Spiral Galaxy Component (~15,000 particles)
function SpiralGalaxy({ accentColor }: { accentColor: string }) {
  const galaxyRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const count = 15000;
  const arms = 3;
  const radius = 6;
  const spin = 1.0;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const colorCore = new THREE.Color("#ffffff"); // Platinum white core
    const colorAccent = new THREE.Color("#0ea5e9"); // Sky teal blue (El Shaddai glow)
    const colorRim = new THREE.Color("#1e3a8a"); // Deep space navy

    for (let i = 0; i < count; i++) {
      // Concentrated core distribution
      const r = Math.pow(Math.random(), 2.2) * radius;

      const armAngle = ((i % arms) / arms) * Math.PI * 2;
      const spinAngle = r * spin;

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (r * 0.15 + 0.1);
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (r * 0.08 + 0.05);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (r * 0.15 + 0.1);

      pos[i * 3] = Math.cos(armAngle + spinAngle) * r + randomX;
      pos[i * 3 + 1] = randomY;
      pos[i * 3 + 2] = Math.sin(armAngle + spinAngle) * r + randomZ;

      // Color interpolation: core -> accent -> rim
      let mixedColor = colorCore.clone();
      if (r < radius * 0.3) {
        mixedColor.lerp(colorAccent, r / (radius * 0.3));
      } else {
        mixedColor.copy(colorAccent).lerp(colorRim, (r - radius * 0.3) / (radius * 0.7));
      }

      cols[i * 3] = mixedColor.r;
      cols[i * 3 + 1] = mixedColor.g;
      cols[i * 3 + 2] = mixedColor.b;
    }

    return [pos, cols];
  }, [accentColor]);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += delta * 0.06; // Rotate continuously
    }
    if (matRef.current) {
      // Cycle galaxy tint color between deep blue/teal and platinum white over time
      const cosTime = Math.cos(elapsed * 0.4);
      const t = (cosTime + 1) / 2; // 0 to 1
      matRef.current.color.setRGB(
        0.15 + t * 0.75, // R
        0.35 + t * 0.55, // G
        0.65 + t * 0.35  // B
      );
    }
  });

  return (
    <group ref={galaxyRef} position={[2.0, 1.2, -4.5]}>
      <points rotation={[0.95, 0, 0.4]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={matRef}
          size={0.05}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* Core glow sprite */}
      <mesh scale={[1.5, 1.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#fff3d6"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Shooting Stars Component
function ShootingStars() {
  const lineRef = useRef<THREE.Line>(null);
  const startPos = useMemo(() => new THREE.Vector3(), []);
  const endPos = useMemo(() => new THREE.Vector3(), []);
  const animState = useRef({ progress: 0, active: false });

  const lineGeometry = useMemo(() => {
    const points = [new THREE.Vector3(), new THREE.Vector3()];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const triggerStar = () => {
      const delay = (6 + Math.random() * 8) * 1000;
      
      timeoutId = setTimeout(() => {
        // Upper half bounds
        const xS = -8 + Math.random() * 6;
        const yS = 2 + Math.random() * 3;
        const zS = -5 - Math.random() * 5;

        const xE = xS + 4 + Math.random() * 2;
        const yE = yS - 2 - Math.random() * 1.5;
        const zE = zS;

        startPos.set(xS, yS, zS);
        endPos.set(xE, yE, zE);

        animState.current.progress = 0;
        animState.current.active = true;

        gsap.to(animState.current, {
          progress: 1,
          duration: 0.8,
          ease: "none",
          onComplete: () => {
            animState.current.active = false;
            triggerStar(); // schedule next
          },
        });
      }, delay);
    };

    triggerStar();
    return () => clearTimeout(timeoutId);
  }, [startPos, endPos]);

  useFrame(() => {
    if (!lineRef.current) return;

    const positions = lineRef.current.geometry.attributes.position.array as Float32Array;

    if (!animState.current.active) {
      positions.set([0, 0, 0, 0, 0, 0]);
      lineRef.current.geometry.attributes.position.needsUpdate = true;
      return;
    }

    const t = animState.current.progress;
    const headT = t;
    const tailT = Math.max(0, t - 0.2);

    const head = new THREE.Vector3().lerpVectors(startPos, endPos, headT);
    const tail = new THREE.Vector3().lerpVectors(startPos, endPos, tailT);

    positions[0] = tail.x;
    positions[1] = tail.y;
    positions[2] = tail.z;
    positions[3] = head.x;
    positions[4] = head.y;
    positions[5] = head.z;

    lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <line ref={lineRef} geometry={lineGeometry}>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}

// Scene Controller using animState interpolation
interface SceneControllerProps {
  showBook: boolean;
  isOpening: boolean;
  title: string;
  author: string;
  accentColor: string;
  onIntroComplete: () => void;
  skipIntroTriggered: boolean;
  onOpenTrigger: () => void;
}

function SceneController({
  showBook,
  isOpening,
  title,
  author,
  accentColor,
  onIntroComplete,
  skipIntroTriggered,
  onOpenTrigger,
}: SceneControllerProps) {
  const bookRef = useRef<THREE.Group>(null);
  const coverPivotRef = useRef<THREE.Group>(null);
  const pagesRef = useRef<THREE.Group>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);

  const mouseRef = useRef({ x: 0, y: 0 });

  // 3D Drag Rotation refs
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 - 1;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (isOpening) return;
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };

      if (bookRef.current) {
        targetRotation.current.x = bookRef.current.rotation.x;
        targetRotation.current.y = bookRef.current.rotation.y;
        currentRotation.current.x = bookRef.current.rotation.x;
        currentRotation.current.y = bookRef.current.rotation.y;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;
      
      targetRotation.current.y += deltaX * 0.008;
      targetRotation.current.x += deltaY * 0.008;
      
      // Limit X pitch so the user doesn't turn the book upside down
      targetRotation.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotation.current.x));
      
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isOpening]);

  // Always-instantiated object to animate via GSAP safely (no null-ref errors on start!)
  const animState = useRef({
    bookRotationY: 0,
    bookPositionY: 0,
    bookPositionX: 1.5,
    coverRotationY: 0,
    cameraZ: 5.0,
    cameraX: 0,
    cameraY: 0,
    lightX: -6,
  });

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!showBook || !isOpening) return;

    const isMobile = window.innerWidth < 768;
    const isDesktop = window.innerWidth >= 768;
    const rotateDuration = isMobile ? 2.0 : 3.0;
    const openDuration = isMobile ? 1.0 : 1.2;

    // Reset initial values in animState to match the current floating values
    // to prevent sudden jumps
    const currentYRot = bookRef.current ? bookRef.current.rotation.y : 0;
    const currentYPos = bookRef.current ? bookRef.current.position.y : 0;
    const currentXPos = isDesktop ? 1.5 : 0;

    animState.current = {
      bookRotationY: currentYRot,
      bookPositionY: currentYPos,
      bookPositionX: currentXPos,
      coverRotationY: 0,
      cameraZ: isMobile ? 6.5 : 5.0,
      cameraX: 0,
      cameraY: 0,
      lightX: -6,
    };

    // Construct the timeline targeting animState
    const tl = gsap.timeline({
      onComplete: () => {
        onIntroComplete();
      },
    });

    timelineRef.current = tl;

    // Phase 1: Slide to center, rotate, and dolly camera in
    tl.to(animState.current, {
      bookRotationY: Math.PI * 2,
      bookPositionX: 0,
      bookPositionY: 0,
      cameraZ: isMobile ? 5.5 : 4.5,
      lightX: 6,
      duration: rotateDuration,
      ease: "power2.inOut",
    });

    // Phase 2: Opening Cover (Cover pivots open + Dolly Camera close to spread)
    tl.to(
      animState.current,
      {
        coverRotationY: -Math.PI * 0.85,
        cameraZ: isMobile ? 2.2 : 1.75,
        cameraX: isMobile ? 0 : 0.75,
        duration: openDuration,
        ease: "power2.inOut",
      },
      `>=0.1`
    );

    return () => {
      tl.kill();
    };
  }, [showBook, isOpening, onIntroComplete]);

  // Handle immediate skip
  useEffect(() => {
    if (skipIntroTriggered && timelineRef.current) {
      timelineRef.current.progress(1);
      onIntroComplete();
    }
  }, [skipIntroTriggered, onIntroComplete]);

  // Copy values from animState to active meshes inside frame tick loop
  useFrame((state) => {
    if (isOpening) {
      // Animate according to timeline interpolations
      if (bookRef.current) {
        bookRef.current.rotation.y = animState.current.bookRotationY;
        bookRef.current.position.y = animState.current.bookPositionY;
        bookRef.current.position.x = animState.current.bookPositionX;
      }
      if (coverPivotRef.current) {
        coverPivotRef.current.rotation.y = animState.current.coverRotationY;
      }
      state.camera.position.z = animState.current.cameraZ;
      state.camera.position.x = animState.current.cameraX;
      state.camera.position.y = animState.current.cameraY;
    } else {
      // Idle floating animation + Drag Rotation
      const elapsed = state.clock.getElapsedTime();

      // Smooth inertia easing: interpolate current to target
      currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetRotation.current.x, 0.08);
      currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetRotation.current.y, 0.08);
      
      if (bookRef.current) {
        // Set rotation to match drag values
        bookRef.current.rotation.x = currentRotation.current.x;
        bookRef.current.rotation.y = currentRotation.current.y;
        
        // Add subtle sway roll (Z) based on time
        bookRef.current.rotation.z = Math.sin(elapsed * 0.4) * 0.03;
        
        // Float up and down
        bookRef.current.position.y = Math.sin(elapsed * 0.7) * 0.12;
        
        // Position on the right side of the screen on desktop
        const isDesktop = window.innerWidth >= 768;
        bookRef.current.position.x = isDesktop ? 1.5 : 0;
        
        // Slow auto-spin when the user is not dragging
        if (!isDragging.current) {
          targetRotation.current.y += 0.002;
        }
      }
      if (coverPivotRef.current) {
        coverPivotRef.current.rotation.y = 0; // closed cover
      }
      
      // Steady camera view with Mouse Parallax (panning left/right based on mouse)
      const isMobile = window.innerWidth < 768;
      const targetCamZ = isMobile ? 6.5 : 5.0;
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, 0.05);
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouseX * 0.4, 0.05);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouseY * 0.3, 0.05);
      state.camera.lookAt(isMobile ? 0 : 0.7, 0, 0);
    }

    if (keyLightRef.current) {
      keyLightRef.current.position.x = animState.current.lightX;
    }
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={keyLightRef}
        position={[-6, 4, 5]}
        intensity={2.2}
        color="#fafaf9"
        castShadow
      />
      <directionalLight
        position={[4, -2, -5]}
        intensity={1.8}
        color="#818cf8"
      />
      <pointLight position={[0, 0, 2]} intensity={0.6} color={accentColor} />

      {/* Book Mesh */}
      {showBook && (
        <group
          onClick={(e) => {
            e.stopPropagation();
            if (!isOpening) onOpenTrigger();
          }}
          onPointerOver={(e) => {
            if (!isOpening) document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            document.body.style.cursor = "default";
          }}
        >
          <Book3D
            bookRef={bookRef}
            coverPivotRef={coverPivotRef}
            pagesRef={pagesRef}
            title={title}
            author={author}
            accentColor={accentColor}
          />
        </group>
      )}
    </>
  );
}

interface SceneProps {
  showBook: boolean;
  isOpening: boolean;
  title: string;
  author: string;
  accentColor: string;
  onIntroComplete: () => void;
  skipIntroTriggered: boolean;
  onOpenTrigger: () => void;
}

export default function Scene({
  showBook,
  isOpening,
  title,
  author,
  accentColor,
  onIntroComplete,
  skipIntroTriggered,
  onOpenTrigger,
}: SceneProps) {
  const [particleCount, setParticleCount] = useState(3000);
  const [pixelRatio, setPixelRatio] = useState(2);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setParticleCount(isMobile ? 800 : 3000);
    setPixelRatio(isMobile ? 1.5 : Math.min(window.devicePixelRatio, 2));
  }, []);

  return (
    <div className={`absolute inset-0 w-full h-screen z-0 select-none bg-[#050508] ${showBook ? "pointer-events-auto" : "pointer-events-none"}`}>
      <Canvas
        dpr={pixelRatio}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#050508"]} />
        
        {/* Nebulae clouds */}
        <NebulaGlow position={[-4, 2, -4]} color="#6366f1" scale={6} />
        <NebulaGlow position={[4, -2, -4]} color="#8b5cf6" scale={7} />
        <NebulaGlow position={[0, 1, -5]} color="#4f46e5" scale={5} />

        <Starfield />
        <SpiralGalaxy accentColor={accentColor} />
        <ShootingStars />

        <SceneController
          showBook={showBook}
          isOpening={isOpening}
          title={title}
          author={author}
          accentColor={accentColor}
          onIntroComplete={onIntroComplete}
          skipIntroTriggered={skipIntroTriggered}
          onOpenTrigger={onOpenTrigger}
        />
      </Canvas>
    </div>
  );
}
