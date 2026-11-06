/**
 * Relationship TV - Main Page
 * An emotional keepsake displaying time since a relationship began
 */

import { useMemo, useState, useEffect } from 'react';
import { Scene } from '@/components/scene/Scene';
import { WebGLFallback, isWebGLAvailable } from '@/components/WebGLFallback';
import { AccessibilityAnnouncer } from '@/components/AccessibilityAnnouncer';
import { DateLabel } from '@/components/DateLabel';

const Index = () => {
  // Check WebGL availability once on mount
  const hasWebGL = useMemo(() => isWebGLAvailable(), []);
  const [showInstructions, setShowInstructions] = useState(true);

  // Hide instructions after first interaction
  useEffect(() => {
    const handleInteraction = () => {
      setShowInstructions(false);
    };
    
    window.addEventListener('pointerdown', handleInteraction, { once: true });
    return () => window.removeEventListener('pointerdown', handleInteraction);
  }, []);

  return (
    <main className="fixed inset-0 overflow-hidden">
      {/* Screen reader announcements */}
      <AccessibilityAnnouncer />

      {/* 3D Scene or Fallback */}
      {hasWebGL ? <Scene /> : <WebGLFallback />}

      {/* Date label */}
      {hasWebGL && <DateLabel />}

      {/* Instructions overlay - fade out after interaction */}
      {showInstructions && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-500">
          <p className="text-muted-foreground/60 text-sm font-mono text-center animate-pulse">
            Drag to rotate • View buttons on back
          </p>
        </div>
      )}
    </main>
  );
};

export default Index;
