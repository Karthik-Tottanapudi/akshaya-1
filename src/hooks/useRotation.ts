/**
 * Relationship TV - Rotation Hook
 * Handles touch/mouse drag rotation with snapping
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { ROTATION_MIN, ROTATION_MAX, ROTATION_SNAP_THRESHOLD, SNAP_DURATION } from '@/utils/constants';

interface RotationState {
  rotation: number;
  isDragging: boolean;
}

// Easing function for smooth snap animation
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useRotation() {
  const [state, setState] = useState<RotationState>({
    rotation: 0,
    isDragging: false,
  });

  const dragStartX = useRef<number>(0);
  const dragStartRotation = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const viewportWidth = useRef<number>(typeof window !== 'undefined' ? window.innerWidth : 1000);

  // Update viewport width on resize
  useEffect(() => {
    const handleResize = () => {
      viewportWidth.current = window.innerWidth;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cancel any ongoing snap animation
  const cancelSnap = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Snap to nearest endpoint
  const snapToNearest = useCallback((currentRotation: number) => {
    const target = currentRotation < ROTATION_SNAP_THRESHOLD ? ROTATION_MIN : ROTATION_MAX;
    const startRotation = currentRotation;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / SNAP_DURATION, 1);
      const eased = easeOutCubic(progress);
      
      const newRotation = startRotation + (target - startRotation) * eased;
      
      setState(prev => ({ ...prev, rotation: newRotation }));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Begin drag
  const beginDrag = useCallback((clientX: number) => {
    cancelSnap();
    dragStartX.current = clientX;
    dragStartRotation.current = state.rotation;
    setState(prev => ({ ...prev, isDragging: true }));
  }, [state.rotation, cancelSnap]);

  // Update drag
  const updateDrag = useCallback((clientX: number) => {
    if (!state.isDragging) return;

    const dx = dragStartX.current - clientX; // Inverted: drag left = rotate right
    const deltaRotation = (dx / viewportWidth.current) * Math.PI;
    
    let newRotation = dragStartRotation.current + deltaRotation;
    // Clamp rotation
    newRotation = Math.max(ROTATION_MIN, Math.min(ROTATION_MAX, newRotation));
    
    setState(prev => ({ ...prev, rotation: newRotation }));
  }, [state.isDragging]);

  // End drag
  const endDrag = useCallback(() => {
    if (!state.isDragging) return;
    setState(prev => ({ ...prev, isDragging: false }));
    snapToNearest(state.rotation);
  }, [state.isDragging, state.rotation, snapToNearest]);

  // Keyboard navigation
  const handleKeyboard = useCallback((direction: 'left' | 'right') => {
    cancelSnap();
    const delta = direction === 'right' ? 0.1 : -0.1;
    setState(prev => {
      const newRotation = Math.max(ROTATION_MIN, Math.min(ROTATION_MAX, prev.rotation + delta));
      return { ...prev, rotation: newRotation };
    });
  }, [cancelSnap]);

  // Check if back is visible for button interactions
  const isBackVisible = state.rotation > 0.6 * Math.PI;

  return {
    rotation: state.rotation,
    isDragging: state.isDragging,
    isBackVisible,
    beginDrag,
    updateDrag,
    endDrag,
    handleKeyboard,
    snapToNearest,
  };
}
