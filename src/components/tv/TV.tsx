/**
 * Relationship TV - Main TV Component
 * Assembles body, screen, and buttons
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { TV_WIDTH, TV_HEIGHT, TV_DEPTH, COLORS, MATERIALS } from '@/utils/constants';
import { TVScreen } from './TVScreen';
import { TVButtons } from './TVButtons';

interface TVProps {
  rotation: number;
  isBackVisible: boolean;
}

export function TV({ rotation, isBackVisible }: TVProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Smoothly update rotation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        rotation,
        0.15
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main TV Body */}
      <RoundedBox
        args={[TV_WIDTH, TV_HEIGHT, TV_DEPTH]}
        radius={0.04}
        smoothness={4}
      >
        <meshStandardMaterial
          color={COLORS.tvBody}
          metalness={MATERIALS.tvBody.metalness}
          roughness={MATERIALS.tvBody.roughness}
        />
      </RoundedBox>

      {/* Screen bezel (slightly recessed frame) */}
      <RoundedBox
        args={[1.35, 0.85, 0.05]}
        radius={0.02}
        smoothness={4}
        position={[0, 0, 0.26]}
      >
        <meshStandardMaterial
          color={0x0a0a10}
          metalness={0.02}
          roughness={0.8}
        />
      </RoundedBox>

      {/* CRT Screen */}
      <TVScreen />

      {/* Back panel details */}
      <BackPanelDetails />

      {/* Interactive buttons on back */}
      <TVButtons isBackVisible={isBackVisible} />

      {/* Decorative elements */}
      <TVDecorations />
    </group>
  );
}

// Back panel aesthetic details
function BackPanelDetails() {
  return (
    <group position={[0, 0, -TV_DEPTH / 2]}>
      {/* Vent grilles */}
      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.35, 0.01]} rotation={[0, Math.PI, 0]}>
          <boxGeometry args={[0.08, 0.08, 0.01]} />
          <meshStandardMaterial color={0x0a0a0f} metalness={0.1} roughness={0.9} />
        </mesh>
      ))}

      {/* Label plate */}
      <mesh position={[0, -0.35, 0.01]} rotation={[0, Math.PI, 0]}>
        <boxGeometry args={[0.6, 0.08, 0.005]} />
        <meshStandardMaterial color={0x1a1a20} metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  );
}

// Decorative elements (knobs, speaker grille, etc.)
function TVDecorations() {
  return (
    <group>
      {/* Power LED indicator */}
      <mesh position={[0.65, -0.35, TV_DEPTH / 2 + 0.01]}>
        <circleGeometry args={[0.015, 16]} />
        <meshStandardMaterial 
          color={0x00ff66}
          emissive={0x00ff66}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Speaker grille area (right side) */}
      <group position={[0.65, 0.1, TV_DEPTH / 2]}>
        {[0, 0.04, 0.08, 0.12, 0.16].map((y, i) => (
          <mesh key={i} position={[0, y - 0.08, 0.01]}>
            <boxGeometry args={[0.08, 0.015, 0.01]} />
            <meshStandardMaterial color={0x0a0a10} metalness={0.1} roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Channel/Volume knobs */}
      <group position={[0.65, -0.1, TV_DEPTH / 2 + 0.02]}>
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
          <meshStandardMaterial color={0x2a2a30} metalness={0.2} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
          <meshStandardMaterial color={0x2a2a30} metalness={0.2} roughness={0.6} />
        </mesh>
      </group>

      {/* Brand text area */}
      <mesh position={[-0.45, -0.38, TV_DEPTH / 2 + 0.01]}>
        <planeGeometry args={[0.4, 0.06]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
