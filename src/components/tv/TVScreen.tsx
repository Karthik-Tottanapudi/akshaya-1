/**
 * Relationship TV - CRT Screen Component
 * Canvas-based texture with timer display
 */

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_BULGE, COLORS, MATERIALS } from '@/utils/constants';
import { useTimer } from '@/hooks/useTimer';
import { formatFullDisplay, formatSingleValue, getModeLabel } from '@/time/timer';

// Canvas resolution
const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 320;

export function TVScreen() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { diff, mode, increments } = useTimer();

  // Create canvas and texture once
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvasRef.current = canvas;

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    setTexture(tex);

    return () => {
      tex.dispose();
    };
  }, []);

  // Create curved geometry for CRT bulge effect
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT, 32, 32);
    const positions = geo.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      
      // Calculate distance from center (normalized)
      const nx = x / (SCREEN_WIDTH / 2);
      const ny = y / (SCREEN_HEIGHT / 2);
      const dist = Math.sqrt(nx * nx + ny * ny);
      
      // Apply bulge (strongest at center)
      const bulge = SCREEN_BULGE * (1 - dist * 0.5) * Math.cos(dist * Math.PI * 0.5);
      positions.setZ(i, bulge);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  // Draw screen content every frame
  useFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas || !texture) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with dark green background
    ctx.fillStyle = '#030a06';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw vignette
    const gradient = ctx.createRadialGradient(
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0,
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH * 0.7
    );
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw scanlines
    ctx.fillStyle = 'rgba(0, 20, 0, 0.1)';
    for (let y = 0; y < CANVAS_HEIGHT; y += 4) {
      ctx.fillRect(0, y, CANVAS_WIDTH, 2);
    }

    // Set text style
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = COLORS.crtGreen;
    ctx.shadowBlur = 15;

    if (mode === 'full') {
      // Multi-line display
      const lines = formatFullDisplay(diff);
      const lineHeight = 42;
      const startY = (CANVAS_HEIGHT - lines.length * lineHeight) / 2 + 20;

      ctx.font = '28px "Share Tech Mono", monospace';
      ctx.fillStyle = COLORS.crtGreen;

      lines.forEach((line, i) => {
        ctx.fillText(line, CANVAS_WIDTH / 2, startY + i * lineHeight);
      });
    } else {
      // Single value display
      const value = formatSingleValue(diff, mode);
      const label = getModeLabel(mode);

      // Large value
      ctx.font = 'bold 64px "Share Tech Mono", monospace';
      ctx.fillStyle = COLORS.crtGreen;
      ctx.fillText(value, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);

      // Label below
      ctx.font = '24px "Share Tech Mono", monospace';
      ctx.fillStyle = COLORS.crtGreenDim;
      ctx.shadowBlur = 8;
      ctx.fillText(label, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
    }

    // Draw increment animations
    const now = Date.now();
    increments.forEach(inc => {
      const elapsed = now - inc.startTime;
      const progress = Math.min(elapsed / 1000, 1);
      const opacity = 1 - progress;
      const yOffset = progress * 40;

      ctx.font = 'bold 36px "Share Tech Mono", monospace';
      ctx.fillStyle = `rgba(182, 255, 211, ${opacity})`;
      ctx.shadowBlur = 10 * opacity;
      
      const x = (inc.x / 100) * CANVAS_WIDTH;
      const y = (inc.y / 100) * CANVAS_HEIGHT - yOffset;
      
      ctx.fillText(inc.value, x, y);
    });

    // Inner glow edge
    ctx.shadowBlur = 0;
    const innerGlow = ctx.createRadialGradient(
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH * 0.35,
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH * 0.55
    );
    innerGlow.addColorStop(0, 'transparent');
    innerGlow.addColorStop(1, 'rgba(7, 27, 7, 0.4)');
    ctx.fillStyle = innerGlow;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    texture.needsUpdate = true;
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0.31]}>
      <meshStandardMaterial
        map={texture}
        emissive={new THREE.Color(0x071b07)}
        emissiveIntensity={MATERIALS.screen.emissiveIntensity}
        metalness={MATERIALS.screen.metalness}
        roughness={MATERIALS.screen.roughness}
      />
    </mesh>
  );
}
