/**
 * Relationship TV - Scene Setup
 * Lights and environment
 */

import { LIGHTS } from '@/utils/constants';

export function SceneLights() {
  return (
    <>
      {/* Ambient fill light */}
      <ambientLight intensity={LIGHTS.ambient.intensity} color="#e8e8ff" />
      
      {/* Main key light (above-left) */}
      <directionalLight
        position={LIGHTS.directional.position}
        intensity={LIGHTS.directional.intensity}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Soft rim light from behind */}
      <directionalLight
        position={[2, 1, -3]}
        intensity={0.3}
        color="#4466ff"
      />
      
      {/* Subtle green accent from screen glow simulation */}
      <pointLight
        position={[0, 0, 1.5]}
        intensity={0.2}
        color="#66ffaa"
        distance={4}
        decay={2}
      />
    </>
  );
}
