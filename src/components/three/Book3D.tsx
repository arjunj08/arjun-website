"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface Book3DProps {
  bookRef: React.RefObject<THREE.Group>;
  coverPivotRef: React.RefObject<THREE.Group>;
  pagesRef: React.RefObject<THREE.Group>;
  title: string;
  author: string;
  accentColor: string;
}

export default function Book3D({
  bookRef,
  coverPivotRef,
  pagesRef,
  title,
  author,
  accentColor,
}: Book3DProps) {
  // 1. Premium Materials
  const coverMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#03050c"), // Dark space black cover (matching Reference Logo background)
      roughness: 0.75,
      metalness: 0.1,
    });
  }, []);

  const goldMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#cbd5e1"), // Platinum silver (matching reference logo filigree)
      roughness: 0.1,
      metalness: 0.95,
      emissive: new THREE.Color("#94a3b8"), // Metallic silver-blue glow
      emissiveIntensity: 0.3,
    });
  }, []);

  const pageMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#faf6e8"), // Cream paper
      roughness: 0.85,
      metalness: 0.0,
    });
  }, []);

  const logMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#422b1d"), // Dark wood brown
      roughness: 0.85,
      metalness: 0.1,
    });
  }, []);

  const stickMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#8b5a2b"), // Woody stick brown
      roughness: 0.7,
      metalness: 0.0,
    });
  }, []);

  const marshmallowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ffffff"), // Marshmallow white
      roughness: 0.9,
      metalness: 0.0,
    });
  }, []);

  const orangeFlameMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ff4500"), // Bright orange
      roughness: 0.2,
      metalness: 0.1,
      emissive: new THREE.Color("#ff4500"),
      emissiveIntensity: 1.5,
    });
  }, []);

  const yellowFlameMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ffcc00"), // Glowing yellow
      roughness: 0.2,
      metalness: 0.1,
      emissive: new THREE.Color("#ffcc00"),
      emissiveIntensity: 2.0,
    });
  }, []);

  // 2. Corner Bracket component helper (adds heavy grimoire styling)
  const CornerBracket = ({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => (
    <group position={position} rotation={rotation}>
      {/* Horizontal leg */}
      <mesh material={goldMaterial}>
        <boxGeometry args={[0.7, 0.08, 0.03]} />
      </mesh>
      {/* Vertical leg */}
      <mesh position={[-0.31, -0.31, 0]} material={goldMaterial}>
        <boxGeometry args={[0.08, 0.7, 0.03]} />
      </mesh>
      {/* Diagonal brace */}
      <mesh position={[-0.15, -0.15, 0.005]} rotation={[0, 0, Math.PI / 4]} material={goldMaterial}>
        <boxGeometry args={[0.3, 0.06, 0.02]} />
      </mesh>
      {/* Corner rivet spheres */}
      <mesh position={[-0.31, 0.31, 0.02]} material={goldMaterial}>
        <sphereGeometry args={[0.045, 12, 12]} />
      </mesh>
      <mesh position={[0.31, -0.31, 0.02]} material={goldMaterial}>
        <sphereGeometry args={[0.045, 12, 12]} />
      </mesh>
      <mesh position={[0, 0, 0.02]} material={goldMaterial}>
        <sphereGeometry args={[0.035, 12, 12]} />
      </mesh>
    </group>
  );

  // 3. Animate paper flutters and color-shifting emissive glow
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // Subtle page flutter
    if (pagesRef.current) {
      pagesRef.current.children.forEach((child) => {
        if (child.name.startsWith("flutterPage")) {
          const idx = parseInt(child.name.replace("flutterPage-", "")) || 0;
          child.rotation.z = Math.sin(elapsed * 8 + idx) * 0.003;
        }
      });
    }

    // Glow cycle the metallic silver filigrees (syncs with galaxy color shifts)
    const pulse = 0.2 + Math.sin(elapsed * 1.5) * 0.15;
    goldMaterial.emissive.setRGB(0.7, 0.75, 0.85); // Silver-blue glow
    goldMaterial.emissiveIntensity = pulse;

    // Flicker the campfire flames dynamically
    const flameFlicker1 = 1.2 + Math.sin(elapsed * 12) * 0.3;
    const flameFlicker2 = 1.8 + Math.cos(elapsed * 15) * 0.4;
    orangeFlameMaterial.emissiveIntensity = flameFlicker1;
    yellowFlameMaterial.emissiveIntensity = flameFlicker2;
  });

  return (
    <group ref={bookRef}>
      {/* ================= 1. BACK COVER ================= */}
      <mesh position={[0, 0, -0.16]} material={coverMaterial} receiveShadow castShadow>
        <boxGeometry args={[3.1, 4.1, 0.08]} />
      </mesh>

      {/* ================= 2. SPINE & RAISED BINDING RIBS ================= */}
      <group position={[-1.57, 0, -0.04]}>
        {/* Curved spine block */}
        <mesh material={coverMaterial} castShadow>
          <boxGeometry args={[0.08, 4.1, 0.32]} />
        </mesh>
        
        {/* Raised leather ribs */}
        {[-1.5, -0.75, 0, 0.75, 1.5].map((yOffset, idx) => (
          <mesh key={idx} position={[0.015, yOffset, 0]} material={coverMaterial}>
            <boxGeometry args={[0.07, 0.1, 0.34]} />
          </mesh>
        ))}

        {/* Spine vertical gold fill line */}
        <mesh position={[-0.04, 0, 0]} material={goldMaterial}>
          <boxGeometry args={[0.01, 3.8, 0.02]} />
        </mesh>
      </group>
      
      {/* ================= 3. MULTI-LAYERED STACKED PAGES ================= */}
      <group ref={pagesRef}>
        {/* Core block */}
        <mesh position={[-0.02, 0, -0.04]} material={pageMaterial}>
          <boxGeometry args={[2.96, 3.96, 0.2]} />
        </mesh>
        
        {/* Staircased paper layers (gives physical page ridges look) */}
        {Array.from({ length: 16 }).map((_, i) => {
          const thickness = 0.01;
          const widthOffset = 0.02 * (i / 16);
          const heightOffset = 0.02 * (i / 16);
          const zPos = -0.04 + (i * 0.008);
          const flutterIndex = i;
          return (
            <mesh
              key={i}
              name={`flutterPage-${flutterIndex}`}
              position={[-0.01, 0, zPos]}
              material={pageMaterial}
              receiveShadow
            >
              <boxGeometry args={[2.95 - widthOffset, 3.95 - heightOffset, thickness]} />
            </mesh>
          );
        })}
      </group>

      {/* ================= 4. FRONT COVER & EMBOSSING ================= */}
      <group ref={coverPivotRef} position={[-1.55, 0, 0.08]}>
        {/* Hinge alignment group */}
        <group position={[1.55, 0, 0]}>
          {/* Main leather cover plate */}
          <mesh material={coverMaterial} castShadow>
            <boxGeometry args={[3.1, 4.1, 0.08]} />
          </mesh>

          {/* Raised Metal Hinges on front cover hinge edge */}
          {[-1.3, 1.3].map((yOffset, idx) => (
            <group key={idx} position={[-1.52, yOffset, 0.025]}>
              {/* Hinge Pin */}
              <mesh rotation={[Math.PI / 2, 0, 0]} material={goldMaterial}>
                <cylinderGeometry args={[0.045, 0.045, 0.22, 12]} />
              </mesh>
              {/* Hinge plate wrapping onto cover */}
              <mesh position={[0.08, 0, -0.01]} material={goldMaterial}>
                <boxGeometry args={[0.15, 0.1, 0.02]} />
              </mesh>
            </group>
          ))}

          {/* Double Nested gold panel inlay border */}
          <mesh position={[0, 0, 0.042]} material={goldMaterial}>
            <boxGeometry args={[2.92, 3.92, 0.01]} />
          </mesh>
          <mesh position={[0, 0, 0.044]} material={coverMaterial}>
            <boxGeometry args={[2.84, 3.84, 0.01]} />
          </mesh>
          <mesh position={[0, 0, 0.046]} material={goldMaterial}>
            <boxGeometry args={[2.8, 3.8, 0.005]} />
          </mesh>
          <mesh position={[0, 0, 0.048]} material={coverMaterial}>
            <boxGeometry args={[2.74, 3.74, 0.005]} />
          </mesh>

          {/* Decorative Corner Brackets (adds heavy grimoire styling) */}
          <CornerBracket position={[-1.15, 1.65, 0.05]} rotation={[0, 0, 0]} />
          <CornerBracket position={[1.15, 1.65, 0.05]} rotation={[0, 0, -Math.PI / 2]} />
          <CornerBracket position={[1.15, -1.65, 0.05]} rotation={[0, 0, Math.PI]} />
          <CornerBracket position={[-1.15, -1.65, 0.05]} rotation={[0, 0, Math.PI / 2]} />

          {/* ================= CAMPFIRE & ROASTING MARSHMALLOWS ================= */}
          <group position={[0, -0.2, 0.05]}>
            {/* 1. Fire Logs (crossed brown cylinders/boxes) */}
            <group position={[0, -0.42, 0]}>
              <mesh rotation={[0, 0, Math.PI / 6]} material={logMaterial} castShadow>
                <boxGeometry args={[0.7, 0.12, 0.08]} />
              </mesh>
              <mesh rotation={[0, 0, -Math.PI / 6]} material={logMaterial} castShadow>
                <boxGeometry args={[0.7, 0.12, 0.08]} />
              </mesh>
              <mesh position={[0, 0.04, 0.04]} rotation={[0, 0, 0]} material={logMaterial}>
                <boxGeometry args={[0.5, 0.1, 0.08]} />
              </mesh>
            </group>

            {/* 2. Glowing Flames (stacked cones/spheres of orange and yellow) */}
            {/* Outer Orange Flame */}
            <mesh position={[0, -0.15, 0.03]} material={orangeFlameMaterial}>
              <coneGeometry args={[0.26, 0.65, 16]} />
            </mesh>
            {/* Inner Yellow Flame */}
            <mesh position={[0, -0.22, 0.05]} material={yellowFlameMaterial}>
              <coneGeometry args={[0.16, 0.45, 16]} />
            </mesh>
            {/* Flame Sparks */}
            {[-0.18, 0.18].map((xOff, idx) => (
              <mesh key={idx} position={[xOff, -0.05, 0.04]} material={yellowFlameMaterial}>
                <boxGeometry args={[0.03, 0.05, 0.03]} />
              </mesh>
            ))}
            {[0.0, -0.08, 0.08].map((xOff, idx) => (
              <mesh key={idx} position={[xOff, 0.15 + (idx * 0.05), 0.04]} material={orangeFlameMaterial}>
                <boxGeometry args={[0.025, 0.04, 0.025]} />
              </mesh>
            ))}

            {/* 3. Marshmallow Sticks (thin brown lines/cylinders angled in) */}
            {/* Left Stick */}
            <mesh position={[-0.55, -0.1, 0.04]} rotation={[0, 0, -Math.PI / 10]} material={stickMaterial}>
              <boxGeometry args={[0.6, 0.02, 0.02]} />
            </mesh>
            {/* Left Marshmallow */}
            <mesh position={[-0.26, -0.01, 0.04]} rotation={[0, 0, -Math.PI / 10]} material={marshmallowMaterial}>
              <cylinderGeometry args={[0.07, 0.07, 0.16, 12]} />
            </mesh>

            {/* Right Stick */}
            <mesh position={[0.55, -0.1, 0.04]} rotation={[0, 0, Math.PI / 10]} material={stickMaterial}>
              <boxGeometry args={[0.6, 0.02, 0.02]} />
            </mesh>
            {/* Right Marshmallow */}
            <mesh position={[0.26, -0.01, 0.04]} rotation={[0, 0, Math.PI / 10]} material={marshmallowMaterial}>
              <cylinderGeometry args={[0.07, 0.07, 0.16, 12]} />
            </mesh>
          </group>

          {/* Embossed Book Title */}
          <Text
            position={[0, 0.7, 0.052]}
            color={accentColor || "#ff4500"}
            fontSize={0.24}
            maxWidth={2.2}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
          >
            {title ? title.toUpperCase() : "THE LIVING BOOK"}
          </Text>

          {/* Author Name */}
          <Text
            position={[0, -0.9, 0.052]}
            color="#e2e8f0"
            fontSize={0.12}
            maxWidth={2.2}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
          >
            {author ? `BY ${author.toUpperCase()}` : "BY EDUCATOR"}
          </Text>
        </group>
      </group>
    </group>
  );
}
