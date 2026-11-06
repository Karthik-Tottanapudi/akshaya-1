/**
 * Relationship TV - Back Panel Buttons
 * 3D mesh buttons for mode selection
 */

import { useRef, useState, useCallback } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { BUTTON_PRESS_DEPTH, COLORS, DisplayMode } from '@/utils/constants';
import { modeState } from '@/utils/state';

interface ButtonConfig {
  id: DisplayMode | 'reset';
  label: string;
  position: [number, number, number];
}

const BUTTON_CONFIGS: ButtonConfig[] = [
  { id: 'seconds', label: 'SEC', position: [-0.45, 0.2, -0.29] },
  { id: 'minutes', label: 'MIN', position: [0, 0.2, -0.29] },
  { id: 'hours', label: 'HRS', position: [0.45, 0.2, -0.29] },
  { id: 'days', label: 'DAY', position: [-0.45, -0.15, -0.29] },
  { id: 'months', label: 'MON', position: [0, -0.15, -0.29] },
  { id: 'reset', label: 'RST', position: [0.45, -0.15, -0.29] },
];

interface TVButtonProps {
  config: ButtonConfig;
  isActive: boolean;
  isBackVisible: boolean;
  onPress: (id: DisplayMode | 'reset') => void;
}

function TVButton({ config, isActive, isBackVisible, onPress }: TVButtonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const targetZ = useRef(0);

  // Animate button press
  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const target = isActive ? -BUTTON_PRESS_DEPTH : 0;
    targetZ.current = THREE.MathUtils.lerp(targetZ.current, target, delta * 15);
    
    meshRef.current.position.z = config.position[2] + targetZ.current;
  });

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (isBackVisible) {
      onPress(config.id);
    }
  }, [isBackVisible, config.id, onPress]);

  // Calculate color based on state
  const color = isActive 
    ? new THREE.Color(COLORS.buttonPressed) 
    : isHovered && isBackVisible
      ? new THREE.Color(0x3a3a44)
      : new THREE.Color(COLORS.buttonDefault);

  return (
    <group position={[config.position[0], config.position[1], 0]}>
      {/* Button body */}
      <mesh
        ref={meshRef}
        position={[0, 0, config.position[2]]}
        onClick={handleClick}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        rotation={[0, Math.PI, 0]}
      >
        <boxGeometry args={[0.25, 0.18, 0.04]} />
        <meshStandardMaterial
          color={color}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>
      
      {/* Button label - text sprite */}
      <mesh position={[0, 0, config.position[2] - 0.025]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.2, 0.1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

interface TVButtonsProps {
  isBackVisible: boolean;
}

export function TVButtons({ isBackVisible }: TVButtonsProps) {
  const [activeButton, setActiveButton] = useState<DisplayMode | 'reset' | null>(null);

  const handlePress = useCallback((id: DisplayMode | 'reset') => {
    if (id === 'reset') {
      setActiveButton(null);
      modeState.setMode('full');
    } else {
      setActiveButton(id);
      modeState.setMode(id);
    }
  }, []);

  return (
    <group name="buttons">
      {BUTTON_CONFIGS.map((config) => (
        <TVButton
          key={config.id}
          config={config}
          isActive={activeButton === config.id}
          isBackVisible={isBackVisible}
          onPress={handlePress}
        />
      ))}
      
      {/* Button labels rendered as canvas textures */}
      <ButtonLabels configs={BUTTON_CONFIGS} />
    </group>
  );
}

// Button labels using canvas textures
function ButtonLabels({ configs }: { configs: ButtonConfig[] }) {
  return (
    <>
      {configs.map((config) => (
        <ButtonLabel key={config.id} config={config} />
      ))}
    </>
  );
}

function ButtonLabel({ config }: { config: ButtonConfig }) {
  const texture = useRef<THREE.CanvasTexture | null>(null);

  // Create label texture
  if (!texture.current) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, 64, 32);
      
      ctx.font = 'bold 16px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#8a8a9a';
      ctx.fillText(config.label, 32, 16);
    }
    
    texture.current = new THREE.CanvasTexture(canvas);
  }

  return (
    <mesh 
      position={[config.position[0], config.position[1], config.position[2] - 0.025]}
      rotation={[0, Math.PI, 0]}
    >
      <planeGeometry args={[0.2, 0.1]} />
      <meshBasicMaterial 
        map={texture.current} 
        transparent 
        depthWrite={false}
      />
    </mesh>
  );
}
