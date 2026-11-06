
import { Suspense, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { TV } from '@/components/tv/TV';
import { Starfield } from './Starfield';
import { SceneLights } from './SceneLights';
import { useRotation } from '@/hooks/useRotation';
import { modeState } from '@/utils/state';

export function Scene() {
  const {
    rotation,
    isBackVisible,
    beginDrag,
    updateDrag,
    endDrag,
    handleKeyboard,
  } = useRotation();

  // Pointer event handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    beginDrag(e.clientX);
  }, [beginDrag]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    updateDrag(e.clientX);
  }, [updateDrag]);

  const handlePointerUp = useCallback(() => {
    endDrag();
  }, [endDrag]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          handleKeyboard('left');
          break;
        case 'ArrowRight':
          handleKeyboard('right');
          break;
        case 'Escape':
          modeState.setMode('full');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyboard]);

  return (
    <div
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        {/* Camera */}
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 3]}
          fov={45}
          near={0.1}
          far={100}
        />

        {/* Background color */}
        <color attach="background" args={['#02020b']} />

        {/* Fog for depth */}
        <fog attach="fog" args={['#02020b', 8, 25]} />

        {/* Lights */}
        <SceneLights />

        {/* Stars */}
        <Starfield />

        <Suspense fallback={null}>
          {/* The TV */}
          <TV rotation={rotation} isBackVisible={isBackVisible} />
        </Suspense>
      </Canvas>
    </div>
  );
}
